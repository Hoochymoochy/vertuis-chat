'use client'

const backendUrl = process.env.NEXT_PUBLIC_CASE_RULE;


export const addDocument = async (case_id: string, title: string, file: File, file_url: string, lang: string) => {
    fetch(`${backendUrl}/douc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ case_id, title, file, file_url, lang }),
    })
}

export const getAllDocument = async (case_id: string) => {
  fetch(`${backendUrl}/documents/${case_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ case_id }),
  })
}

export const getDocument = async (document_id: string) => {
  fetch(`${backendUrl}/document/${document_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ document_id }),
  })
}

export const deleteDocument = async (document_id: string) => {
  fetch(`${backendUrl}/document/${document_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ document_id }),
  })
}