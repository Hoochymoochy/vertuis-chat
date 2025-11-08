"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      try {
        // Parse hash from URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (!access_token || !refresh_token) {
          setError("No tokens found in URL");
          return;
        }

        // Set session in Supabase client
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (sessionError) {
          console.error("Error setting session:", sessionError.message);
          setError(sessionError.message);
          return;
        }

        // Verify session was actually set
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError("Session was not set properly");
          return;
        }

        console.log("Session set successfully:", session);

        // Add a small delay to ensure session is persisted
        await new Promise(resolve => setTimeout(resolve, 100));

        // Clean up URL and redirect
        router.replace("/");
      } catch (err) {
        console.error("Unexpected error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    handleAuth();
  }, [router]);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push("/login")}>Back to Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <p>Completing authentication...</p>
    </div>
  );
}