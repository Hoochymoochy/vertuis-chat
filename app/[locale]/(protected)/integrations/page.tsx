"use client";

import { Integration } from "@carbon/icons-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function IntegrationsPage() {
  const t = useTranslations("IntegrationsPage");

  return (
    <main className="flex-1 overflow-y-auto p-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-2xl"
      >
        <h1 className="text-3xl font-serif font-bold text-gradient tracking-tight mb-2">
          {t("title")}
        </h1>
        <p className="text-neutral-300 mb-10">{t("subtitle")}</p>

        <div className="rounded-xl border border-gold/25 bg-neutral-950/70 backdrop-blur-sm p-8 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gold/30 bg-gold/5">
              <Integration size={26} className="text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{t("gmailTitle")}</h2>
              <p className="text-xs text-gold/80 uppercase tracking-wider">
                {t("gmailBadge")}
              </p>
            </div>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed mb-8">{t("gmailBody")}</p>

          <button
            type="button"
            disabled
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-gold/40 bg-gold/10 text-gold text-sm font-medium opacity-60 cursor-not-allowed"
          >
            {t("connect")}
          </button>
          <p className="mt-4 text-xs text-neutral-500 leading-relaxed">{t("comingSoon")}</p>
        </div>
      </motion.div>
    </main>
  );
}
