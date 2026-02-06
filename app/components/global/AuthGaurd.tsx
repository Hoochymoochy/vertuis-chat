// app/components/AuthGuard.tsx (Client Component)
"use client";
import { useAuth } from "@/app/hooks/Auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export function AuthGuard({ 
  children, 
  locale,
  userId
}: { 
  children: ReactNode; 
  locale: string;
  userId: string | null
}) {
  const router = useRouter();

  useEffect(() => {
    if (!userId === null) {
      router.push(`/${locale}/login`);
    }
  }, [userId, locale, router]);

  if (!userId) {
    return null;
  }

  return <>{children}</>;
}