import { ChevronLeft, Clock } from "lucide-react"
import { AddButton } from "../Button"
import { ANIMATION } from "../sidebar.constants"
import { useSidebar } from "../../../hooks/Global/SidebarContext"

const getFileIcon = (type: string) => {
  return <span className="text-xs">{type}</span>
}

export function DocumentSection() {
  const { 
    isCollapsed,
    handleBack,
    selectedCase,
    documents,
    selectDoc,
    setShowAddDocument,
    setSelectDoc
  } = useSidebar();

  const isOpen = selectedCase?.status
  const updatedDate = selectedCase?.updated_at 
    ? new Date(selectedCase.updated_at).toLocaleDateString() 
    : "—"

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gold/20">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group"
          onClick={handleBack}
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Cases</span>
        </button>

        {/* Case Title */}
        <h1 className="font-bold text-2xl mb-3 text-white">
          {selectedCase?.title || "New Case"}
        </h1>

        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`inline-block px-3 py-1 text-xs font-medium ${
              isOpen
                ? "bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30"
                : "bg-white/10 text-white/70 border border-white/20"
            }`}
          >
            {isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
          <Clock className="w-3 h-3" />
          <span>Updated {updatedDate}</span>
        </div>

        {/* Add Document Button */}
        <div
          className={`transition-all ${isCollapsed ? "pt-2" : "pt-4"}`}
          style={{
            transitionDuration: `${ANIMATION.DURATION}ms`,
            transitionTimingFunction: ANIMATION.EASING,
          }}
        >
          <AddButton 
            onClick={setShowAddDocument} 
            isCollapsed={isCollapsed} 
            label="Document" 
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-6">
        {!documents || documents.length === 0 ? (
          <p className="text-sm text-white/50">
            No documents found
          </p>
        ) : (
          <>
            <h2 className="font-bold text-sm text-white/50 mb-4 uppercase tracking-wider">
              Documents ({documents.length})
            </h2>

            <div className="space-y-3">
              {documents.map((document) => {
                const isSelected = selectDoc === document.id

                return (
                  <button
                    key={document.id}
                    onClick={() => setSelectDoc(document.id)}
                    className={`w-full text-left bg-linear-to-r from-[#d4af37]/5 to-transparent hover:from-[#d4af37]/15 hover:to-[#d4af37]/5 border p-4 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] group ${
                      isSelected
                        ? "border-[#d4af37]/30 bg-[#d4af37]/10"
                        : "border-white/10 hover:border-[#d4af37]/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-[#d4af37]">
                        {getFileIcon(document.file_type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white group-hover:text-[#d4af37] transition-colors mb-1 truncate">
                          {document.title}
                        </div>

                        <div className="text-xs text-white/40 uppercase">
                          {document.file_type}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}