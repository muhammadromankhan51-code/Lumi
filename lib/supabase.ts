import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Legacy client for backward compatibility
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Re-export for backward compatibility
export { createSupabaseClient as createClient }

// Get current session
export async function getCurrentSession() {
  const supabase = createBrowserClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Get current user
export async function getCurrentUser() {
  const supabase = createBrowserClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user ?? null
}

// Sign up with email/password
export async function signUpWithEmail(email: string, password: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    },
  })
  return { data, error }
}

// Sign in with email/password
export async function signInWithEmail(email: string, password: string) {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Sign in with Google
export async function signInWithGoogle() {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

// Sign in with Microsoft (Azure)
export async function signInWithMicrosoft() {
  const supabase = createBrowserClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      redirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${window.location.origin}/auth/callback`,
      scopes: 'email profile openid',
    },
  })
  return { data, error }
}

// Sign out
export async function signOut() {
  const supabase = createBrowserClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Create user profile
export async function createUserProfile(userId: string, data: any) {
  const { error } = await supabase
    .from('users')
    .insert([{ id: userId, ...data }])
  return { error }
}

// Get user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

// Update user profile
export async function updateUserProfile(userId: string, data: any) {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', userId)
  return { error }
}
