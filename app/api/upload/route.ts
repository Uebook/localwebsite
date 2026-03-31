import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const bucket = formData.get('bucket') as string || 'vendor-documents';
        const folder = formData.get('folder') as string || 'uploads';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
        }

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `${folder}/${fileName}`;

        const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
        const arrayBuffer = await file.arrayBuffer();

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': file.type,
                'x-upsert': 'true'
            },
            body: arrayBuffer
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Supabase upload error:', error);
            // If bucket doesn't exist, this might fail. In a real app, we'd ensure bucket exists.
            throw new Error(`Upload failed: ${error}`);
        }

        // Construct the public URL (assuming the bucket is public)
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            path: filePath
        });

    } catch (error: any) {
        console.error('Upload API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
