import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet, supabaseRestPatch } from '@/lib/supabaseAdminFetch';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const rows = await supabaseRestGet(`/rest/v1/users?id=eq.${encodeURIComponent(id)}&select=*&limit=1`);

        if (!Array.isArray(rows) || rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = rows[0];
        return NextResponse.json({
            user: {
                id: user.id,
                name: user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                state: user.state || '',
                city: user.city || '',
                status: user.status || 'Active',
                createdAt: user.created_at,
            }
        });
    } catch (error: any) {
        console.error('Profile GET error:', error);
        if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
            return NextResponse.json({ error: 'Database unreachable.' }, { status: 503 });
        }
        return NextResponse.json({ error: 'Failed to fetch profile.' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, name, email, phone, state, city } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const patch: any = {};
        if (name !== undefined) patch.full_name = name.trim();
        if (email !== undefined) patch.email = email.trim().toLowerCase() || null;
        if (phone !== undefined) patch.phone = phone.trim();
        if (state !== undefined) patch.state = state.trim() || null;
        if (city !== undefined) patch.city = city.trim() || null;

        const updated = await supabaseRestPatch(
            `/rest/v1/users?id=eq.${encodeURIComponent(id)}`,
            patch
        );

        const user = Array.isArray(updated) && updated[0] ? updated[0] : null;
        return NextResponse.json({
            user: user ? {
                id: user.id,
                name: user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                state: user.state || '',
                city: user.city || '',
                status: user.status || 'Active',
                createdAt: user.created_at,
            } : null
        });
    } catch (error: any) {
        console.error('Profile PATCH error:', error);
        if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
            return NextResponse.json({ error: 'Database unreachable.' }, { status: 503 });
        }
        return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
    }
}
