import Link from "next/link"
import { CaseList } from "@/app/[locale]/component/case-list"

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-primary" />
                <span className="text-xl font-semibold tracking-tight text-foreground">Veritus</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Cases</h1>
          </div>
          <Link
            href="/case/1"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <span className="mr-2 text-lg">+</span>
            New Case
          </Link>
        </div>
        <CaseList />
      </div>
    </div>
  )
}
