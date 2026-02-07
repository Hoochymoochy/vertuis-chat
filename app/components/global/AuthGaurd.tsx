// app/components/AuthGuard.tsx (Server Component)
import { getAuthenticatedUser } from "@/app/hooks/Auth/useAuth";
import { ReactNode } from "react";

export async function AuthGuard({ 
  children, 
  locale,
}: { 
  children: ReactNode; 
  locale: string;
}) {
  const userId = await getAuthenticatedUser(); // This handles redirect automatically
  
  return <>{children}</>;
}