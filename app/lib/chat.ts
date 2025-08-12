'use client'

import { supabase } from '@/app/lib/supabaseClient'

// Fetch all chats
export const fetchChats = async () => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Add a new user
export const addUser = async (name: string, email: string) => {
  const { error } = await supabase
    .from('users') // 🔹 Make sure your table is plural
    .insert({ name, email })
  if (error) throw error
}

// Add a chat
export const addChat = async (user_id: string, title: string) => {
  const { data, error } = await supabase
    .from('chats')
    .insert({ user_id, title })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get all chats for a user
export const getAllChat = async (user_id: string) => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Add a message to a chat
export const addMessage = async (chat_id: string, sender: string, message: string) => {
  const { error } = await supabase
    .from('messages')
    .insert({ chat_id, sender, message })
  if (error) throw error
}

// Get all messages in a chat
export const getAllMessage = async (chat_id: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chat_id)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

// Get first chat ID for a user
export const getChatId = async (user_id: string) => {
  const { data, error } = await supabase
    .from('chats')
    .select('id')
    .eq('user_id', user_id)
    .order('created_at', { ascending: true })
    .limit(1)

  if (error) throw error
  return data?.[0]?.id || null
}

// Create a chat for a user
export const createChatId = async (user_id: string, title: string) => {
  const { data, error } = await supabase
    .from('chats')
    .insert({ user_id, title })
    .select()
    .single()

  if (error) throw error
  return data?.id
}


