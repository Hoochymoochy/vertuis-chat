// app/lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a singleton instance that properly handles cookies
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Optional: Export a function if you need fresh instances
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}