import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>; // <-- THIS is what Next wants
}) {
  const { locale } = await params; // <-- await the whole params object

  if (!["en", "pt"].includes(locale)) {
    notFound();
  }

  const messages = (
    await import(`../../messages/${locale}.json`)
  ).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
    </NextIntlClientProvider>
  );
}