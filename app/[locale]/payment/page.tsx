"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "@/app/hooks/useAuth";
import {
  GraduationCap,
  Zap,
  Check,
  Lock,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function PaymentPage() {
  const { userId } = useAuth();
  const t = useTranslations("Payment");
  const locale = useLocale();

  const [selectedPlan, setSelectedPlan] =
    useState<"student" | "pro">("pro");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPtBr = locale === "pt" || locale === "pt-BR";
  const currencySymbol = isPtBr ? "R$" : "$";

  const PLANS = {
    student: {
      name: t("plans.scholar.name"),
      price: isPtBr ? 24.99 : 9.99,
      icon: GraduationCap,
      features: [
        t("plans.scholar.features.feature1"),
        t("plans.scholar.features.feature2"),
        t("plans.scholar.features.feature3"),
        t("plans.scholar.features.feature4"),
        t("plans.scholar.features.feature5"),
      ],
    },
    pro: {
      name: t("plans.professional.name"),
      price: isPtBr ? 49.99 : 29.99,
      icon: Zap,
      features: [
        t("plans.professional.features.feature1"),
        t("plans.professional.features.feature2"),
        t("plans.professional.features.feature3"),
        t("plans.professional.features.feature4"),
        t("plans.professional.features.feature5"),
      ],
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan, // "student" | "pro"
          userId,
          email,
          name,
          currency: isPtBr ? "brl" : "usd",
          locale,
        }),
      });

      const data = await res.json();

      if (!data.url) {
        throw new Error("Stripe session failed");
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black p-6">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl text-[#d4af37] text-center mb-8 font-serif">
          {t("title")}
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {Object.entries(PLANS).map(([key, plan]) => {
            const Icon = plan.icon;
            const active = selectedPlan === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedPlan(key as any)}
                className={`rounded-2xl p-6 border transition ${
                  active
                    ? "border-[#d4af37] bg-black/80 scale-105"
                    : "border-white/10 bg-black/60"
                }`}
              >
                <div className="flex justify-between mb-4">
                  <Icon className="w-8 h-8 text-[#d4af37]" />
                  {active && <Check className="w-6 h-6 text-[#d4af37]" />}
                </div>

                <h3 className="text-2xl text-white font-serif mb-2">
                  {plan.name}
                </h3>

                <p className="text-3xl text-[#d4af37] font-bold mb-4">
                  {currencySymbol}
                  {plan.price.toFixed(2)}
                  <span className="text-sm text-white/50">
                    {t("perMonth")}
                  </span>
                </p>

                <ul className="space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-white/70 flex gap-2 text-sm">
                      <Check className="w-4 h-4 text-[#d4af37]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-black/80 p-8 rounded-2xl border border-[#d4af37]/30"
        >
          <AnimatePresence>
            {error && (
              <motion.p
                className="text-red-400 text-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              required
              placeholder={t("form.fullName")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-black border border-[#d4af37]/30 text-white"
            />
            <input
              required
              type="email"
              placeholder={t("form.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl bg-black border border-[#d4af37]/30 text-white"
            />
          </div>

          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Lock className="w-4 h-4 text-[#d4af37]" />
            {t("security")}
          </div>

          <button
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#d4af37] text-black font-semibold hover:bg-[#f4e5b8]"
          >
            {loading ? t("form.processing") : t("form.submitButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
