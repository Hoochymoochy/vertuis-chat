import { useCallback, useState } from "react";

export function useDocuments() {
  const [castItem, setCastItem] = useState("")
  const [documents, setDocuments] = useState([])
  const [selectDoc, setSelectDoc] = useState("")

  const handleBack = () => {

  }

  const setShowAddDocument = () => {

  }

  return {
    handleBack,
    castItem,
    documents,
    selectDoc,
    setShowAddDocument,
    setSelectDoc
  };
}