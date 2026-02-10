'use client'

import { Language } from "@carbon/icons-react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined')
}

export interface Message {
  id: string;
  chat_id: string;
  sender: string;
  message: string;
  created_at: string;
}

export const addMessage = async (
  chat_id: string,
  sender: string,
  message: string,
) => {
  const res = await fetch(`${backendUrl}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chat_id, sender, message }),
  })

  if (!res.ok) {
    throw new Error('Failed to add message')
  }

  return res.json()
}

export const getMessages = async (chat_id: string) => {
  const res = await fetch(`${backendUrl}/messages/${chat_id}`, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error('Failed to get messages')
  }

  return res.json()
}

export const processMessage = async (message: string, chat_id: string, locale: string) => {
  const res = await fetch(`${backendUrl}/process-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, chat_id, language: locale }),
  })
}