'use client'

import { supabase } from '@/app/lib/supabaseClient'

// Types for better type safety
export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  file_path?: string;
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

// Add a message to a chat with optional file
export const addMessage = async (
  chat_id: string, 
  sender: string, 
  message: string, 
  file_path?: string,
  file_name?: string
): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .insert({ 
      chat_id, 
      sender, 
      message, 
      file_path,
      file_name 
    })
    
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

export const getChatLength = async (chat_id: string): Promise<number> => {
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('chat_id', chat_id);

  if (error) throw error;
  return count || 0;
};

export const getLatestMessage = async (chat_id: string): Promise<Message | null> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chat_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows returned
    throw error
  } else {
    return data as Message
  }
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

export const giveFeedback = async (
  message_id: string, 
  type: string, 
  message: string, 
  reason?: string
) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ 
      feedback: type, 
      feedback_message: message, 
      feedback_reason: reason 
    })
    .eq('id', message_id)

  if (error) {
    if (error.code === 'PGRST116') return null // No rows returned
    throw error
  }
}

// ===== FILE STORAGE FUNCTIONS =====

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param userId - The user's ID for organizing files
 * @returns The public URL of the uploaded file
 */
export const uploadFileToStorage = async (
  file: File, 
  userId: string
): Promise<{ url: string; path: string }> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  
  // Upload to Supabase storage
  const { data, error } = await supabase.storage
    .from('chat-files') // Make sure this bucket exists in your Supabase project
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    console.error('File upload error:', error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('chat-files')
    .getPublicUrl(fileName)
  
  return {
    url: publicUrl,
    path: fileName
  }
}

/**
 * Delete a file from Supabase Storage
 * @param filePath - The path of the file to delete
 */
export const deleteFileFromStorage = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from('chat-files')
    .remove([filePath])
  
  if (error) {
    console.error('File deletion error:', error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

export const getPublicUrl = (path: string) => supabase.storage.from('chat-files').getPublicUrl(path).data.publicUrl