import { NextResponse } from 'next/server';
import { supabaseRestInsert } from '@/lib/supabaseAdminFetch';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { query, city, state, resultsCount, userId } = body;

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        await supabaseRestInsert('/rest/v1/search_logs', {
            search_query: query,
            location_city: city || null,
            location_state: state || null,
            results_count: resultsCount || 0,
            user_id: userId || null,
            searched_at: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Search track error:', error);
        return NextResponse.json({ error: 'Failed to track search' }, { status: 500 });
    }
}
