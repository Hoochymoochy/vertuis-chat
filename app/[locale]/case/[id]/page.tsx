"use client"

import { useEffect, useState } from "react";
import { FileText, File, FileType, ChevronLeft, Plus, Clock } from "lucide-react";
import { useLocale } from "next-intl";

type Case = {
    id: number
    title: string
    description: string
    status: boolean
    updated_at: string
}

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
        title: "Motion to Dismiss",
        type: "pdf",
        hasSummary: true,
    },
]

// Mock case data for demo
const mockCase: Case = {
    id: 1,
    title: "Smith v. Corporation Inc.",
    description: "Employment discrimination case",
    status: true,
    updated_at: "2024-01-15T10:30:00Z"
}

const getFileIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FileText className="w-4 h-4" />;
        case 'docx': return <File className="w-4 h-4" />;
        case 'txt': return <FileType className="w-4 h-4" />;
        default: return <File className="w-4 h-4" />;
    }
}

export default function CasesPage() {
    const [caseItem, setCaseItem] = useState<Case>(mockCase);
    const locale = useLocale();

    return (
        <div className="relative min-h-screen bg-black text-white">
            {/* Background with marble texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900"></div>
            <div className="absolute inset-0 bg-[url('/marble.jpg')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 backdrop-blur-sm"></div>

            {/* Sidebar */}
            <div className="absolute left-0 top-0 h-full w-80 bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Back to Cases</span>
                    </button>

                    <h1 className="font-bold text-2xl mb-3 text-white">
                        {caseItem?.title}
                    </h1>

                    <div className="flex items-center gap-3 mb-4">
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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
                        <span>Updated {new Date(caseItem?.updated_at).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Add Document Button */}
                <div className="p-6 border-b border-white/10">
                    <button className="w-full flex items-center justify-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-lg px-4 py-3 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        <Plus className="w-5 h-5 text-[#d4af37]" />
                        <span className="font-medium text-[#d4af37]">Add Document</span>
                    </button>
                </div>

                {/* Documents List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h2 className="font-bold text-sm text-white/50 mb-4 uppercase tracking-wider">
                        Documents ({documents.length})
                    </h2>

                    <div className="space-y-3">
                        {documents.map((document) => (
                            <button
                                key={document.id}
                                className="w-full text-left bg-gradient-to-r from-[#d4af37]/5 to-transparent hover:from-[#d4af37]/15 hover:to-[#d4af37]/5 border border-white/10 hover:border-[#d4af37]/30 rounded-lg p-4 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-[#d4af37]">
                                        {getFileIcon(document.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-white group-hover:text-[#d4af37] transition-colors mb-1 truncate">
                                            {document.title}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-white/40 uppercase">{document.type}</span>
                                            {document.hasSummary && (
                                                <>
                                                    <span className="text-white/20">•</span>
                                                    <span className="text-[#d4af37]/70">AI Summary</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative ml-80 p-8">
                <div className="max-w-4xl">
                    <h2 className="text-3xl font-bold mb-4 text-white">Case Overview</h2>
                    <p className="text-white/60 text-lg">
                        Select a document from the sidebar to view details and AI-generated summaries.
                    </p>
                </div>
            </div>
        </div>
    );
}