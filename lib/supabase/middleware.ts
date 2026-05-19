import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
 let supabaseResponse = NextResponse.next({
 request,
 })

 // Check if environment variables are set
 const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
 const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

 // If env vars are missing, skip auth checks and return early
 if (!supabaseUrl || !supabaseAnonKey) {
 console.warn('[Middleware] Missing Supabase environment variables')
 return supabaseResponse
 }

 try {
 const supabase = createServerClient(
 supabaseUrl,
 supabaseAnonKey,
 {
 cookies: {
 getAll() {
 return request.cookies.getAll()
 },
 setAll(cookiesToSet) {
 cookiesToSet.forEach(({ name, value }) =>
 request.cookies.set(name, value),
 )
 supabaseResponse = NextResponse.next({
 request,
 })
 cookiesToSet.forEach(({ name, value, options }) =>
 supabaseResponse.cookies.set(name, value, options),
 )
 },
 },
 },
 )

 // Add timeout protection: 5 second timeout for auth check
 const userPromise = supabase.auth.getUser()
 const timeoutPromise = new Promise((_, reject) =>
 setTimeout(() => reject(new Error('Auth check timeout')), 5000),
 )

 const {
 data: { user },
 } = await Promise.race([userPromise, timeoutPromise])

 // Protect dashboard routes
 if (
 request.nextUrl.pathname.startsWith('/dashboard') &&
 !user
 ) {
 const url = request.nextUrl.clone()
 url.pathname = '/auth/signin'
 return NextResponse.redirect(url)
 }
 } catch (error) {
 // Log error but don't crash - allow request to proceed
 console.error('[Middleware] Auth check failed:', error instanceof Error ? error.message : String(error))
 
 // Still protect dashboard routes if auth check failed
 if (request.nextUrl.pathname.startsWith('/dashboard')) {
 const url = request.nextUrl.clone()
 url.pathname = '/auth/signin'
 return NextResponse.redirect(url)
 }
 }

 return supabaseResponse
}
