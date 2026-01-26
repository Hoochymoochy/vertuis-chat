"use client"

import { CaseList } from "@/app/[locale]/component/case/case-list"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { addCase, getAllCase } from "@/app/lib/case"
import useAuth from "@/app/hooks/useAuth"
import { Plus, X } from "lucide-react"

export interface Case {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export default function CasesPage() {
  const [newCase, setNewCase] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      const fetchCases = async () => {
        const cases = await getAllCase(userId);
        setCases(cases.cases);
      };
      fetchCases();
    }
  }, [userId]);

  const handleAddCase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    if (!title || !description) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      const newCaseData = await addCase(title, description, userId);
      console.log("New case added:", newCaseData.data[0]);
      setCases([...cases, newCaseData.data[0]]);
      setNewCase(false);
    } catch (error) {
      console.error("Error adding case:", error);
      alert("Failed to create case. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setNewCase(false);
    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center">
      {/* Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"/>
      
      {/* Header */}
      <div className="w-full z-40 border-b bg-black/80 backdrop-blur-xl border-gold/20">
        <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-6xl lg:text-8xl font-serif font-bold tracking-tight drop-shadow-[0_0_25px_rgba(255,215,0,0.15)] text-gradient">Cases</h1>
            <p className="text-sm text-gold mt-2 font-bold">
              Manage, review, and analyze your active matters
            </p>
          </div>

          <button
            onClick={() => setNewCase(true)}
            className="bg-linear-to-r from-gold/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 border border-gold/30 px-4 py-3 text-white font-medium transition-all duration-200 flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">New Case</span>
          </button>
        </div>
      </div>

      {/* Add Case Modal */}
      {newCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl">
            {/* Subtle animated gold glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-radial from-gold/10 via-transparent to-transparent blur-inset-[1px] rounded-xl animate-gold-spin opacity-40 blur-sm" />

            {/* Actual modal */}
            <div className="relative bg-black/95 backdrop-blur-xl p-8 rounded-xl border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Case</h2>
                  <p className="text-sm text-white/50 mt-1">
                    Start a new matter and attach documents later
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddCase} className="space-y-6">
                {/* Case Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                    Case Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., State v. Johnson"
                    className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37]/50 transition-colors rounded"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Brief summary of the case, charges, or context…"
                    className="w-full bg-black/50 border border-white/10 px-4 py-3 text-white placeholder-white/40 resize-none focus:outline-none focus:border-[#d4af37]/50 transition-colors rounded"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 text-white transition-all rounded"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 px-4 py-3 text-[#d4af37] font-medium transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed rounded"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Case"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <CaseList cases={cases} />
      </main>
    </div>
  )
}