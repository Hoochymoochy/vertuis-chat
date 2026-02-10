"use client"

import { CaseList } from "../../../components/case/CaseList"
import { CaseListSkeleton } from "../../../components/case/CaseSkeleton"
import { AddCase } from "../../../components/case/AddCase"
import { useCases } from "../../../hooks/Case/useCase"

export default function CasesPage() {
  const {
    cases,
    isLoading,
    isSubmitting,
    isAdding,
    toggleAddCase,
    handleAddCase,
  } = useCases()

  return (
    <>
      <AddCase
        isAdding={isAdding}
        toggleAddCase={toggleAddCase}
        handleAddCase={handleAddCase}
        isSubmitting={isSubmitting}
      />

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
