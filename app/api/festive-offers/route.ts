import { NextResponse } from 'next/server';
import { supabaseRestGet, supabaseRestInsert, supabaseRestPatch } from '@/lib/supabaseAdminFetch';

// CORS headers helper
function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders() });
}

// GET /api/festive-offers - Get all active/active-only offers
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'active';
        const type = searchParams.get('type'); // 'vendor' or 'user'
        const circle = searchParams.get('circle');
        const vendorId = searchParams.get('vendorId');

        let query = `/rest/v1/festive_offers?select=*&order=created_at.desc`;

        if (status && status !== 'all') {
            query += `&status=eq.${status}`;
        }

        if (type) {
            query += `&type=eq.${type}`;
        }

        if (circle) {
            query += `&or=(circle.is.null,circle.eq.${circle})`;
        }

        if (vendorId) {
            query += `&vendor_ids=cs.{${vendorId}}`;
        }

        const offers = await supabaseRestGet(query);

        return NextResponse.json(offers, { headers: corsHeaders() });
    } catch (error: any) {
        console.error('Error fetching festive offers:', error);
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
    }
}

// POST /api/festive-offers - Create a new offer
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await supabaseRestInsert('/rest/v1/festive_offers', body);
        return NextResponse.json(Array.isArray(result) ? result[0] : result, {
            status: 201,
            headers: corsHeaders(),
        });
    } catch (error: any) {
        console.error('Error creating festive offer:', error);
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
    }
}

// PATCH /api/festive-offers - Update an offer
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400, headers: corsHeaders() });
        }
        const result = await supabaseRestPatch(`/rest/v1/festive_offers?id=eq.${id}`, updates);
        return NextResponse.json(Array.isArray(result) ? result[0] : result, {
            headers: corsHeaders(),
        });
    } catch (error: any) {
        console.error('Error updating festive offer:', error);
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
    }
}
