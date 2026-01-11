import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

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
    description: "Class action lawsuit regarding environmental regulations and corporate compliance violations.",
    status: "Open",
    lastUpdated: "1 day ago",
  },
  {
    id: 3,
    name: "Davis Estate Settlement",
    description: "Complex estate planning matter involving multiple beneficiaries and international assets.",
    status: "Closed",
    lastUpdated: "3 days ago",
  },
  {
    id: 4,
    name: "Reynolds Medical Malpractice",
    description: "Professional liability case concerning medical procedures and standard of care documentation.",
    status: "Open",
    lastUpdated: "5 days ago",
  },
  {
    id: 5,
    name: "Carter Merger & Acquisition",
    description: "Corporate M&A due diligence and contract negotiation for multi-million dollar transaction.",
    status: "Open",
    lastUpdated: "1 week ago",
  },
  {
    id: 6,
    name: "Martinez Employment Dispute",
    description: "Wrongful termination case involving employment contracts and non-compete agreements.",
    status: "Closed",
    lastUpdated: "2 weeks ago",
  },
]

export function CaseList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cases.map((caseItem) => (
        <Link key={caseItem.id} href={`/case/${caseItem.id}`}>
          <Card className="group h-full border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-semibold leading-tight text-card-foreground group-hover:text-primary">
                {caseItem.name}
              </h3>
              <Badge
                variant={caseItem.status === "Open" ? "default" : "secondary"}
                className={
                  caseItem.status === "Open"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-secondary text-secondary-foreground"
                }
              >
                {caseItem.status}
              </Badge>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{caseItem.description}</p>
            <div className="text-xs text-muted-foreground">Updated {caseItem.lastUpdated}</div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
