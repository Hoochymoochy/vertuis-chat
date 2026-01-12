'use client'

import { supabase } from '@/app/lib/supabaseClient'

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  file_path?: string;
}

export const addUser = async (name: string, email: string) => {
  const { error } = await supabase
    .from('users')
    .insert({ name, email })
  
  if (error) throw error
}
