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
    handleFileChange,
  } = useCaseDetail()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <AddDocument
        showAddDocument={isAddingDocument}
        closeAddDocumentModal={toggleAddDocument}
        handleAddDocument={handleAddDocument}
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
        file={file}
        isSubmitting={isSubmitting}
        handleFileChange={handleFileChange}
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
    </>
  )
}