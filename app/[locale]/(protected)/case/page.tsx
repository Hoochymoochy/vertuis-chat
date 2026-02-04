"use client"

import { CaseList } from "../../../components/case/case-list"
import { CaseListSkeleton } from "../../../components/case/case-skeleton"
import { AddCase } from "@/app/components/case/addCase"
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
