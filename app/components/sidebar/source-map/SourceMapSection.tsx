"use client";


import { useTranslations } from "next-intl";

import { useSourceMapOverviewPayload } from "@/app/components/source-map/SourceMapOverviewContext";

export function SourceMapSection() {
  const t = useTranslations("Sidebar");
  const overview = useSourceMapOverviewPayload();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <p className="px-1 text-sm leading-relaxed text-neutral-400">
          {t("sourceMapBlurb")}
        </p>
    </div>
  );
}
