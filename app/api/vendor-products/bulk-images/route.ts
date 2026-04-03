import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet, supabaseRestPatch, assertSupabaseEnv } from '@/lib/supabaseAdminFetch';

export async function POST(req: NextRequest) {
    try {
        assertSupabaseEnv();
        const formData = await req.formData();
        const vendorId = formData.get('vendorId') as string;
        const files = formData.getAll('files') as File[];

        if (!vendorId || !files.length) {
            return NextResponse.json({ error: 'Missing vendorId or files' }, { status: 400 });
        }

        // 1. Fetch vendor products to match by name
        const products = await supabaseRestGet(`/rest/v1/vendor_products?select=id,name&vendor_id=eq.${vendorId}`);
        const productMap = new Map(products.map((p: any) => [p.name.toLowerCase().trim(), p.id]));

        const results = [];
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        for (const file of files) {
            const fileNameWithExt = file.name;
            const lastDotIndex = fileNameWithExt.lastIndexOf('.');
            const productName = lastDotIndex !== -1 
                ? fileNameWithExt.substring(0, lastDotIndex).toLowerCase().trim()
                : fileNameWithExt.toLowerCase().trim();
            
            const productId = productMap.get(productName);

            if (!productId) {
                results.push({ fileName: fileNameWithExt, status: 'error', message: 'No matching product name found' });
                continue;
            }

            // 2. Upload to Supabase Storage
            const cleanFileName = `${Date.now()}-${fileNameWithExt.replace(/[^a-zA-Z0-9.]/g, '_')}`;
            const filePath = `products/${vendorId}/${cleanFileName}`;
            const bucket = 'vendor-documents'; // Known existing bucket
            const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
            
            const arrayBuffer = await file.arrayBuffer();
            const uploadRes = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'apikey': KEY!,
                    'Authorization': `Bearer ${KEY!}`,
                    'Content-Type': file.type,
                    'x-upsert': 'true'
                },
                body: arrayBuffer
            });

            if (!uploadRes.ok) {
                const err = await uploadRes.text();
                results.push({ fileName: fileNameWithExt, status: 'error', message: `Storage error: ${err}` });
                continue;
            }

            const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;

            // 3. Update Product in DB
            try {
                await supabaseRestPatch(`/rest/v1/vendor_products?id=eq.${productId}`, {
                    image_url: publicUrl,
                    updated_at: new Date().toISOString()
                });
                results.push({ fileName: fileNameWithExt, status: 'success', productName: productName, url: publicUrl });
            } catch (patchErr: any) {
                results.push({ fileName: fileNameWithExt, status: 'error', message: `DB Update failed: ${patchErr.message}` });
            }
        }

        return NextResponse.json({ 
            success: true, 
            processed: files.length,
            results 
        });

    } catch (error: any) {
        console.error('Bulk Image Upload Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
