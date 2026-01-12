'use client'

import { supabase } from '@/app/lib/supabaseClient'

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  discription: string;
  created_at: string;
  updated_at: string;
}

export const addCase = async (title: string, description: string, user_id: string) => {
    const { data, error } = await supabase
      .from('cases')
      .insert({ title, description, user_id })
      .select('*')
      .single()
    
    if (error) throw error
    return data
}

export const updateCase = async (name: string, description: string, id: string) => {
    const { error } = await supabase
      .from('cases')
      .update({ name, description })
      .eq('id', id)
    
    if (error) throw error
  }

  export const deleteCase = async (id: string) => {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  export const getCase = async (id: string) => {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  export const getCases = async (user_id: string) => {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('user_id', user_id)
    
    if (error) throw error
    return data
  }
