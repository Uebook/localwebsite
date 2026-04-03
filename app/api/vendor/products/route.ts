import { NextResponse } from 'next/server';
import { supabaseRestGet, supabaseRestInsert } from '@/lib/supabaseAdminFetch';

export async function GET() {
    try {
        // Fetch categories for the add product dropdown
        const categories = await supabaseRestGet('/rest/v1/categories?select=id,name&order=name.asc');
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            vendorId,
            name,
            price,
            onlinePrice,
            mrp,
            uom,
            categoryId,
            imageUrl,
            type,
            inStock,
            isBestSeller
        } = body;

        if (!vendorId || !name || !price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const productData = {
            vendor_id: vendorId,
            name: name,
            price: parseFloat(price),
            online_price: onlinePrice ? parseFloat(onlinePrice) : null,
            mrp: mrp ? parseFloat(mrp) : null,
            uom: uom || null,
            category_id: categoryId || null,
            image_url: imageUrl || null,
            description: body.description || null,
            is_active: inStock !== undefined ? inStock : true,
            // Note: best_seller/type might need additional columns if not in schema, 
            // but for now we follow the schema in ensure_vendor_products_table.sql
        };

        const result = await supabaseRestInsert('/rest/v1/vendor_products', productData);

        return NextResponse.json({ success: true, product: result });
    } catch (error) {
        console.error('Add product error:', error);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}
