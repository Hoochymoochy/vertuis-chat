"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import google from "@/public/google.svg";
import { signIn, signInWithGoogle } from "@/app/lib/user";
import { Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNeedsVerification(false);

    try {
      const data = await signIn(email, password);
      
      // Check if session exists (user is verified)
      if (data.session) {
        // Supabase handles session storage automatically
        router.push("/");
      } else if (data.user && !data.user.email_confirmed_at) {
        // User exists but email not verified
        setNeedsVerification(true);
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } catch (err: any) {
      // Handle specific Supabase errors
      if (err.message.includes("Email not confirmed")) {
        setNeedsVerification(true);
      } else if (err.message.includes("Invalid login credentials")) {
        setError("Invalid email or password");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Google sign-in will redirect, so no need to manually navigate
    } catch (err: any) {
      setError(err.message || "Google login failed");
      setLoading(false);
    }
  };

  // Show email verification needed screen
  if (needsVerification) {
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
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-2xl font-bold text-white mb-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Email Not Verified
          </motion.h1>

          <motion.p 
            className="text-white/80 text-center mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Please verify your email address before logging in.
            <span className="block text-gold font-medium mt-2">{email}</span>
          </motion.p>

          <motion.div 
            className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-white/70 space-y-2">
                <p>Check your inbox for the verification link we sent when you registered.</p>
                <p className="text-white/50 text-xs">
                  Don't see it? Check your spam folder or contact support.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.button
            onClick={() => setNeedsVerification(false)}
            className="w-full text-gold font-bold py-3 rounded-xl border border-gold hover:bg-gold/20 transition-all duration-300 relative overflow-hidden group"
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
            <span className="relative z-10">Back to Login</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Login form
  return (
    <div className="bg-marble bg-cover bg-no-repeat bg-center min-h-screen w-full flex flex-col px-4 py-6 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <motion.form
        onSubmit={handleLogin}
        className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-gold/30 w-full max-w-sm m-auto flex flex-col items-center shadow-xl relative z-10"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1
        }}
      >
        <motion.h1 
          className="text-3xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Login
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
            className="w-full px-4 py-3 rounded-xl bg-black/60 text-white placeholder-gold/60 border border-gold/30 focus:outline-none focus:border-gold transition-all duration-300"
          />
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-gold pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: focusedField === "email" ? 1 : 0,
              scale: focusedField === "email" ? 1 : 0.95
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        <motion.div 
          className="w-full mb-6 relative"
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
            className="w-full px-4 py-3 rounded-xl bg-black/60 text-white placeholder-gold/60 border border-gold/30 focus:outline-none focus:border-gold transition-all duration-300"
          />
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-gold pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: focusedField === "password" ? 1 : 0,
              scale: focusedField === "password" ? 1 : 0.95
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full text-gold font-bold py-3 rounded-xl border border-gold hover:bg-gold/20 transition-all duration-300 relative overflow-hidden group mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gold/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10 text-gold">
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
                Logging in...
              </motion.span>
            ) : (
              "Sign In"
            )}
          </span>
        </motion.button>

        <motion.div 
          className="w-full flex items-center gap-3 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex-1 h-px bg-gold/20" />
          <p className="text-white/60 text-sm">Or login with</p>
          <div className="flex-1 h-px bg-gold/20" />
        </motion.div>

        <motion.button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gold/30 rounded-xl hover:bg-gold/10 hover:border-gold transition-all duration-300 text-white mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
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
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          Don't have an account?{" "}
          <motion.a 
            href="/register" 
            className="text-gold hover:underline font-medium"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Register
          </motion.a>
        </motion.p>

        {/* <motion.div 
          className=" flex justify-end mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <motion.a 
            href="/forgot-password"
            className="text-gold/80 hover:text-gold text-sm transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Forgot password?
          </motion.a>
        </motion.div> */}
        
      </motion.form>
    </div>
  );
}