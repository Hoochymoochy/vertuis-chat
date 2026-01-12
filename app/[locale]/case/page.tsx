"use client"

import { CaseList } from "@/app/[locale]/component/case-list"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { addCase, getCases } from "@/app/lib/case"
import useAuth  from "@/app/hooks/useAuth"

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  discription: string;
  created_at: string;
  updated_at: string;
}

export default function CasesPage() {
  const [newCase, setNewCase] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const { userId, isCheckingAuth } = useAuth();

  useEffect(() => {
    if (userId) {
      const fetchCases = async () => {
        const cases = await getCases(userId);
        setCases(cases);
      };
      fetchCases();
    }
  }, [userId]);

  const handleAddCase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    if (!title || !description) return;
    
    const newCaseData = await addCase(title, description, userId);
    setCases([...cases, newCaseData]);
    setNewCase(false);
  };
  

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
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setNewCase(true)}
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
      <main className="max-w-7xl mx-auto px-6 py-10 z-40 relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {newCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
              onClick={() => setNewCase(false)}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="
                  w-full max-w-lg
                  bg-black/90
                  border border-gold/30
                  shadow-[0_0_40px_rgba(212,175,55,0.15)]
                  p-8
                "
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create New Case</h2>
                    <p className="text-sm text-white/50 mt-1">
                      Start a new matter and attach documents later
                    </p>
                  </div>

                  <button
                    onClick={() => setNewCase(false)}
                    className="text-white/40 hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleAddCase}>
                  {/* Case Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-white/80"
                    >
                      Case Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      placeholder="e.g. State v. Johnson"
                      className="
                        w-full
                        bg-black/60
                        border border-gold/20
                        px-4 py-3
                        text-white
                        placeholder-white/30
                        focus:outline-none
                        focus:border-gold
                        focus:ring-1 focus:ring-gold/40
                        transition
                      "
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-white/80"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      placeholder="Brief summary of the case, charges, or context…"
                      className="
                        w-full
                        bg-black/60
                        border border-gold/20
                        px-4 py-3
                        text-white
                        placeholder-white/30
                        resize-none
                        focus:outline-none
                        focus:border-gold
                        focus:ring-1 focus:ring-gold/40
                        transition
                      "
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="
                        px-6 py-3
                        bg-linear-to-r from-gold/30 to-gold/15
                        border border-gold/40
                        text-sm font-medium
                        shadow-[0_0_20px_rgba(212,175,55,0.25)]
                        hover:from-gold/40 hover:to-gold/25
                        transition-all
                      "
                    >
                      Create Case
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
          <CaseList cases={cases} />
        </motion.div>
      </main>
    </div>
  )
}