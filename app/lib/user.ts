'use client'
import { supabase } from '@/app/lib/supabaseClient'

const getUserId = (): string | null => {
  return localStorage.getItem('user_id')
}

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
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/' },
  })
  if (error) throw error

  const user = await supabase.auth.getUser()
  return user.data.user
}

export async function signInWithFacebook() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: { redirectTo: window.location.origin + '/' },
  })
  if (error) throw error

  const user = await supabase.auth.getUser()
  return user.data.user
}

export async function getLanguage() {
  const { data, error } = await supabase
    .from('user_data')
    .select('language')
    .eq('user_id', getUserId())
    .maybeSingle()

  if (error) {
    console.error('Error fetching language:', error)
    return 'en' // Default fallback
  }

  return data?.language || 'en'
}
export async function getCountry() {
  const { data, error } = await supabase
    .from('user_data')
    .select('country')
    .eq('user_id', getUserId())
    .maybeSingle()

  if (error) {
    console.error('Error fetching country:', error)
    return null
  }

  return data?.country || null
}

export async function getState() {
  const { data, error } = await supabase
    .from('user_data')
    .select('state')
    .eq('user_id', getUserId())
    .maybeSingle()

  if (error) {
    console.error('Error fetching state:', error)
    return null
  }

  return data?.state || null
}


export async function setLanguage(language: string) {
  const userId = getUserId()
  if (!userId) throw new Error('No user ID found')

  const { error } = await supabase
    .from('user_data')
    .upsert({ 
      user_id: userId, 
      language 
    }, {
      onConflict: 'user_id' // Specify the unique constraint column
    })

  if (error) {
    console.error('Error updating language:', error)
    throw error
  }
}

export async function setCountry(country: string) {
  const userId = getUserId()
  if (!userId) throw new Error('No user ID found')

  const { error } = await supabase
    .from('user_data')
    .upsert({ 
      user_id: userId, 
      country 
    }, {
      onConflict: 'user_id'
    })

  if (error) {
    console.error('Error updating country:', error)
    throw error
  }
}

export async function setState(state: string) {
  const userId = getUserId()
  if (!userId) throw new Error('No user ID found')

  const { error } = await supabase
    .from('user_data')
    .upsert({ 
      user_id: userId, 
      state 
    }, {
      onConflict: 'user_id'
    })

  if (error) {
    console.error('Error updating state:', error)
    throw error
  }
}