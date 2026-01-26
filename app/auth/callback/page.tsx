"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { motion } from "framer-motion";
import Spinner from "@/app/[locale]/component/global/spinner";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let active = true;

    async function handleAuth() {
      try {
        // Get locale from query params (passed via redirectTo)
        const localeFromUrl = searchParams.get("locale");
        
        // Grab tokens from URL hash (Supabase OAuth returns them here)
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        
        // Parse cookies properly
        const getCookies = document.cookie.split(";");
        const localeCookie = getCookies.find((cookie) => 
          cookie.trim().startsWith("oauth_locale=")
        );
        
        // Extract the locale value from the cookie
        const localeFromCookie = localeCookie 
          ? localeCookie.split("=")[1].trim() 
          : null;

        console.log("Auth details:", { 
          access_token: access_token ? "present" : "missing",
          refresh_token: refresh_token ? "present" : "missing",
          localeFromUrl,
          localeFromCookie,
          allCookies: getCookies.map(c => c.trim())
        });
        
        if (!access_token || !refresh_token) {
          throw new Error("Missing auth tokens. Try signing in again.");
        }

        // Apply tokens to Supabase session
        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (sessionError) throw new Error(sessionError.message);

        // Confirm session is live
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) throw new Error("Unable to start session.");

        // Get user
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;

        // Priority order for locale:
        // 1. URL query param (user's choice at login)
        // 2. Cookie value (from OAuth flow)
        // 3. User's saved preference
        // 4. Default to "en"
        let locale = localeFromUrl || localeFromCookie || "en";

        if (user) {
          // Check existing user profile for locale
          const { data: profile } = await supabase
            .from("user_data")
            .select("language")
            .eq("user_id", user.id)
            .maybeSingle();

          // Only use saved preference if no locale was passed in URL or cookie
          if (!localeFromUrl && !localeFromCookie && profile?.language) {
            locale = profile.language;
          }

          // Upsert basic user_data
          await supabase.from("user_data").upsert(
            {
              user_id: user.id,
              country: "World",
              state: "N/A",
              language: locale,
            },
            { onConflict: "user_id" }
          );
        }

        // Clear the oauth_locale cookie after use
        if (localeFromCookie) {
          document.cookie = "oauth_locale=; path=/; max-age=0";
        }

        // Let Supabase settle
        await new Promise((r) => setTimeout(r, 150));

        if (!active) return;

        // Redirect to localized chat
        router.replace(`/${locale}/chat`);
      } catch (err) {
        console.error("Auth callback failed:", err);
        if (active) {
          setError(err instanceof Error ? err.message : "Auth failed.");
        }
      } finally {
        if (active) setIsProcessing(false);
      }
    }

    handleAuth();

    return () => {
      active = false;
    };
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4 p-6">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-gold"
        >
          Something went wrong
        </motion.h2>
        <p className="text-white/80 max-w-sm">{error}</p>
        <button
          onClick={() => router.push("/en/login")}
          className="mt-3 px-5 py-2 rounded-lg bg-gold text-black font-medium hover:bg-gold/90 transition"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-3 p-6">
      <Spinner />
      <p className="text-gold text-base font-medium">
        Completing authentication…
      </p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen text-center gap-3 p-6">
        <Spinner />
        <p className="text-gold text-base font-medium">
          Loading...
        </p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}