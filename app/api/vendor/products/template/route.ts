import { NextResponse, NextRequest } from 'next/server';
import * as XLSX from 'xlsx';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const vendorId = searchParams.get('vendorId');

        if (!vendorId) {
            return NextResponse.json({ error: 'vendorId is required' }, { status: 400 });
        }

        // Fetch products for this vendor
        const query = new URLSearchParams();
        query.set('select', 'id,name,price,mrp,uom');
        query.set('vendor_id', `eq.${vendorId}`);
        query.set('order', 'name.asc');

        const products = await supabaseRestGet(`/rest/v1/vendor_products?${query.toString()}`);
        const data = Array.isArray(products) ? products : [];

        // Map to template format
        const templateRows = data.map((p: any) => ({
            'Vendor Product ID': p.id,
            'Product Name': p.name,
            'Current Price': p.price ?? '',
            'New Price': '',
            'MRP (optional)': p.mrp ?? '',
            'UOM': p.uom ?? '',
        }));

        // If no products, at least provide headers
        if (templateRows.length === 0) {
            templateRows.push({
                'Vendor Product ID': '',
                'Product Name': '',
                'Current Price': '',
                'New Price': '',
                'MRP (optional)': '',
                'UOM': '',
            });
        }

        // Create Excel workbook
        const ws = XLSX.utils.json_to_sheet(templateRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Bulk Price Update');

        // Write to buffer
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        return new Response(buf, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="bulk_price_update_${vendorId}.xlsx"`,
            },
        });
    } catch (error: any) {
        console.error('Template API error:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate template' }, { status: 500 });
    }
}
