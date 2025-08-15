'use client'
import { supabase } from '@/app/lib/supabaseClient'

// Sign up a user
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  return {
    id: data.user?.id,
    email: data.user?.email
  }
}

// Sign in a user
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error

  return {
    id: data.user?.id,
    email: data.user?.email
  }
}

// Get currently logged-in user
export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error

  return {
    id: data.user?.id,
    email: data.user?.email
  }
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signIn({ provider: 'google' })
  if (error) throw error
}

export async function signInWithWhatsApp() {
  const { error } = await supabase.auth.signIn({ provider: 'whatsapp' })
  if (error) throw error
}