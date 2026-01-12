import Link from "next/link"

const cases = [
  {
    id: 1,
    name: "Smith v. TechCorp Industries",
    description:
      "Patent infringement case involving AI technology and intellectual property rights in the telecommunications sector.",
    status: "Open",
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    name: "Johnson & Associates v. State",
    description:
      "Class action lawsuit regarding environmental regulations and corporate compliance violations.",
    status: "Open",
    lastUpdated: "1 day ago",
  },
  {
    id: 3,
    name: "Davis Estate Settlement",
    description:
      "Complex estate planning matter involving multiple beneficiaries and international assets.",
    status: "Closed",
    lastUpdated: "3 days ago",
  },
  {
    id: 4,
    name: "Reynolds Medical Malpractice",
    description:
      "Professional liability case concerning medical procedures and standard of care documentation.",
    status: "Open",
    lastUpdated: "5 days ago",
  },
  {
    id: 5,
    name: "Carter Merger & Acquisition",
    description:
      "Corporate M&A due diligence and contract negotiation for multi-million dollar transaction.",
    status: "Open",
    lastUpdated: "1 week ago",
  },
  {
    id: 6,
    name: "Martinez Employment Dispute",
    description:
      "Wrongful termination case involving employment contracts and non-compete agreements.",
    status: "Closed",
    lastUpdated: "2 weeks ago",
  },
]

export function CaseList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cases.map((caseItem) => (
        <Link
          key={caseItem.id}
          href={`/case/${caseItem.id}`}
          className="group block"
        >
          <div className="h-full border border-white/10 bg-black/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#d4af37]/40 hover:shadow-xl hover:shadow-[#d4af37]/10">
            {/* Header */}
            <div className="mb-10 flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-[#d4af37]">
                {caseItem.name}
              </h3>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  caseItem.status === "Open"
                    ? "bg-[#d4af37]/15 text-[#d4af37]"
                    : "bg-white/10 text-white/70"
                }`}
              >
                {caseItem.status}
              </span>
            </div>

            {/* Description */}
            <p className="mb-10 text-sm leading-relaxed text-white/60">
              {caseItem.description}
            </p>

            {/* Footer */}
            <div className="text-xs text-white/40">
              Updated {caseItem.lastUpdated}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
