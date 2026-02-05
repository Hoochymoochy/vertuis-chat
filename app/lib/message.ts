'use client'

const backendUrl = process.env.NEXT_PUBLIC_CHAT_RULE

if (!backendUrl) {
  throw new Error('NEXT_PUBLIC_CASE_RULE is not defined')
}

export interface Message {
  id: string;
  chat_id: string;
  sender: string;
  message: string;
  created_at: string;
  file_path?: string;
  file_name?: string;
}

export const addMessage = async (
    chat_id: string,
    sender: string,
    message: string,
    file_path?: string,
    file_name?: string
  ) => {
    const res = await fetch(`${backendUrl}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chat_id, sender, message, file_path, file_name }),
    })
  
    if (!res.ok) {
      throw new Error('Failed to add case')
    }
  
    return res.json()
  }
  
  export const getMessages = async (
    chat_id: string
  ) => {
    const res = await fetch(`${backendUrl}/messages/${chat_id}`, {
      method: 'GET',
    })
  
    if (!res.ok) {
      throw new Error('Failed to add case')
    }
  
    return res.json()
  }