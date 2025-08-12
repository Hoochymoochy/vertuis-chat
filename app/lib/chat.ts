'use client'

import { supabase } from '@/app/lib/supabaseClient'

// Types for better type safety
export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender: string;
  message: string;
  created_at: string;
}

// Add a new user
export const addUser = async (name: string, email: string) => {
  const { error } = await supabase
    .from('users')
    .insert({ name, email })
  
  if (error) throw error
}

// Add a chat and return the full chat object
export const addChat = async (user_id: string, title: string): Promise<Chat> => {
  const { data, error } = await supabase
    .from('chats')
    .insert({ user_id, title })
    .select('*')
    .single()

  if (error) throw error
  return data as Chat
}

// Get all chats for a user
export const getAllChat = async (user_id: string): Promise<Chat[]> => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Chat[] || []
}

// Get a specific chat by ID (useful for validation)
export const getChatById = async (chat_id: string): Promise<Chat | null> => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('id', chat_id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows returned
    throw error
  }
  return data as Chat
}

// Check if a chat belongs to a user
export const validateChatOwnership = async (chat_id: string, user_id: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('chats')
    .select('id')
    .eq('id', chat_id)
    .eq('user_id', user_id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return false // No rows returned
    throw error
  }
  return !!data
}

// Add a message to a chat
export const addMessage = async (chat_id: string, sender: string, message: string): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .insert({ chat_id, sender, message })
    
  if (error) throw error
}

// Get all messages in a chat
export const getAllMessage = async (chat_id: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chat_id)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Message[] || []
}

// Delete a chat and all its messages
export const deleteChat = async (chat_id: string): Promise<void> => {
  // First delete all messages
  const { error: messagesError } = await supabase
    .from('messages')
    .delete()
    .eq('chat_id', chat_id)

  if (messagesError) throw messagesError

  // Then delete the chat
  const { error: chatError } = await supabase
    .from('chats')
    .delete()
    .eq('id', chat_id)

  if (chatError) throw chatError
}

// Get the most recent chat for a user (useful for default loading)
export const getLatestChat = async (user_id: string): Promise<Chat | null> => {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows returned
    throw error
  }
  return data as Chat
}