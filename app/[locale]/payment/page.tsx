"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Lock, CheckCircle, GraduationCap, Zap, Check } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe("pk_test_YOUR_PUBLISHABLE_KEY");

const PLANS = {
  student: {
    name: "Student",
    price: 9.99,
    priceId: "price_STUDENT_MONTHLY_ID", // Replace with your Stripe Price ID
    icon: GraduationCap,
    features: [
      "Access to basic features",
      "Limited API calls",
      "Email support",
      "Student verification required",
      "Cancel anytime"
    ],
    color: "from-blue-500/20 to-purple-500/20",
    borderColor: "border-blue-500/40",
    iconColor: "text-blue-400"
  },
  basic: {
    name: "Basic",
    price: 29.99,
    priceId: "price_BASIC_MONTHLY_ID", // Replace with your Stripe Price ID
    icon: Zap,
    features: [
      "Full access to all features",
      "Unlimited API calls",
      "Priority email support",
      "Advanced analytics",
      "Cancel anytime"
    ],
    color: "from-[#d4af37]/20 to-[#f4e5b8]/20",
    borderColor: "border-[#d4af37]/40",
    iconColor: "text-[#d4af37]"
  }
};

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedPlan, setSelectedPlan] = useState<"student" | "basic">("basic");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentPlan = PLANS[selectedPlan];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create subscription on your backend
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: currentPlan.priceId,
          email,
          name,
        }),
      });

      const { clientSecret, subscriptionId } = await response.json();

      // Step 2: Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name,
              email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true);
        // Redirect to success page or dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <motion.div
          className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-gold/30 w-full max-w-md mx-4 flex flex-col items-center shadow-xl relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.2 
            }}
          >
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-2xl font-bold text-white mb-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Subscription Active!
          </motion.h1>

          <motion.p 
            className="text-white/80 text-center mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Welcome to <span className="text-gold font-medium">{currentPlan.name}</span> plan. Your subscription is now active and you'll be charged monthly.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Payment form
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center py-8 px-4">
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <div className="w-full max-w-5xl relative z-10">
        <motion.h1 
          className="text-4xl font-serif text-gold mb-3 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Choose Your Plan
        </motion.h1>
        <motion.p 
          className="text-white/60 text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Select a monthly subscription that fits your needs
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {Object.entries(PLANS).map(([key, plan], index) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === key;
            
            return (
              <motion.button
                key={key}
                onClick={() => setSelectedPlan(key as "student" | "basic")}
                className={`bg-black/60 backdrop-blur-md p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  isSelected 
                    ? `${plan.borderColor} shadow-2xl scale-105` 
                    : 'border-white/10 hover:border-white/30'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: isSelected ? 1.05 : 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${plan.iconColor}`} />
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-black" />
                    </motion.div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gold">${plan.price}</span>
                  <span className="text-white/60 text-lg">/month</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                      <Check className={`w-5 h-5 ${plan.iconColor} shrink-0 mt-0.5`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.button>
            );
          })}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="glass-effect bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-gold/30 shadow-xl"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className="text-2xl font-serif text-gold mb-6 text-center">Payment Details</h2>

          <AnimatePresence mode="wait">
            {error && (
              <motion.p 
                className="text-red-400 mb-4 text-sm text-center bg-red-500/10 px-4 py-3 rounded-lg border border-red-500/20"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex w-full px-6 py-4 bg-white/5 border border-[#d4af37]/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex w-full px-6 py-4 bg-white/5 border border-[#d4af37]/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-white/5 border border-[#d4af37]/30 px-6 py-4 focus-within:ring-2 focus-within:ring-[#d4af37] transition-all duration-300">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#ffffff",
                      "::placeholder": {
                        color: "rgba(255, 255, 255, 0.4)",
                      },
                      iconColor: "#d4af37",
                    },
                    invalid: {
                      color: "#ef4444",
                      iconColor: "#ef4444",
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="mb-6 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl p-4">
            <div className="flex items-center gap-3 text-white/70 text-sm mb-3">
              <Lock className="w-5 h-5 text-[#d4af37] shrink-0" />
              <p>Your payment information is secure and encrypted</p>
            </div>
            <p className="text-white/50 text-xs ml-8">
              You'll be charged ${currentPlan.price} monthly. Cancel anytime from your account settings.
            </p>
          </div>

          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full py-4 font-medium relative flex items-center justify-center gap-2 border border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300 bg-[#d4af37] text-black hover:bg-[#f4e5b8] hover:shadow-2xl hover:shadow-[#d4af37]/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Subscribe to {currentPlan.name} - ${currentPlan.price}/mo
                </>
              )}
            </span>
          </button>

          <p className="text-white/50 text-xs mt-4 text-center">
            Powered by Stripe • Secure payment processing
          </p>
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