// app/components/AuthGuard.tsx (Client Component)
"use client";
import { useAuth } from "@/app/hooks/Auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export function AuthGuard({ 
  children, 
  locale 
}: { 
  children: ReactNode; 
  locale: string;
}) {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.user) {
      router.push(`/${locale}/login`);
    }
  }, [auth.user, locale, router]);

  if (!auth.user) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}