"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuth() {
      // Parse hash from URL
      const hash = window.location.hash.substring(1); // remove #
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        // Save session in Supabase client
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (error) {
          console.error("Error setting session:", error.message);
          return;
        }
        // Clean up URL and redirect
        router.replace("/");
      }
    }

    handleAuth();
  }, [router]);

}
