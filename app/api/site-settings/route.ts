import { NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET() {
    try {
        const settings = await supabaseRestGet('/rest/v1/site_settings?id=eq.default&select=*');
        return NextResponse.json({ success: true, settings: settings[0] || {} });
    } catch (error: any) {
        console.error('Site Settings Website API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
