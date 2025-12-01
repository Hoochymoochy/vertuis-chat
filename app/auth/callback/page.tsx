"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { motion } from "framer-motion";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    let active = true;

    async function handleAuth() {
      try {
        // Grab tokens from URL hash (Supabase OAuth returns them here)
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        console.log("Params:", params);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

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

        // Default language fallback
        let locale = "en";

        if (user) {
          // Check existing user profile for locale
          const { data: profile } = await supabase
            .from("user_data")
            .select("language")
            .eq("user_id", user.id)
            .single();

          if (profile?.language) {
            locale = profile.language;
          }

          // Upsert basic user_data if they are new
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

        // Let Supabase chill for a sec
        await new Promise((r) => setTimeout(r, 150));

        if (!active) return;

        // Warp them into their localized chat
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
  }, [router]);

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

function Spinner() {
  return (
    <motion.div
      className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"
      aria-label="Loading"
    />
  );
}
