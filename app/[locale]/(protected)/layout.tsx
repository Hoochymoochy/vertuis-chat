"use client";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Sidebar } from "@/app/components/sidebar/Sidebar";
import { useAuth } from "../../hooks/Auth/useAuth";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string }; // directly, no Promise
}) {
  const auth = useAuth();
  if (!auth.user) {
    notFound();
  }

  const { locale } = params;

  if (!["en", "pt"].includes(locale)) {
    notFound();
  }

  // Absolute path = safer
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Sidebar>
        {children}
      </Sidebar>
    </NextIntlClientProvider>
  );
}
