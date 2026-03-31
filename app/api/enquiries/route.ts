import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestInsert } from '@/lib/supabaseAdminFetch';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { vendor_id, name, mobile, message } = body;

        if (!vendor_id || !name || !mobile || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: vendor_id, name, mobile, message' },
                { status: 400 }
            );
        }

        // Insert into Supabase enquiries table
        // Mapping frontend fields to DB fields if necessary
        const enquiryData = {
            vendor_id,
            sender_name: name,
            sender_phone: mobile,
            message,
            status: 'new',
            created_at: new Date().toISOString(),
        };

        const result = await supabaseRestInsert('/rest/v1/enquiries', enquiryData);

        return NextResponse.json({
            success: true,
            data: result[0],
        });
    } catch (error: any) {
        console.error('Enquiry submission error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
