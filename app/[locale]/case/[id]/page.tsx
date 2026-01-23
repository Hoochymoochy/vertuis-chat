"use client"

import { useEffect, useState } from "react";
import { FileText, File, FileType, ChevronLeft, Plus, Clock, Sparkles, X, Upload } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, useParams } from "next/navigation";

import { getAllDocument, addDocument as addDocumentAPI } from "@/app/lib/document";
import { getCaseSummaries } from "@/app/lib/case";
import { getCase } from "@/app/lib/case";
import ReactMarkdown from "react-markdown";

type Case = {
  id: number;
  title: string;
  description: string;
  status: boolean;
  updated_at: string;
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
    status: true,
    updated_at: new Date().toISOString(),
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

  const params = useParams();
  const locale = useLocale();
  const router = useRouter();

  const handleBack = () => router.push(`/${locale}/case`);

  useEffect(() => {
    if (params.id) {
      const fetchCase = async () => {
        const fetchedCase = await getCase(params.id as string);
        setCaseItem(fetchedCase.data[0]);
        setCaseId(fetchedCase.data[0].id);
      };
      fetchCase();
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      const fetchDocuments = async () => {
        const fetchedDocuments = await getAllDocument(params.id as string);
        setDocuments(fetchedDocuments.documents);
      };
      fetchDocuments();
    }
  }, [params.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill title from filename if not already set
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
      
      // Reset form
      setShowAddDocument(false);
      setFile(null);
      setDocumentTitle("");
      setFileUrl("");
      setLang("en");
      
      // Select the newly added document
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

  const handleCaseSummary = async () => {
    try {
      const response = await getCaseSummaries(caseId, lang);
      setCaseSummaries(response.data);
      setShowSummary(true);
      setSwitchingTab(true);
    } catch (error) {
      console.error("Error fetching case summary:", error);
      alert("Failed to fetch case summary. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center">
      {/* Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />


      {/* Add Document Modal */}
      {showAddDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-8 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Document</h2>
              <button
                onClick={closeAddDocumentModal}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-6">
              {/* Document Title */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="e.g., Employment Contract"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37]/50"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Upload File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-2 w-full bg-black/50 border border-white/10 hover:border-[#d4af37]/30 rounded-lg px-4 py-8 cursor-pointer transition-all group"
                  >
                    <Upload className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
                    <span className="text-white/60 group-hover:text-[#d4af37] transition-colors">
                      {file ? file.name : "Click to upload PDF, DOCX, or TXT"}
                    </span>
                  </label>
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-white/40 text-sm">OR</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeAddDocumentModal}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white transition-all"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-lg px-4 py-3 text-[#d4af37] font-medium transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="absolute left-0 top-0 h-full w-80 bg-black/80 backdrop-blur-xl border-r border-gold/20 flex flex-col">
        {/* Header */}
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
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
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

        {/* Add Document Button */}
        <div className="p-6 border-b border-gold/20">
          <button 
            onClick={() => setShowAddDocument(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-lg px-4 py-3 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            <Plus className="w-5 h-5 text-[#d4af37]" />
            <span className="font-medium text-[#d4af37]">Add Document</span>
          </button>
        </div>

        {/* Documents List */}
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
                    className={`w-full text-left bg-gradient-to-r from-[#d4af37]/5 to-transparent hover:from-[#d4af37]/15 hover:to-[#d4af37]/5 border rounded-lg p-4 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] group ${
                      selectedDoc?.id === document.id
                        ? "border-[#d4af37]/30 bg-[#d4af37]/10"
                        : "border-white/10 hover:border-[#d4af37]/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-[#d4af37]">{getFileIcon(document.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white group-hover:text-[#d4af37] transition-colors mb-1 truncate">
                          {document.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-white/40 uppercase">{document.type}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative ml-80 p-8 min-h-screen space-y-6">
        {/* Case Summary */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Case Summary</h2>
            <button
              onClick={() =>  handleCaseSummary() }
              className="flex items-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-lg px-4 py-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span className="text-sm font-medium text-[#d4af37]">
                {showSummary ? "Hide" : "Generate"} {caseItem.title ? "Summary" : "Case Summary"}
              </span>
            </button>
          </div>

          <p className="text-white/60 mb-4">
            {caseSummaries}
          </p>

          {showSummary && caseItem.title && (
            <div className="mt-6 bg-black/50 border border-[#d4af37]/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-semibold text-white">AI-Generated Summary</h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                The plaintiff alleges that the defendant engaged in discriminatory hiring practices based on age and gender. Key events include the initial complaint filing on January 5, 2024, followed by a discovery motion submitted on January 10, 2024. Expert witness testimony is scheduled for February 15, 2024. The case is currently open and active.
              </p>
              <div className="mt-4 text-xs text-white/40">Last generated: January 20, 2024</div>
            </div>
          )}
        </div>

        {/* Document Content */}
        {selectedDoc && (
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedDoc.title}</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-white/10">
              <button
                onClick={() => setSwitchingTab(false)}
                className={`flex items-center gap-2 py-2 px-4 text-sm font-medium transition-colors ${
                  !switchingTab ? "bg-[#d4af37]/10 text-[#d4af37]" : "text-white/60"
                }`}
              >
                <span>Original Text</span>
              </button>
              <button
                onClick={() => setSwitchingTab(true)}
                className={`flex items-center gap-2 py-2 px-4 text-sm font-medium transition-colors ${
                  switchingTab ? "bg-[#d4af37]/10 text-[#d4af37]" : "text-white/60"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI-Generated Summary</span>
              </button>
            </div>

            {/* Document Content */}
            <div className="bg-black/30 border border-white/5 rounded-lg p-6 min-h-[400px]">
              {switchingTab ? (
                <div>
                  <h3 className="font-semibold text-white mb-4">AI-Generated Summary</h3>
                  <div className="overflow-hidden">
                    <ReactMarkdown
                      components={{
                        // Links
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold underline hover:text-gold/80 transition-colors"
                          />
                        ),
                        // Paragraphs
                        p: ({ children }) => (
                          <p className="text-white/80 text-sm leading-relaxed mb-3 last:mb-0">
                            {children}
                          </p>
                        ),
                        // Unordered lists
                        ul: ({ children }) => (
                          <ul className="text-white/80 text-sm space-y-1.5 ml-4 mb-3 list-disc">
                            {children}
                          </ul>
                        ),
                        // Ordered lists
                        ol: ({ children }) => (
                          <ol className="text-white/80 text-sm space-y-1.5 ml-4 mb-3 list-decimal">
                            {children}
                          </ol>
                        ),
                        // List items
                        li: ({ children }) => (
                          <li className="text-white/80 text-sm leading-relaxed">
                            {children}
                          </li>
                        ),
                        // Bold text
                        strong: ({ children }) => (
                          <strong className="text-white font-semibold">
                            {children}
                          </strong>
                        ),
                        // Inline code
                        code: ({ children }) => (
                          <code className="bg-white/5 text-gold px-1.5 py-0.5 rounded text-xs font-mono">
                            {children}
                          </code>
                        ),
                        // Headings
                        h1: ({ children }) => (
                          <h1 className="text-white text-xl font-bold mb-3 mt-4 first:mt-0">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-white text-lg font-semibold mb-3 mt-4 first:mt-0">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-white text-base font-semibold mb-2 mt-3 first:mt-0">
                            {children}
                          </h3>
                        ),
                        // Blockquotes
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-gold/30 pl-4 my-3 text-white/70 italic">
                            {children}
                          </blockquote>
                        ),
                        // Horizontal rule
                        hr: () => (
                          <hr className="border-t border-white/10 my-4" />
                        ),
                      }}
                    >
                      {selectedDoc.summary}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-white mb-4">Original Text</h3>
                  <iframe
                    src={selectedDoc.signed_url}
                    width="100%"
                    height="400"
                    className="border border-white/10 rounded-lg"
                  ></iframe>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}