"use client"


import { CaseList } from "@/app/[locale]/component/case-list"
import { motion } from "framer-motion"

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-black text-white bg-[url('/marble.jpg')] bg-cover bg-center">

      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Cases</h1>
            <p className="text-sm text-white/50 mt-1">
              Manage, review, and analyze your active matters
            </p>
          </div>

          <motion.button
            onClick={() => {}}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="
              bg-linear-to-r from-gold/25 to-gold/10
              hover:from-gold/35 hover:to-gold/20
              border border-gold/30
              px-5 py-3
              font-medium
              flex items-center gap-3
              shadow-[0_0_25px_rgba(212,175,55,0.15)]
              transition-all
            "
          >
            <svg
              className="w-5 h-5 text-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Case
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 index-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <CaseList />
        </motion.div>
      </main>
    </div>
  )
}


