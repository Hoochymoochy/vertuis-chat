"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signUp, signInWithGoogle } from "@/app/lib/user";
import Image from "next/image";
import google from "@/public/google.svg";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

interface SignUpResponse {
  id?: string;
  email?: string;
  session?: any;
  user?: any;
}

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { user, session }: SignUpResponse = await signUp(email, password);

      // Check if email confirmation is required
      if (user && !session) {
        // Email confirmation required - show success state
        setVerificationSent(true);
      } else if (session) {
        // Auto-confirmed (shouldn't happen with email confirmation enabled)
        router.push("/chat");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await signInWithGoogle();
      if (data && data.id) {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // Show verification sent screen
  if (verificationSent) {
    return (
      <div className="bg-marble bg-cover bg-no-repeat bg-center min-h-screen w-full flex flex-col px-4 py-6 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.2 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <motion.div
          className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-gold/30 w-full max-w-md m-auto flex flex-col items-center shadow-xl relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success icon */}
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
            <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mb-6">
              <Mail className="w-10 h-10 text-gold" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-2xl font-bold text-white mb-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Check Your Email
          </motion.h1>

          <motion.p 
            className="text-white/80 text-center mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            We've sent a verification link to
            <span className="block text-gold font-medium mt-1">{email}</span>
          </motion.p>

          <motion.div 
            className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-6 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <div className="text-sm text-white/70 space-y-2">
                <p>Click the verification link in the email to activate your account.</p>
                <p className="text-white/50 text-xs">
                  The link will expire in 24 hours. Check your spam folder if you don't see it.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.button
            onClick={() => router.push("/login")}
            className="w-full text-gold font-bold py-3 rounded-xl border border-gold hover:bg-gold/20 transition-all duration-300 relative overflow-hidden group flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gold/10"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10 text-gold">Go to Login</span>
            <ArrowRight className="w-4 h-4 relative z-10" />
          </motion.button>

          <motion.p 
            className="text-white/50 text-xs mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Didn't receive the email?{" "}
            <button 
              onClick={() => setVerificationSent(false)}
              className="text-gold hover:underline"
            >
              Try again
            </button>
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50"/>
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <motion.form
        onSubmit={handleRegister}
        className="glass-effect bg-black/60 backdrop-blur-md p-8 border border-gold/30 w-full max-w-md m-auto flex flex-col items-center shadow-xl relative z-10"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1
        }}
      >
        <motion.h1 
          className="text-3xl font-serif text-gold mb-4 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Register
        </motion.h1>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p 
              className="text-red-400 mb-4 text-sm text-center bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div 
          className="w-full mb-4 relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            required
            className="flex w-full px-6 py-4 bg-white/5 border border-[#d4af37]/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300"
          />
        </motion.div>

        <motion.div 
          className="w-full mb-4 relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            required
            minLength={6}
            className="flex w-full px-6 py-4 bg-white/5 border border-[#d4af37]/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300"
          />
        </motion.div>

        <motion.div 
          className="w-full mb-6 relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setFocusedField("confirmPassword")}
            onBlur={() => setFocusedField(null)}
            required
            minLength={6}
            className="flex w-full px-6 py-4 bg-white/5 border border-[#d4af37]/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300"
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-4 font-medium relative flex items-center justify-center gap-2 border border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300 hover:scale-105 bg-[#d4af37] text-black hover:bg-[#f4e5b8] hover:shadow-2xl hover:shadow-[#d4af37]/50 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10">
            {loading ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-gold border-t-transparent rounded-full"
                />
                Creating Account...
              </motion.span>
            ) : (
              "Create Account"
            )}
          </span>
        </motion.button>

        <motion.div 
          className="w-full flex items-center gap-3 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="h-[1px] flex-1 mx-auto bg-[#d4af37]" />
          <p className="text-white/60 text-sm">Or sign up with</p>
          <div className="h-[1px] flex-1 mx-auto bg-[#d4af37]" />
        </motion.div>

        <motion.button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 font-medium transition-all duration-300 hover:scale-105 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 flex flex-row items-center justify-center gap-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          whileHover={{ scale: loading ? 1 : 1.03, y: loading ? 0 : -2 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
        >
          <Image src={google} alt="Google" width={20} height={20} />
          Continue with Google
        </motion.button>

        <motion.p 
          className="text-white/70 text-sm mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          Already have an account?{" "}
          <motion.a 
            href="/login" 
            className="text-gold hover:underline font-medium"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Login
          </motion.a>
        </motion.p>
      </motion.form>
    </div>
  );
}