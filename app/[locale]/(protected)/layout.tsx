// app/[locale]/layout.tsx (Server Component - NO "use client")
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Sidebar } from "@/app/components/sidebar/Sidebar";
import { AuthGuard } from "@/app/components/global/AuthGaurd";
import { SidebarWrapper } from "@/app/hooks/Global/SidebarWrapper";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthGuard locale={locale}>
        <SidebarWrapper userId={null}>
          <Sidebar>{children}</Sidebar>
        </SidebarWrapper>
      </AuthGuard>
    </NextIntlClientProvider>
  );
}