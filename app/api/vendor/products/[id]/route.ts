import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const body = await request.json();
        const { name, price, mrp, uom, categoryId, imageUrl, inStock, type, isBestSeller } = body;

        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
        }

        const productData = {
            name: name,
            price: price ? parseFloat(price) : undefined,
            mrp: mrp ? parseFloat(mrp) : null,
            uom: uom || null,
            category_id: categoryId || null,
            image_url: imageUrl || null,
            is_active: inStock !== undefined ? inStock : true,
            is_best_seller: isBestSeller !== undefined ? isBestSeller : undefined,
            type: type || undefined,
            updated_at: new Date().toISOString(),
        };

        const url = `${SUPABASE_URL}/rest/v1/vendor_products?id=eq.${id}`;
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
            },
            body: JSON.stringify(productData),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Update failed: ${text || res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json({ success: true, product: data[0] });
    } catch (error: any) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 });
        }

        const url = `${SUPABASE_URL}/rest/v1/vendor_products?id=eq.${id}`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
            },
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Delete failed: ${text || res.statusText}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
    }
}
