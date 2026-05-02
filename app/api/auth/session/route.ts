import { getCurrentSession } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getCurrentSession()
    return Response.json(session || { error: 'No session' })
  } catch (error) {
    return Response.json({ error: 'Failed to get session' }, { status: 500 })
  }
}
