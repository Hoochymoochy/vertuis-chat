"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { signUp, signInWithGoogle, signInWithFacebook } from "@/app/lib/user";
import Image from "next/image";
import google from "@/public/google.svg";
import whatsapp from "@/public/whatsapp.svg";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await signUp(email, password);
      if (data && data.id) {
        localStorage.setItem("user_id", data.id);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const data = await signInWithGoogle();
      if (data && data.id) {
        localStorage.setItem("user_id", data.id);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppLogin = async () => {
    setLoading(true);
    try {
      const data = await signInWithFacebook();
      if (data && data.id) {
        localStorage.setItem("user_id", data.id);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "WhatsApp login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-marble bg-cover bg-no-repeat bg-center min-h-screen w-full flex flex-col px-4 py-6 relative overflow-hidden">
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.2 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <motion.form
        onSubmit={handleRegister}
        className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-gold/30 w-full max-w-sm m-auto flex flex-col items-center shadow-xl relative z-10"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1
        }}
      >
        {/* Title with stagger effect */}
        <motion.h1 
          className="text-3xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Register
        </motion.h1>

        {/* Error message with animation */}
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

        {/* Email input with focus animation */}
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

        {/* Password input with focus animation */}
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

        {/* Submit button with loading state */}
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full text-gold font-bold py-3 rounded-xl border border-gold hover:bg-gold/20 transition-all duration-300 relative overflow-hidden group mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
                Registering...
              </motion.span>
            ) : (
              "Enter"
            )}
          </span>
        </motion.button>

        {/* Divider */}
        <motion.div 
          className="w-full flex items-center gap-3 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex-1 h-px bg-gold/20" />
          <p className="text-white/60 text-sm">Or sign up with</p>
          <div className="flex-1 h-px bg-gold/20" />
        </motion.div>

        {/* Social login buttons */}
        <motion.div 
          className="flex gap-4 mb-4 w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gold/30 rounded-xl hover:bg-gold/10 hover:border-gold transition-all duration-300 text-white"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Image src={google} alt="Google" width={20} height={20} />
            Google
          </motion.button>

          <motion.button
            type="button"
            onClick={handleWhatsAppLogin}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gold/30 rounded-xl hover:bg-gold/10 hover:border-gold transition-all duration-300 text-white"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Image src={whatsapp} alt="WhatsApp" width={20} height={20} />
            WhatsApp
          </motion.button>
        </motion.div>

        {/* Login link */}
        <motion.p 
          className="text-white/70 text-sm mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
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