"use client"

import { useEffect, useState } from "react";
import { FileText, File, FileType, ChevronLeft, Plus, Clock, Sparkles, X, Upload } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, useParams } from "next/navigation";

import { getAllDocument, addDocument as addDocumentAPI } from "@/app/lib/document";
import { getCaseSummaries } from "@/app/lib/case";
import { getCase } from "@/app/lib/case";

import Spinner from "../../../../components/global/spinner";
import { AddDocument } from "../../../../components/case/AddDocument";
import { CaseSummary } from "../../../../components/case/CaseSummary";
import { DocumentContent } from "../../../../components/case/DocumentContent";

type Case = {
  id: number;
  title: string;
  description: string;
  summary: string;
  status: boolean;
  updated_at: string;
  summary_updated: string;
};

type Document = {
  id: number;
  title: string;
  file_path: string;
  file_type: string;
};

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf": return <FileText className="w-4 h-4" />;
    case "docx": return <File className="w-4 h-4" />;
    case "txt": return <FileType className="w-4 h-4" />;
    default: return <File className="w-4 h-4" />;
  }
};

export default function CasesPage() {
  const [caseItem, setCaseItem] = useState<Case>({
    id: 0,
    title: "",
    description: "",
    summary: "",
    status: true,
    updated_at: new Date().toISOString(),
    summary_updated: new Date().toISOString(),
  });

  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [switchingTab, setSwitchingTab] = useState(false);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [lang, setLang] = useState("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [caseSummaries, setCaseSummaries] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const locale = useLocale();
  const router = useRouter();

  const handleBack = () => router.push(`/${locale}/case`);

  useEffect(() => {
    if (!params.id) return;
  
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const [caseRes, docsRes] = await Promise.all([
          getCase(params.id as string),
          getAllDocument(params.id as string),
        ]);
  
        if (caseRes?.data?.length) {
          setCaseItem(caseRes.data[0]);
          setCaseId(caseRes.data[0].id);
          setCaseSummaries(caseRes.data[0].summary);
        }
  
        setDocuments(docsRes.documents ?? []);
      } catch (err) {
        console.error('Failed to fetch case data:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [params.id]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (!documentTitle) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setDocumentTitle(nameWithoutExt);
      }
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentTitle || (!file && !fileUrl)) {
      alert("Please provide a document title and either upload a file or provide a URL");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addDocumentAPI(
        params.id as string,
        documentTitle,
        file,
        lang
      );

      console.log("New document added:", response.data[0]);

      setDocuments([...documents, response.data[0]]);
      
      setShowAddDocument(false);
      setFile(null);
      setDocumentTitle("");
      setFileUrl("");
      setLang("en");
      
      setSelectedDoc(response.data[0]);
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Failed to add document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAddDocumentModal = () => {
    setShowAddDocument(false);
    setFile(null);
    setDocumentTitle("");
    setFileUrl("");
    setLang("en");
  };

  const handleGenerateNewSummary = async () => {
    const memory = caseItem.summary;
    setIsGeneratingSummary(true);
    setCaseSummaries("");
    try {
      const response = await getCaseSummaries(caseId, lang);
      setCaseSummaries(response.data);
      
      // Update the caseItem with new summary
      setCaseItem({
        ...caseItem,
        summary: response.data,
        summary_updated: new Date().toISOString()
      });
      
      setShowSummary(true);
    } catch (error) {
      setCaseSummaries(memory);
      console.error("Error generating case summary:", error);
      alert("Failed to generate case summary. Please try again.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const toggleShowSummary = () => {
    setShowSummary(!showSummary);
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center">
      {/* Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Add Document Modal */}
          <AddDocument
            showAddDocument={showAddDocument}
            closeAddDocumentModal={closeAddDocumentModal}
            handleAddDocument={handleAddDocument}
            documentTitle={documentTitle}
            setDocumentTitle={setDocumentTitle}
            file={file}
            isSubmitting={isSubmitting}
          />

          {/* Sidebar */}
          {/* <div className="relative w-80 bg-black/80 backdrop-blur-xl border-r border-gold/20 flex flex-col shrink-0">
            <div className="p-6 border-b border-gold/20">
              <button
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group"
                onClick={handleBack}
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm">Back to Cases</span>
              </button>
  
              <h1 className="font-bold text-2xl mb-3 text-white">
                {caseItem.title || "New Case"}
              </h1>
  
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium ${
                    caseItem.status
                      ? "bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30"
                      : "bg-white/10 text-white/70 border border-white/20"
                  }`}
                >
                  {caseItem.status ? "Open" : "Closed"}
                </span>
              </div>
  
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Clock className="w-3 h-3" />
                <span>Updated {new Date(caseItem.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
  
            <div className="p-6 border-b border-gold/20">
              <button 
                onClick={() => setShowAddDocument(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 px-4 py-3 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                <Plus className="w-5 h-5 text-[#d4af37]" />
                <span className="font-medium text-[#d4af37]">Add Document</span>
              </button>
            </div>
  
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
                          <div className="mt-1 text-[#d4af37]">{getFileIcon(document.file_type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white group-hover:text-[#d4af37] transition-colors mb-1 truncate">
                              {document.title}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-white/40 uppercase">{document.file_type}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div> */}
  
          {/* Main Content Area */}
          <div className="relative flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-8 space-y-6">
  
              {/* Case Summary */}
              <CaseSummary 
                caseSummaries = {caseSummaries} 
                caseItem = {caseItem} 
                toggleShowSummary = {toggleShowSummary} 
                showSummary = {showSummary} 
                handleGenerateNewSummary = {handleGenerateNewSummary} 
                isGeneratingSummary = {isGeneratingSummary} />
  
              {/* Document Content */}
              <DocumentContent 
                selectedDoc = {selectedDoc} 
                switchingTab = {switchingTab} 
                setSwitchingTab = {setSwitchingTab}/>
            </div>
          </div>
        </>
      )}
    </div>
  );
}