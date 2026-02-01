import { Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"

type Props = {
    caseSummaries: string
    caseItem: any
    toggleShowSummary: () => void
    showSummary: boolean
    handleGenerateNewSummary: () => void
    isGeneratingSummary: boolean
}


export function CaseSummary({ caseSummaries, caseItem, toggleShowSummary, showSummary, handleGenerateNewSummary, isGeneratingSummary }: Props) {
    return (
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Case Summary</h2>
          <div className="flex items-center gap-3">
            {caseSummaries && caseItem.title && (
              <button
                onClick={toggleShowSummary}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-2 transition-all"
              >
                <span className="text-sm font-medium text-white">
                  {showSummary ? "Hide Summary" : "Show Summary"}
                </span>
              </button>
            )}
            <button
              onClick={handleGenerateNewSummary}
              disabled={isGeneratingSummary}
              className="flex items-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 px-4 py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className={`w-4 h-4 text-[#d4af37] ${isGeneratingSummary ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium text-[#d4af37]">
                {isGeneratingSummary ? "Generating..." : "Generate New Summary"}
              </span>
            </button>
          </div>
        </div>

        {showSummary && caseSummaries && caseItem.title && (
          <div className="mt-6 bg-black/50 border border-[#d4af37]/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <h3 className="font-semibold text-white">AI-Generated Summary</h3>
            </div>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#d4af37] underline hover:text-[#d4af37]/80 transition-colors"
                  />
                ),
                p: ({ children }) => (
                  <p className="text-white/80 leading-relaxed mb-4 last:mb-0">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="text-white/80 space-y-2 ml-6 mb-4 list-disc">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="text-white/80 space-y-2 ml-6 mb-4 list-decimal">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-white/80 leading-relaxed">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="text-white font-semibold">
                    {children}
                  </strong>
                ),
                code: ({ children }) => (
                  <code className="bg-white/5 text-[#d4af37] px-2 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                h1: ({ children }) => (
                  <h1 className="text-white text-2xl font-bold mb-4 mt-6 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-white text-xl font-semibold mb-3 mt-5 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-white text-lg font-semibold mb-3 mt-4 first:mt-0">
                    {children}
                  </h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#d4af37]/30 pl-4 my-4 text-white/70 italic">
                    {children}
                  </blockquote>
                ),
                hr: () => (
                  <hr className="border-t border-white/10 my-6" />
                ),
              }}
            >
              {caseSummaries}
            </ReactMarkdown>
            <div className="mt-4 text-xs text-[#d4af37] font-bold">
              Last generated: {new Date(caseItem.summary_updated).toLocaleDateString()}
            </div>
          </div>
        )}

        {isGeneratingSummary && (
          <div className="mt-6 bg-black/50 border border-[#d4af37]/20 rounded-lg p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#d4af37] animate-spin" />
              <div>
                <h3 className="font-semibold text-white mb-1">Generating Summary...</h3>
                <p className="text-white/60 text-sm">This may take a few moments</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
}