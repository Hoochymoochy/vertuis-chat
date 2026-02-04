"use client"

import Spinner from "../../../../components/global/spinner"
import { AddDocument } from "../../../../components/case/AddDocument"
import { CaseSummary } from "../../../../components/case/CaseSummary"
import { DocumentContent } from "../../../../components/case/DocumentContent"
import { useCaseDetail } from "../../../../hooks/Case/useCaseDetail"

export default function DocumentPage() {
  const {
    caseItem,
    caseSummaries,
    selectedDoc,

    loading,
    showSummary,
    switchingTab,
    isSubmitting,
    isGeneratingSummary,
    isAddingDocument,

    file,
    documentTitle,

    setSwitchingTab,
    setDocumentTitle,

    handleAddDocument,
    handleGenerateNewSummary,
    toggleShowSummary,
    toggleAddDocument,
  } = useCaseDetail()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!caseItem) return null

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <AddDocument
        showAddDocument={isAddingDocument}
        closeAddDocumentModal={toggleAddDocument}
        handleAddDocument={handleAddDocument}
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
        file={file}
        isSubmitting={isSubmitting}
      />

      <div className="relative flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8 space-y-6">
          <CaseSummary
            caseSummaries={caseSummaries}
            caseItem={caseItem}
            toggleShowSummary={toggleShowSummary}
            showSummary={showSummary}
            handleGenerateNewSummary={handleGenerateNewSummary}
            isGeneratingSummary={isGeneratingSummary}
          />

          <DocumentContent
            selectedDoc={selectedDoc}
            switchingTab={switchingTab}
            setSwitchingTab={setSwitchingTab}
          />
        </div>
      </div>
    </div>
  )
}
