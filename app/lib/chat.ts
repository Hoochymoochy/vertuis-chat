'use client'

import { supabase } from './supabaseClient'

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

if (!backendUrl) {
  throw new Error('NEXT_PUBLIC_CASE_RULE is not defined')
}
// Types for better type safety
export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  file_path?: string;
}

// Add a new user
export const addUser = async (name: string, email: string) => {
  const { error } = await supabase
    .from('users')
    .insert({ name, email })
  
  if (error) throw error
}

export const getChat = async (
  user_id: string
) => {
  const res = await fetch(`${backendUrl}/chat/${user_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  console.log(res)

  if (!res.ok) {
    throw new Error('Failed to add case')
  }

  return res.json()
}

export const getAllChats = async (user_id: string) => {
  const res = await fetch(`${backendUrl}/chats/${user_id} `, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error('Failed to add case')
  }

  return res.json()
}

export const addChat = async (
  user_id: string,
  title: string
) => {
  const res = await fetch(`${backendUrl}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, title }),
  })

  if (!res.ok) {
    throw new Error('Failed to add case')
  }

  return res.json()
}