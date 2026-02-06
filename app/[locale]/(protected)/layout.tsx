// app/[locale]/layout.tsx (Server Component)

import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Sidebar } from "@/app/components/sidebar/Sidebar";
import { AuthGuard } from "@/app/components/global/AuthGaurd";
import { SidebarWrapper } from "@/app/hooks/Global/SidebarWrapper";
import { useAuth } from "@/app/hooks/Auth/useAuth";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { userId } = useAuth();
  const { locale } = params;

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthGuard locale={locale} userId={userId}>
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
      </AuthGuard>
    </NextIntlClientProvider>
  );
}
