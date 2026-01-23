import Link from "next/link"
import { useTranslations, useLocale } from "next-intl";


/* =======================
   Types
======================= */

interface Case {
  id: string;
  user_id: string;
  title: string;
  description: string;  // fix typo
  status: boolean;      // add this field
  created_at: string;
  updated_at: string;
}

/* =======================
   Utils
======================= */

// Normalize time into minutes / hours / days / months / years
function formatUpdatedTime(dateString: string) {
  const updated = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - updated.getTime()

  const minutes = Math.floor(diffMs / (1000 * 60))
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`

  const years = Math.floor(months / 12)
  return `${years} year${years !== 1 ? "s" : ""} ago`
}

/* =======================
   Component
======================= */

export function CaseList({ cases }: { cases: Case[] }) {
  const locale = useLocale();

  // 🔥 newest → oldest
  const sortedCases = [...cases].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() -
      new Date(a.updated_at).getTime()
  )

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sortedCases.map((caseItem) => (
        <Link
          key={caseItem.id}
          href={`/${locale}/case/${caseItem.id}`}
          className="group block"
        >
          <div className="flex h-full min-h-50 flex-col border border-white/10 bg-black/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#d4af37]/40 hover:shadow-xl hover:shadow-[#d4af37]/10">
            
            {/* Header */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-snug text-white transition-colors group-hover:text-[#d4af37] line-clamp-2">
                {caseItem.title}
              </h3>

              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
