"use client";

import { SidebarProvider } from "@/app/hooks/Global/SidebarContext";

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