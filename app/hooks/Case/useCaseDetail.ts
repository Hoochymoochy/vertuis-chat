"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLocale } from "next-intl"

import { getAllDocument, addDocument } from "@/app/lib/document"
import { getCase, getCaseSummaries } from "@/app/lib/case"
import { useSidebar } from "../Global/SidebarContext"
import { Case } from "@/app/components/case/type"

export function useCaseDetail() {
  const params = useParams()
  const router = useRouter()
  const locale = useLocale()

  const { 
    setShowAddDocument, 
    isAddingDocument, 
    toggleAddDocument, 
    setSelectCase, 
    setDocuments, 
    documents, 
    selectedDoc,
    setSelectDoc
  } = useSidebar()

  const [caseItem, setCaseItem] = useState<Case | null>(null)

  const [caseSummaries, setCaseSummaries] = useState("")
  const [showSummary, setShowSummary] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [documentTitle, setDocumentTitle] = useState("")
  const [lang, setLang] = useState("en")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [switchingTab, setSwitchingTab] = useState(false)
  const [loading, setLoading] = useState(true)

  const caseId = params.id as string

  useEffect(() => {
    if (!caseId) return

    const fetchData = async () => {
      try {
        setLoading(true)

        const [caseRes, docsRes] = await Promise.all([
          getCase(caseId),
          getAllDocument(caseId),
        ])

        if (caseRes?.data?.length) {
          const c = caseRes.data[0]
          setSelectCase(c)
          setCaseItem(c)
          setCaseSummaries(c.summary)
        }

        const docs = docsRes.documents ?? []
        setDocuments(docs)

        // Auto-select first document if available and none selected
        if (docs.length > 0 && !selectedDoc) {
          setSelectDoc(docs[0].id)
        }
      } catch (err) {
        console.error("Failed to fetch case data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [caseId])

  const handleBack = () => router.push(`/${locale}/case`)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    const selected = e.target.files[0]
    
    setFile(selected)

    console.log("Selected file:", selected)

    if (!documentTitle) {
      setDocumentTitle(selected.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!documentTitle || !file) return

    setIsSubmitting(true)

    try {
      const newDoc = await addDocument(caseId, documentTitle, file, lang)
      
      const updatedDocs = [...documents, newDoc]
      setDocuments(updatedDocs)
      
      // Auto-select the newly added document
      setSelectDoc(newDoc.id)

      toggleAddDocument()
      setFile(null)
      setDocumentTitle("")
      setLang("en")
    } catch (err) {
      console.error("Error adding document:", err)
      alert("Failed to add document.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeAddDocumentModal = () => {
    setShowAddDocument()
    setFile(null)
    setDocumentTitle("")
    setLang("en")
  }

  const handleGenerateNewSummary = async () => {
    if (!caseItem) return

    const memory = caseItem.summary
    setIsGeneratingSummary(true)
    setCaseSummaries("")

    try {
      const res = await getCaseSummaries(caseId, lang)

      setCaseSummaries(res.summary)
      setCaseItem({
        ...caseItem,
        summary: res.summary,
        summary_updated: new Date().toISOString(),
      })

      setShowSummary(true)
    } catch (err) {
      setCaseSummaries(memory)
      console.error("Error generating summary:", err)
      alert("Failed to generate case summary.")
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  return {
    // data
    caseItem,
    documents,
    selectedDoc,
    caseSummaries,

    // ui state
    loading,
    showSummary,
    switchingTab,
    isSubmitting,
    isGeneratingSummary,
    isAddingDocument,

    // setters
    setSwitchingTab,
    setDocumentTitle,
    setLang,

    // file
    file,
    documentTitle,

    // actions
    handleBack,
    handleFileChange,
    handleAddDocument,
    closeAddDocumentModal,
    handleGenerateNewSummary,
    toggleShowSummary: () => setShowSummary(v => !v),
    toggleAddDocument,
    setDocuments
  }
}