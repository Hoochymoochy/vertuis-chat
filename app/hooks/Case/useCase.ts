"use client"

import { useEffect, useState } from "react"
import { addCase, getAllCase } from "@/app/lib/case"
import { useAuth } from "../Auth/useAuth"
import { useSidebar } from "../Global/SidebarContext"
import { Case } from "@/app/components/case/type"

export function useCases() {
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { userId } = useAuth()
  const { toggleAddCase, isAdding } = useSidebar()

  useEffect(() => {
    if (!userId) return

    const fetchCases = async () => {
      setIsLoading(true)
      try {
        const res = await getAllCase(userId)
        setCases(res.cases)
      } catch (err) {
        console.error("Error fetching cases:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCases()
  }, [userId])

  const handleAddCase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("name") as string
    const description = formData.get("description") as string

    if (!title || !description || !userId) {
      setIsSubmitting(false)
      return
    }

    try {
      const res = await addCase(title, description, userId)
      setCases(prev => [...prev, res.data[0]])
      toggleAddCase()
    } catch (err) {
      console.error("Error adding case:", err)
      alert("Failed to create case. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    cases,
    isLoading,
    isSubmitting,
    isAdding,
    toggleAddCase,
    handleAddCase,
  }
}
