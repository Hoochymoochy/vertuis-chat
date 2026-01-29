"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, FileType, ArrowLeft, Sparkles, Plus } from "lucide-react"

const documents = [
  {
    id: 1,
    title: "Initial Complaint Filing",
    type: "pdf",
    hasSummary: true,
  },
  {
    id: 2,
    title: "Discovery Motion",
    type: "docx",
    hasSummary: true,
  },
  {
    id: 3,
    title: "Expert Witness Testimony",
    type: "txt",
    hasSummary: false,
  },
  {
    id: 4,
    title: "Settlement Agreement Draft",
    type: "pdf",
    hasSummary: false,
  },
]

export function CaseWorkspace({ caseId }: { caseId: string }) {
  const [selectedDoc, setSelectedDoc] = useState(documents[0])
  const [caseSummaryGenerated, setCaseSummaryGenerated] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-border bg-card p-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cases
        </Link>

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="text-sm font-medium text-foreground">Veritus</span>
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">Smith v. TechCorp Industries</h2>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Open</Badge>
        </div>

        <Button className="mb-6 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Document
        </Button>

        <div className="space-y-2">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documents</h3>
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                selectedDoc.id === doc.id
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-card hover:border-primary/30 hover:bg-secondary/50"
              }`}
            >
              <div className="mt-0.5">
                {doc.type === "pdf" ? (
                  <FileText className="h-4 w-4 text-primary" />
                ) : doc.type === "docx" ? (
                  <FileType className="h-4 w-4 text-primary" />
                ) : (
                  <FileText className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1 text-sm font-medium text-foreground">{doc.title}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="uppercase">{doc.type}</span>
                  {doc.hasSummary && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-primary">
                        <Sparkles className="h-3 w-3" />
                        AI Summary
                      </span>
                    </>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Case Summary Section */}
          <Card className="border-border bg-card p-8">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Case Summary</h2>
            {caseSummaryGenerated ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-primary">
                    <Sparkles className="h-4 w-4" />
                    AI-Generated Summary
                  </div>
                </div>
                <p className="leading-relaxed text-foreground">
                  This case involves a patent infringement dispute between Smith and TechCorp Industries concerning AI
                  technology and intellectual property rights. The plaintiff alleges that TechCorp willfully infringed
                  on multiple patents related to telecommunications algorithms developed between 2018-2022.
                </p>
                <p className="leading-relaxed text-foreground">
                  Key issues include the scope of patent claims, evidence of willful infringement, and calculation of
                  damages. Discovery has revealed internal TechCorp communications that may support the plaintiffs
                  claims. Expert witnesses have been retained by both parties to testify on technical implementation and
                  market impact.
                </p>
                <p className="leading-relaxed text-foreground">
                  The case is currently in the discovery phase with a trial date set for Q3 2026. Settlement
                  negotiations are ongoing, with mediation scheduled for next month.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="leading-relaxed text-muted-foreground">
                  Generate an AI-powered summary of your case based on all uploaded documents, case notes, and legal
                  research. This summary will provide key insights, identify critical issues, and highlight important
                  precedents.
                </p>
                <Button
                  onClick={() => setCaseSummaryGenerated(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Case Summary
                </Button>
              </div>
            )}
          </Card>

          {/* Document Viewer Section */}
          <Card className="border-border bg-card p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{selectedDoc.title}</h2>
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Summarize Document
              </Button>
            </div>

            <Tabs defaultValue="original" className="w-full">
              <TabsList className="mb-6 bg-secondary">
                <TabsTrigger value="original">Original Text</TabsTrigger>
                <TabsTrigger value="summary">AI Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="original" className="space-y-4">
                <div className="rounded-lg border border-border bg-background p-6">
                  <p className="mb-4 font-mono text-sm leading-relaxed text-foreground">
                    IN THE UNITED STATES DISTRICT COURT
                    <br />
                    FOR THE NORTHERN DISTRICT OF CALIFORNIA
                  </p>
                  <p className="mb-4 font-mono text-sm leading-relaxed text-foreground">
                    JOHN SMITH, individually and on behalf of all others similarly situated,
                    <br />
                    Plaintiff,
                  </p>
                  <p className="mb-4 font-mono text-sm leading-relaxed text-foreground">v.</p>
                  <p className="mb-4 font-mono text-sm leading-relaxed text-foreground">
                    TECHCORP INDUSTRIES, INC., a Delaware corporation,
                    <br />
                    Defendant.
                  </p>
                  <p className="mb-6 font-mono text-sm leading-relaxed text-foreground">Case No. 3:25-cv-12345</p>
                  <h3 className="mb-4 font-mono text-sm font-bold text-foreground">
                    COMPLAINT FOR PATENT INFRINGEMENT
                  </h3>
                  <p className="mb-4 font-mono text-sm leading-relaxed text-foreground">
                    Plaintiff John Smith, by and through his attorneys, hereby alleges as follows:
                  </p>
                  <p className="mb-4 font-mono text-sm leading-relaxed text-foreground">
                    1. This is an action for patent infringement arising under the Patent Laws of the United States,
                    Title 35, United States Code. This Court has subject matter jurisdiction over this action pursuant
                    to 28 U.S.C. §§ 1331 and 1338(a).
                  </p>
                  <p className="mb-4 font-mono text-sm leading-relaxed text-foreground">
                    2. Venue is proper in this Court pursuant to 28 U.S.C. §§ 1391 and 1400(b) because Defendant
                    maintains its principal place of business in this District and has committed acts of infringement in
                    this District.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="summary" className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                  <div className="mb-4 flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">AI-Generated Summary</span>
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-foreground">
                    <p>
                      <strong>Document Type:</strong> Initial Complaint Filing for Patent Infringement
                    </p>
                    <p>
                      <strong>Court:</strong> United States District Court, Northern District of California
                    </p>
                    <p>
                      <strong>Key Parties:</strong> John Smith (Plaintiff) v. TechCorp Industries, Inc. (Defendant)
                    </p>
                    <p>
                      <strong>Legal Basis:</strong> Patent infringement under Title 35 of the U.S. Code, with
                      jurisdiction under 28 U.S.C. §§ 1331 and 1338(a).
                    </p>
                    <p>
                      <strong>Key Arguments:</strong> The complaint establishes proper venue and jurisdiction, alleging
                      that TechCorp has committed acts of patent infringement within the Northern District of California
                      where they maintain their principal place of business.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
