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
    // Grab hash params (for Supabase OAuth redirect)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      throw new Error("Missing authentication tokens in callback URL.");
    }

    // Apply tokens to Supabase session
    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (sessionError) throw new Error(sessionError.message);

    // Double-check session actually exists
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) throw new Error("Session could not be verified.");

    // 🪄 Auto-seed user_data on first login
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (user) {
      const { error: insertError } = await supabase
        .from("user_data")
        .upsert(
          {
            user_id: user.id,
            country: "World",
            state: "N/A",
            language: "en",
          },
          { onConflict: "user_id" }
        );
      if (insertError) console.error("Error seeding user_data:", insertError);
    }

    // Give Supabase a brief moment to persist
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (!active) return;
    router.replace("/");
  } catch (err) {
    console.error("Auth callback failed:", err);
    if (active)
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
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
          Authentication Error
        </motion.h2>
        <p className="text-white/80 max-w-sm">{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-3 px-5 py-2 rounded-lg bg-gold text-black font-medium hover:bg-gold/90 transition"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-3 p-6">
      <Spinner />
      <p className="text-gold text-base font-medium">
        Completing authentication...
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
