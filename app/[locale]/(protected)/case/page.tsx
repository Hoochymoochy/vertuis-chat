"use client"

import { CaseList } from "../../../components/case/case-list"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { addCase, getAllCase } from "@/app/lib/case"
import { useAuth } from "../../../hooks/Auth/useAuth"
import { X } from "lucide-react"
import { tr } from "framer-motion/client"
import { AddCase } from "@/app/components/case/addCase"
import { useSidebar } from "../../../hooks/Global/SidebarContext";

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
  const [cases, setCases] = useState<Case[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const { toggleAddCase, isAdding } = useSidebar();

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


  return (
    <div className="relative min-h-screen items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center">
      {/* Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"/>
      

      {/* Add Case Modal */}
      <AddCase isAdding={isAdding} toggleAddCase={toggleAddCase} handleAddCase={handleAddCase} isSubmitting={isSubmitting} />

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <CaseList cases={cases} />
      </main>
    </div>
  )
}