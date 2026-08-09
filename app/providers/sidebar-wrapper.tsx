"use client";

import { SidebarProvider } from "@/providers/sidebar-context";
export function SidebarWrapper({ 
  children,
  userId
}: { 
  children: React.ReactNode;
  userId: string | null;
}) {
  return (
    <SidebarProvider userId={userId}>
      {children}
    </SidebarProvider>
  );
}