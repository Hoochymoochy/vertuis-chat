"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { getOnbaording } from "@/app/lib/user";

export function AuthGuard({ 
  children, 
  locale 
}: { 
  children: (userId: string | null) => React.ReactNode;
  locale: string;
}) {

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        if (data.session?.user) {
          const user = data.session.user;
          setUser(user);

          const onboarded = await getOnbaording(user.id);
          if (!onboarded) {
            setNeedsOnboarding(true);
          }
        } else {
          router.push(`/${locale}/login`);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        if (mounted) setIsCheckingAuth(false);
      }
    };

    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router, locale]);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          router.push(`/${locale}/login`);
        } else if (event === "SIGNED_IN" && session) {
          setUser(session.user);
        }
      }
    );

    return () => subscription?.subscription?.unsubscribe?.();
  }, [router, locale]);

  useEffect(() => {
    const handleLocationUpdate = () => {
      setNeedsOnboarding(false);
    };

    window.addEventListener("locationUpdated", handleLocationUpdate);
    return () => window.removeEventListener("locationUpdated", handleLocationUpdate);
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (needsOnboarding) {
    // You can redirect to onboarding or show onboarding UI
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Please complete onboarding...</div>
      </div>
    );
  }

  return <>{children(user?.id || null)}</>;
}