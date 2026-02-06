export interface Case {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  title: string;
  file_path: string;
  file_type: string;
};

export interface addCase {
  isAdding: boolean,
  toggleAddCase: () => void
  handleAddCase: (e: React.FormEvent<HTMLFormElement>) => void
  isSubmitting: boolean
}

export interface addDocument {
  showAddDocument: boolean
  closeAddDocumentModal: () => void
  handleAddDocument: (e: React.FormEvent<HTMLFormElement>) => void
  documentTitle: string
  setDocumentTitle: (title: string) => void
  file: File | null
  isSubmitting: boolean
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface caseSummaries {
  caseSummaries: string
  caseItem: any
  toggleShowSummary: () => void
  showSummary: boolean
  handleGenerateNewSummary: () => void
  isGeneratingSummary: boolean
}

export interface documentContent {
  selectedDoc: any
  switchingTab: boolean
  setSwitchingTab: (value: boolean) => void
}