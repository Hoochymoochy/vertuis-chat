"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#0e0e0e] text-white"
    >
      {/* Marble Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.08] bg-[url('/textures/marble-dark.jpg')] bg-cover bg-center mix-blend-soft-light" />

      {/* Soft Gold Particles Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,209,150,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 w-full py-6 px-8 flex justify-between items-center z-20"
      >
        <h2 className="text-3xl font-[Cinzel] font-bold text-[#EAD196] tracking-wide">
          Veritus
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-transparent border border-[#EAD196]/40 text-[#EAD196] hover:bg-[#EAD196]/10 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#C9A227] to-[#EAD196] text-black hover:from-[#EAD196] hover:to-[#fff8dc] transition"
          >
            Register
          </button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="z-10 text-center px-6 mt-20"
      >
        <motion.h1
          className="text-6xl sm:text-8xl font-[Cinzel] font-extrabold mb-6 tracking-tight leading-tight"
        >
          <span className="text-[#EAD196]">AI You Can</span>
          <br />
          <span className="bg-gradient-to-r from-[#EAD196] via-[#fff8dc] to-[#EAD196] bg-clip-text text-transparent">
            Swear By
          </span>
        </motion.h1>

        <p className="text-neutral-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-[DM_Sans]">
          Truth, precision, and proof — engineered for legal minds who don’t gamble with uncertainty.
          <br />
          Your AI legal co-counsel, built for the future of law.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-10 flex justify-center gap-4"
        >
          <button
            onClick={() => router.push("/register")}
            className="px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-[#C9A227] to-[#EAD196] text-black hover:from-[#EAD196] hover:to-[#fff8dc] transition"
          >
            Get Started
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 text-lg font-semibold rounded-xl border border-[#EAD196]/40 text-[#EAD196] hover:bg-[#EAD196]/10 transition"
          >
            Login
          </button>
        </motion.div>
      </motion.div>

      {/* Feature Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-10 px-8 max-w-6xl z-10"
      >
        {[
          {
            icon: "⚖️",
            title: "Source-Backed Answers",
            text: "Every legal insight is linked to its original law, so you never guess — you verify.",
          },
          {
            icon: "🔍",
            title: "Real-Time Legislation",
            text: "Stay ahead with auto-updated data crawled straight from official government sources.",
          },
          {
            icon: "💼",
            title: "For Legal Professionals",
            text: "Tailored for lawyers, firms, and legal tech platforms that demand absolute accuracy.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            className="bg-[#111]/60 border border-[#2a2a2a]/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_40px_rgba(233,210,130,0.08)]"
          >
            <div className="w-14 h-14 mb-6 bg-gradient-to-br from-[#B8860B] to-[#D4AF37] rounded-xl flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(212,175,55,0.3)]">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-[#EAD196] font-[Cinzel] mb-3">
              {f.title}
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed font-[DM_Sans]">
              {f.text}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-0 py-6 text-center text-xs text-neutral-500 tracking-widest"
      >
        © {new Date().getFullYear()} Veritus — <span className="text-[#EAD196]">AI You Can Swear By</span>
      </motion.footer>
    </motion.div>
  );
}
