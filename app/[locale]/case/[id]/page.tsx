"use client"

import { useEffect, useState } from "react";
import { getCase } from "@/app/lib/case";
import { useParams } from "next/navigation";

type Case = {
    id: number
    title: string
    description: string
    status: boolean // true = Open, false = Closed
    updated_at: string // ISO date string
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


export default function CasesPage() {
  const [caseItem, setCaseItem] = useState<Case>();
  const [chatId, setChatId] = useState<string | null>(null);
  const params = useParams();

    useEffect(() => {
        if (params.id) {
          setChatId(params.id as string);
        }
      }, [params.id]);

    useEffect(() => {
        const fetchCase = async () => {
            const caseItem = await getCase(chatId as string);
            setCaseItem(caseItem);
        };
        fetchCase();    
    })

    return (
        <div className="relative min-h-screen bg-black text-white bg-[url('/marble.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

            {/* Side */}
            <div className=" absolute left-0 top-0 h-full w-80 bg-black flex flex-col p-10 space-y-5">
                <div>
                    Go back
                </div>

                <div>
                    <span className="font-bold text-2xl">
                        {caseItem?.title}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className={`shrink-0 rounded-full py-1 text-xs font-medium ${
                        caseItem?.status
                            ? "bg-[#d4af37]/15 text-[#d4af37]"
                            : "bg-white/10 text-white/70"
                        }`}
                    >
                        {caseItem?.status ? "Open" : "Closed"}
                    </span>
                </div>
                <div className="justify-center flex">
                    <button className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 border border-gold/30  py-1"><h1 className="text-2xl">+</h1>Add Document</button>
                </div>

                <span className="font-bold text-white/70 text-based">Documents</span>

                {
                    documents.map((document) => (
                        <div key={document.id} className="bg-linear-to-r from-gold/25 to-gold/10 hover:from-gold/35 hover:to-gold/20 border border-gold/30 px-5 py-3 font-medium flex items-center gap-3 shadow-[0_0_25px_rgba(212,175,55,0.15)] transition-all">
                            <div>{document.title}</div>
                            <div>
                            <div>{document.type}</div>
                            <div>{document.hasSummary ? "AI Summary" : ""}</div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    );
}