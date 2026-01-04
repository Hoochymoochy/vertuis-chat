"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Lock,
  CheckCircle,
  GraduationCap,
  Zap,
  Check,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useTranslations, useLocale } from 'next-intl';

const stripePromise = loadStripe("pk_test_YOUR_PUBLISHABLE_KEY");

function PaymentForm() {
  const t = useTranslations('Payment');
  const locale = useLocale();
  const stripe = useStripe();
  const elements = useElements();

  const [selectedPlan, setSelectedPlan] =
    useState<"scholar" | "professional">("professional");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Currency and pricing based on locale
  const isPtBr = locale === 'pt' || locale === 'pt-BR';
  const currency = isPtBr ? 'R$' : '$';
  const exchangeRate = 5.0; // Update this with real-time rates or from your backend

  // Get plan data with translations and localized pricing
  const PLANS = {
    scholar: {
      name: t('plans.scholar.name'),
      priceUSD: 9.99,
      priceBRL: 49.90,
      price: isPtBr ? 49.90 : 9.99,
      priceId: isPtBr ? "price_SCHOLAR_MONTHLY_BRL_ID" : "price_SCHOLAR_MONTHLY_ID",
      icon: GraduationCap,
      features: [
        t('plans.scholar.features.feature1'),
        t('plans.scholar.features.feature2'),
        t('plans.scholar.features.feature3'),
        t('plans.scholar.features.feature4'),
        t('plans.scholar.features.feature5'),
      ],
    },
    professional: {
      name: t('plans.professional.name'),
      priceUSD: 29.99,
      priceBRL: 149.90,
      price: isPtBr ? 149.90 : 29.99,
      priceId: isPtBr ? "price_PRO_MONTHLY_BRL_ID" : "price_PRO_MONTHLY_ID",
      icon: Zap,
      features: [
        t('plans.professional.features.feature1'),
        t('plans.professional.features.feature2'),
        t('plans.professional.features.feature3'),
        t('plans.professional.features.feature4'),
        t('plans.professional.features.feature5'),
      ],
    },
  };

  const currentPlan = PLANS[selectedPlan];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: currentPlan.priceId,
          email,
          name,
          currency: isPtBr ? 'brl' : 'usd',
          locale: locale,
        }),
      });

      const { clientSecret } = await res.json();

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: { name, email },
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Format price with proper locale formatting
  const formatPrice = (price: number) => {
    if (isPtBr) {
      return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toFixed(2);
  };

  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" />

        <motion.div
          className="relative z-10 bg-black/80 backdrop-blur-xl border border-[#d4af37]/30 rounded-2xl p-10 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="mx-auto mb-6 w-20 h-20 rounded-full border-2 border-[#d4af37] flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#d4af37]" />
          </div>

          <h1 className="text-2xl font-serif text-white mb-3">
            {t('success.title')}
          </h1>

          <p className="text-white/70 leading-relaxed whitespace-pre-line">
            {t('success.message')}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center p-6">
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <motion.h1
          className="text-4xl font-serif text-[#d4af37] text-center mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('title')}
        </motion.h1>

        <motion.p
          className="text-white/60 text-center max-w-xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {t('subtitle')}
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {Object.entries(PLANS).map(([key, plan]) => {
            const Icon = plan.icon;
            const active = selectedPlan === key;

            return (
              <motion.button
                key={key}
                onClick={() =>
                  setSelectedPlan(key as "scholar" | "professional")
                }
                className={`text-left rounded-2xl p-6 backdrop-blur-xl border transition-all ${
                  active
                    ? "border-[#d4af37]/60 bg-black/70 scale-105"
                    : "border-white/10 bg-black/50 hover:border-[#d4af37]/30"
                }`}
                whileHover={{ scale: active ? 1.05 : 1.03 }}
              >
                <div className="flex justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl border border-[#d4af37]/40 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#d4af37]" />
                  </div>
                  {active && (
                    <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center">
                      <Check className="w-5 h-5 text-black" />
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-serif text-white mb-2">
                  {plan.name}
                </h3>

                <p className="text-4xl font-bold text-[#d4af37] mb-4">
                  {currency}{formatPrice(plan.price)}
                  <span className="text-white/50 text-lg">{t('perMonth')}</span>
                </p>

                <ul className="space-y-3">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-white/70 text-sm"
                    >
                      <Check className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-black/70 backdrop-blur-xl border border-[#d4af37]/30 rounded-2xl p-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-serif text-[#d4af37] text-center mb-6">
            {t('securePayment')}
          </h2>

          <AnimatePresence>
            {error && (
              <motion.p
                className="mb-4 text-sm text-red-400 text-center bg-red-500/10 border border-red-500/30 rounded-lg py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              required
              placeholder={t('form.fullName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl px-5 py-4 bg-black/40 border border-[#d4af37]/30 text-white focus:ring-2 focus:ring-[#d4af37] focus:outline-none"
            />
            <input
              required
              type="email"
              placeholder={t('form.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl px-5 py-4 bg-black/40 border border-[#d4af37]/30 text-white focus:ring-2 focus:ring-[#d4af37] focus:outline-none"
            />
          </div>

          <div className="mb-6 rounded-xl border border-[#d4af37]/30 bg-black/40 px-5 py-4 focus-within:ring-2 focus-within:ring-[#d4af37]">
            <CardElement
              options={{
                style: {
                  base: {
                    color: "#ffffff",
                    fontSize: "16px",
                    "::placeholder": { color: "rgba(255,255,255,0.4)" },
                    iconColor: "#d4af37",
                  },
                  invalid: { color: "#ef4444" },
                },
              }}
            />
          </div>

          <div className="mb-6 rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-4">
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <Lock className="w-5 h-5 text-[#d4af37]" />
              {t('security')}
            </div>
          </div>

          <button
            disabled={!stripe || loading}
            className="w-full py-4 rounded-xl font-medium bg-[#d4af37] text-black hover:bg-[#f4e5b8] transition disabled:opacity-50"
          >
            {loading ? t('form.processing') : t('form.submitButton')}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}