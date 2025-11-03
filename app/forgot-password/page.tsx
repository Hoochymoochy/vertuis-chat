"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MailCheck, MailWarning } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: call your Supabase password reset method here
      await new Promise((r) => setTimeout(r, 1200)); // simulate
      setSent(true);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-marble bg-cover bg-no-repeat bg-center min-h-screen w-full flex flex-col px-4 py-6 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-gold/10 via-transparent to-transparent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <motion.div
        className="bg-black/70 backdrop-blur-xl p-8 rounded-2xl border border-gold/30 w-full max-w-sm m-auto flex flex-col items-center shadow-2xl relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.form
              key="form"
              onSubmit={handleReset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              <MailWarning className="w-14 h-14 text-gold mb-4" />
              <h1 className="text-2xl font-bold text-white mb-3 text-center">
                Forgot Password
              </h1>
              <p className="text-white/70 text-center mb-6 text-sm leading-relaxed">
                No worries — we’ll send you a reset link so you can get back in.
              </p>

              <motion.div
                className="w-full mb-5 relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 text-white placeholder-gold/60 border border-gold/30 focus:outline-none focus:border-gold transition-all duration-300"
                />
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    className="text-red-400 text-sm mb-3 text-center bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-bold text-gold border border-gold rounded-xl hover:bg-gold/20 transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
              >
                {loading ? (
                  <motion.span
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-gold border-t-transparent rounded-full"
                    />
                    Sending...
                  </motion.span>
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>

              <motion.a
                onClick={() => router.push("/login")}
                className="text-gold/80 hover:text-gold text-sm mt-5 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                Back to Login
              </motion.a>
            </motion.form>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center flex flex-col items-center"
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 15 }}
              >
                <MailCheck className="w-10 h-10 text-green-400" />
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-3">
                Link Sent!
              </h2>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Check your inbox for the reset link we sent to{" "}
                <span className="text-gold font-medium">{email}</span>.
              </p>

              <motion.button
                onClick={() => router.push("/login")}
                className="w-full py-3 font-bold text-gold border border-gold rounded-xl hover:bg-gold/20 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
              >
                Back to Login
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
