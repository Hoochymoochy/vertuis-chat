export interface Case {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  summary: string;
  summary_updated: string;
}

export interface Document {
  id: number;
  title: string;
  file_path: string;
  file_type: string;
  summary?: string;
  signed_url?: string;
}

export interface AddCaseProps {
  isAdding: boolean;
  toggleAddCase: () => void;
  handleAddCase: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

export interface AddDocumentProps {
  showAddDocument: boolean;
  closeAddDocumentModal: () => void;
  handleAddDocument: (e: React.FormEvent<HTMLFormElement>) => void;
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  file: File | null;
  isSubmitting: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CaseSummariesProps {
  caseSummaries: string;
  caseItem: Case | null;
  toggleShowSummary: () => void;
  showSummary: boolean;
  handleGenerateNewSummary: () => void;
  isGeneratingSummary: boolean;
}

export interface DocumentContentProps {
  selectedDoc: Document | null;
  switchingTab: boolean;
  setSwitchingTab: (value: boolean) => void;
}
