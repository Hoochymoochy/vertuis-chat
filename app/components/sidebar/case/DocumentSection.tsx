import { ChevronLeft, Clock, Plus } from "lucide-react"

type Props = {
  handleBack: () => void
  caseItem: any
  documents: any[]
  selectedDoc: any | null
  setShowAddDocument: (value: boolean) => void
  setSelectedDoc: (doc: any) => void
}

// stub this if you don’t already have it elsewhere
const getFileIcon = (type: string) => {
  return <span className="text-xs">{type}</span>
}

export function DocumentSection({
  handleBack,
  caseItem,
  documents,
  selectedDoc,
  setShowAddDocument,
  setSelectedDoc,
}: Props) {
  return (
    <div className="relative w-80 bg-black/80 backdrop-blur-xl border-r border-gold/20 flex flex-col shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-gold/20">
        <button
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group"
          onClick={handleBack}
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Cases</span>
        </button>

        <h1 className="font-bold text-2xl mb-3 text-white">
          {caseItem?.title || "New Case"}
        </h1>

        <div className="flex items-center gap-3 mb-4">
          <span
            className={`inline-block px-3 py-1 text-xs font-medium ${
              caseItem?.status
                ? "bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30"
                : "bg-white/10 text-white/70 border border-white/20"
            }`}
          >
            {caseItem?.status ? "Open" : "Closed"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/50">
          <Clock className="w-3 h-3" />
          <span>
            Updated{" "}
            {caseItem?.updated_at
              ? new Date(caseItem.updated_at).toLocaleDateString()
              : "—"}
          </span>
        </div>
      </div>

      {/* Add Document Button */}
      <div className="p-6 border-b border-gold/20">
        <button
          onClick={() => setShowAddDocument(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 px-4 py-3 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
        >
          <Plus className="w-5 h-5 text-[#d4af37]" />
          <span className="font-medium text-[#d4af37]">Add Document</span>
        </button>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-6">
        {documents.length === 0 && (
          <h2 className="font-bold text-sm text-white/50 mb-4 uppercase tracking-wider">
            No documents found
          </h2>
        )}

        {documents.length > 0 && (
          <>
            <h2 className="font-bold text-sm text-white/50 mb-4 uppercase tracking-wider">
              Documents ({documents.length})
            </h2>

            <div className="space-y-3">
              {documents.map((document) => (
                <button
                  key={document.id}
                  onClick={() => setSelectedDoc(document)}
                  className={`w-full text-left bg-linear-to-r from-[#d4af37]/5 to-transparent hover:from-[#d4af37]/15 hover:to-[#d4af37]/5 border p-4 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] group ${
                    selectedDoc?.id === document.id
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

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-white/40 uppercase">
                          {document.file_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
