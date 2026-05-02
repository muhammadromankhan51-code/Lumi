import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('scheduled_time', { ascending: true });

    if (error) throw error;

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Reminders fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reminderData = await request.json();

    const { data, error } = await supabase
      .from('reminders')
      .insert([{
        user_id: session.user.id,
        ...reminderData,
      }])
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Reminder creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    );
  }
}
