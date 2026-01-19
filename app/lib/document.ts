"use client"

const backendUrl = process.env.NEXT_PUBLIC_CASE_RULE!

/* =======================
   ADD DOCUMENT
   POST + FormData
======================= */
export const addDocument = async (
  case_id: string,
  title: string,
  file: File,
  file_url: string,
  lang: string
) => {
  const formData = new FormData()
  formData.append("case_id", case_id)
  formData.append("title", title)
  formData.append("file", file)
  formData.append("file_url", file_url)
  formData.append("lang", lang)

  const res = await fetch(`${backendUrl}/document`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    throw new Error("Failed to add document")
  }

  return res.json()
}

/* =======================
   GET ALL DOCUMENTS
   GET + path param
======================= */
export const getAllDocument = async (case_id: string) => {
  const res = await fetch(`${backendUrl}/documents/${case_id}`, {
    method: "GET",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch documents")
  }

  return res.json()
}

/* =======================
   GET SINGLE DOCUMENT
======================= */
export const getDocument = async (document_id: string) => {
  const res = await fetch(`${backendUrl}/document/${document_id}`, {
    method: "GET",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch document")
  }

  return res.json()
}

/* =======================
   DELETE DOCUMENT
======================= */
export const deleteDocument = async (document_id: string) => {
  const res = await fetch(`${backendUrl}/document/${document_id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete document")
  }

  return res.json()
}
