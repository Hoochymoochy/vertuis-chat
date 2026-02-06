import Link from "next/link"
import { useState } from "react"
import { Case } from "@/app/components/case/type"
import { formatUpdatedTime, useformatUpdatedTime } from "@/app/hooks/Case/useformatUpdatedTime"
import { useLocale } from "next-intl";


export function CaseList({ cases }: { cases: Case[]; }) {
  const locale = useLocale()
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const sortedCases = useformatUpdatedTime(cases, setVisibleItems)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedCases.map((caseItem, index) => (
        <Link
          key={caseItem.id}
          href={`/${locale}/case/${caseItem.id}`}
          className={`group block transition-all duration-500 ${
            visibleItems.includes(index)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex h-full min-h-50 flex-col border border-white/10 bg-black/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#d4af37]/40 hover:shadow-xl hover:shadow-[#d4af37]/10">
            
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-snug text-white transition-colors group-hover:text-[#d4af37] line-clamp-2">
                {caseItem.title}
              </h3>

              <span
                className={`shrink-0 px-2.5 py-1 text-xs font-medium ${
                  caseItem.status
                    ? "bg-[#d4af37]/15 text-[#d4af37]"
                    : "bg-white/10 text-white/70"
                }`}
              >
                {caseItem.status ? "Open" : "Closed"}
              </span>
            </div>

            {/* Description */}
            <p className="mb-4 flex-1 text-sm leading-relaxed text-white/60 line-clamp-3">
              {caseItem.description}
            </p>

            {/* Footer */}
            <div className="text-xs text-white/40">
              Updated {formatUpdatedTime(caseItem.updated_at)}
            </div>

          </div>
        </Link>
      ))}
    </div>
  )
}