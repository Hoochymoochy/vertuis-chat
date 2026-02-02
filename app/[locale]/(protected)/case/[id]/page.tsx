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
import { useSidebar } from "../../../../hooks/Global/SidebarContext";

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
  const [file, setFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [lang, setLang] = useState("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [caseSummaries, setCaseSummaries] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [loading, setLoading] = useState(true);

  const { setShowAddDocument, isAddingDocument, toggleAddDocument } = useSidebar();

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
            showAddDocument={isAddingDocument}
            closeAddDocumentModal={toggleAddDocument}
            handleAddDocument={handleAddDocument}
            documentTitle={documentTitle}
            setDocumentTitle={setDocumentTitle}
            file={file}
            isSubmitting={isSubmitting}
          />
  
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