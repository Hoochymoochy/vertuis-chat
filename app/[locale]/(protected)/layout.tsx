// app/[locale]/protected/layout.tsx
import { ReactNode } from "react";
import { Sidebar } from "@/app/components/sidebar/Sidebar";
import { SidebarWrapper } from "@/app/hooks/Global/SidebarWrapper";
import { getAuthenticatedUser } from "@/app/lib/server"; // ← Import from server file

export default async function ProtectedLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const userId = await getAuthenticatedUser(params.locale);
  
  return (
    <SidebarWrapper userId={userId}>
      <div className="relative min-h-screen w-full bg-[url('/marble.jpg')] bg-cover bg-center">
        {/* Visual overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/70 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40 pointer-events-none" />
        
        {/* App shell */}
        <div className="relative z-10">
          <Sidebar>{children}</Sidebar>
        </div>
      </div>
    </SidebarWrapper>
  );
}