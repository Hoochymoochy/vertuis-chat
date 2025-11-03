'use client'
import { supabase } from '@/app/lib/supabaseClient'

// Sign up a user + seed user_data
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) throw error
  const user = data.user
  if (!user) return data

  // 🪄 Auto-seed user_data row if it doesn’t exist
  const { error: insertError } = await supabase
    .from('user_data')
    .upsert(
      {
        user_id: user.id,
        country: 'World',
        state: 'N/A',
        language: 'en',
      },
      { onConflict: 'user_id' }
    )

  if (insertError) {
    console.error('Error seeding user_data:', insertError)
  }

  return {
    id: user.id,
    email: user.email,
    session: data.session,
    user,
  }
}

// Sign in a user
export async function signIn(email: string, password: string) {
  console.log('Attempting login for:', email)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  console.log('Login response:', { data, error })
  if (error) throw error
  return { id: data.user?.id, email: data.user?.email, session: data.session, user: data.user }
}

// Send password reset email
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

// Update password
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return data
}

// Get current user
export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return { id: data.user?.id, email: data.user?.email }
}

// OAuth sign-ins
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
  if (error) throw error
  const user = await supabase.auth.getUser()
  return user.data.user
}

export async function signInWithFacebook() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: { redirectTo: `${window.location.origin}/` },
  })
  if (error) throw error
  const user = await supabase.auth.getUser()
  return user.data.user
}

// --- Fetchers --- //
export async function getCountry(userId: string) {
  const { data, error } = await supabase
    .from('user_data')
    .select('country')
    .eq('user_id', userId)
    .maybeSingle() // <- prevents 406
  if (error) throw error
  return data?.country
}

export async function getState(userId: string) {
  const { data, error } = await supabase
    .from('user_data')
    .select('state')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.state
}

export async function getLanguage(userId: string) {
  const { data, error } = await supabase
    .from('user_data')
    .select('language')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw error
  return data?.language
}

// --- Setters --- //
export async function setLanguage(userId: string, language: string) {
  if (!userId) throw new Error('No user ID found')
  const { error } = await supabase
    .from('user_data')
    .upsert({ user_id: userId, language }, { onConflict: 'user_id' })
  if (error) throw error
}

export async function setCountry(userId: string, country: string) {
  if (!userId) throw new Error('No user ID found')
  const { error } = await supabase
    .from('user_data')
    .upsert({ user_id: userId, country }, { onConflict: 'user_id' })
  if (error) throw error
}

export async function setState(userId: string, state: string) {
  if (!userId) throw new Error('No user ID found')
  const { error } = await supabase
    .from('user_data')
    .upsert({ user_id: userId, state }, { onConflict: 'user_id' })
  if (error) throw error
}
