"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { motion } from "framer-motion";
import Spinner from "../../components/global/spinner";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let active = true;

    async function handleAuth() {
      try {
        // Check for OAuth errors first
        const errorParam = searchParams.get("error");
        const errorDesc = searchParams.get("error_description");
        
        if (errorParam) {
          throw new Error(
            `OAuth Error: ${errorDesc || errorParam}. Please try signing in again.`
          );
        }

        console.log("Auth callback started, checking for session...");

        // Let Supabase recover the session from cookies automatically
        // This is the preferred method for handling OAuth callbacks
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw new Error(`Session error: ${sessionError.message}`);
        }

        if (!session) {
          throw new Error(
            "No session found. The OAuth flow may have been interrupted. Please try signing in again."
          );
        }

        console.log("Session recovered successfully");

        const user = session.user;
        if (!user) {
          throw new Error("User data not found in session");
        }

        // Parse locale from cookie
        const getCookies = document.cookie.split(";");
        const localeCookie = getCookies.find((cookie) => 
          cookie.trim().startsWith("oauth_locale=")
        );
        
        const localeFromCookie = localeCookie 
          ? localeCookie.split("=")[1].trim() 
          : null;

        // Determine final locale
        // Priority: cookie > saved preference > default "en"
        let locale = localeFromCookie || "en";

        console.log("Locale determined:", { 
          fromCookie: localeFromCookie,
          final: locale,
        });

        // Check user's saved language preference
        const { data: profile, error: profileError } = await supabase
          .from("user_data")
          .select("language")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) {
          console.warn("Error fetching user profile:", profileError);
        }

        // If no cookie locale was provided, use saved preference
        if (!localeFromCookie && profile?.language) {
          locale = profile.language;
        }

        // Upsert user_data with current locale
        const { error: upsertError } = await supabase.from("user_data").upsert(
          {
            user_id: user.id,
            country: "World",
            state: "N/A",
            language: locale,
          },
          { onConflict: "user_id" }
        );

        if (upsertError) {
          console.error("Error upserting user_data:", upsertError);
          // Don't throw - this is not critical to the auth flow
        }

        // Clear the oauth_locale cookie after use
        if (localeFromCookie) {
          document.cookie = "oauth_locale=; path=/; max-age=0; SameSite=Lax";
        }

        // Let Supabase settle
        await new Promise((r) => setTimeout(r, 150));

        if (!active) return;

        console.log(`Redirecting to /${locale}/chat`);
        // Redirect to localized chat
        router.replace(`/${locale}/chat`);
      } catch (err) {
        console.error("Auth callback failed:", err);
        if (active) {
          setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
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
          Authentication Failed
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