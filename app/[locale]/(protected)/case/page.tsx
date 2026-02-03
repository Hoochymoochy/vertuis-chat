"use client"

import { CaseList } from "../../../components/case/case-list"
import { CaseListSkeleton } from "../../../components/case/case-skeleton"
import { useEffect, useState } from "react"
import { addCase, getAllCase } from "@/app/lib/case"
import { useAuth } from "../../../hooks/Auth/useAuth"
import { AddCase } from "@/app/components/case/addCase"
import { useSidebar } from "../../../hooks/Global/SidebarContext"
import { Case } from "../../../components/case/type"

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userId } = useAuth()
  const { toggleAddCase, isAdding } = useSidebar()

  useEffect(() => {
    if (userId) {
      const fetchCases = async () => {
        setIsLoading(true)
        try {
          const cases = await getAllCase(userId)
          setCases(cases.cases)
        } catch (error) {
          console.error("Error fetching cases:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchCases()
    }
  }, [userId])

  const handleAddCase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('name') as string
    const description = formData.get('description') as string
    
    if (!title || !description) {
      setIsSubmitting(false)
      return
    }
    
    try {
      const newCaseData = await addCase(title, description, userId)
      console.log("New case added:", newCaseData.data[0])
      setCases([...cases, newCaseData.data[0]])
      toggleAddCase()
    } catch (error) {
      console.error("Error adding case:", error)
      alert("Failed to create case. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Add Case Modal */}
      <AddCase 
        isAdding={isAdding} 
        toggleAddCase={toggleAddCase} 
        handleAddCase={handleAddCase} 
        isSubmitting={isSubmitting} 
      />

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-10">
        {isLoading ? (
          <CaseListSkeleton count={8} />
        ) : (
          <CaseList cases={cases} />
        )}
      </main>
    </>
  )
}