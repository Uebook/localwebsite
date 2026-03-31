import { NextResponse } from 'next/server';
import { supabaseRestGet } from '../../../lib/supabaseAdminFetch';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(Number(searchParams.get('limit') || 20), 100);

        // Fetch notifications for 'all' audiences and 'users'
        // We order by created_at to show the latest first
        const url = `/rest/v1/notifications?select=*&audience=in.("all","users")&order=created_at.desc&limit=${limit}`;
        
        const notifications = await supabaseRestGet(url);

        return NextResponse.json({
            notifications: Array.isArray(notifications) ? notifications : []
        });
    } catch (error: any) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
