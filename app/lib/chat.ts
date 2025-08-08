'use client'

import { supabase } from '@/app/lib/supabaseClient'

const fetchChats = async () => {
  const { data, error } = await supabase
    .from('chat')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

const addUser = async (name: string, email: string) => {
  const { error } = await supabase.from('user').insert([name, email])
  if (error) throw error
  return ;
}

const addChat = async (user_id: string, title: string) => {
  const { error } = await supabase.from('chat').insert({ user_id, title })
  if (error) throw error
  return error
}

const getAllChat = async (user_id: string) => {
  const { data, error } = await supabase
    .from('chat')
    .select('*')
    .eq('user_id', user_id)
  if (error) throw error
  return data
}

const addMessage = async (chat_id: string, sender: string, message: string) => {
  const { error } = await supabase.from('message').insert({ chat_id, sender, message })
  if (error) throw error
  return error
}

const getAllMessage = async (chat_id: string) => {
  const { data, error } = await supabase
    .from('message')
    .select('*')
    .eq('chat_id', chat_id)
  if (error) throw error
  return data
}


export { fetchChats, addChat, addUser, getAllChat, addMessage }
