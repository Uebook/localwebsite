import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

// GET /api/themes - Get active theme (for website to check global default)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    let query = '/rest/v1/festival_themes?select=*&order=is_default.desc,created_at.desc';
    if (activeOnly) {
      query += '&is_active=eq.true';
    }

    const themes = await supabaseRestGet(query);

    // Ensure we return an array
    if (!Array.isArray(themes)) {
      return NextResponse.json([]);
    }

    return NextResponse.json(themes);
  } catch (error: any) {
    console.error('Error fetching themes:', error);
    // Return empty array if table doesn't exist
    if (error.message && (error.message.includes('does not exist') || error.message.includes('relation') || error.message.includes('42703'))) {
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
