import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet, supabaseRestPatch } from '@/lib/supabaseAdminFetch';

// GET /api/vendor/profile?id=xxx  — fetch full vendor data + products + enquiries + reviews
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });

        // We catch errors per-request so a missing table (e.g., 'reviews') doesn't crash the whole page
        const [vendors, products, enquiries, reviews, offers] = await Promise.all([
            supabaseRestGet(`/rest/v1/vendors?id=eq.${id}&select=*&limit=1`),
            supabaseRestGet(`/rest/v1/vendor_products?vendor_id=eq.${id}&select=*,categories(name)&order=created_at.desc`).then(res => Array.isArray(res) ? res : []).catch(() => []),
            supabaseRestGet(`/rest/v1/enquiries?vendor_id=eq.${id}&select=*&order=created_at.desc`).then(res => Array.isArray(res) ? res : []).catch(() => []),
            supabaseRestGet(`/rest/v1/reviews?vendor_id=eq.${id}&select=*&order=created_at.desc`).then(res => Array.isArray(res) ? res : []).catch(() => []),
            supabaseRestGet(`/rest/v1/festive_offers?vendor_ids=cs.{${id}}&status=eq.active&order=created_at.desc`).then(res => Array.isArray(res) ? res : []).catch(() => []),
        ]);

        if (!Array.isArray(vendors) || vendors.length === 0) {
            return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        const v = vendors[0];
        return NextResponse.json({
            vendor: {
                id: v.id,
                name: v.name ?? v.shop_name ?? '',
                ownerName: v.owner_name ?? v.owner ?? '',
                email: v.email ?? '',
                phone: v.contact_number ?? '',
                category: v.category ?? '',
                address: v.address ?? '',
                city: v.city ?? '',
                state: v.state ?? '',
                pincode: v.pincode ?? '',
                status: v.status ?? 'Pending',
                kycStatus: v.kyc_status ?? 'Pending',
                activationStatus: v.status ?? 'Pending',
                rating: v.rating ?? 0,
                reviewCount: v.review_count ?? 0,
                productCount: v.product_count ?? (Array.isArray(products) ? products.length : 0),
                profileImageUrl: v.profile_image_url ?? v.profile_picture_url ?? null,
                imageUrl: v.image_url ?? v.shop_front_photo_url ?? null,
                shopFrontPhotoUrl: v.shop_front_photo_url ?? null,
                about: v.about ?? v.description ?? '',
                openTime: v.open_time ?? '',
                isVerified: v.is_verified ?? (v.kyc_status === 'Approved'),
                createdAt: v.created_at ?? '',
                profileViews: v.profile_views ?? 0,
                searchAppearances: v.search_appearances ?? 0,
            },
            products: Array.isArray(products) ? products.map((p: any) => ({
                ...p,
                category_name: p.categories?.name || p.category_name || ''
            })) : [],
            enquiries: Array.isArray(enquiries) ? enquiries : [],
            reviews: Array.isArray(reviews) ? reviews : [],
            offers: Array.isArray(offers) ? offers : [],
        });
    } catch (error: any) {
        console.error('Vendor profile error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/vendor/profile  — update vendor details
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });

        const allowed = ['name', 'owner_name', 'email', 'address', 'city', 'state', 'pincode', 'about', 'open_time', 'category'];
        const filtered: Record<string, any> = {};
        for (const key of allowed) {
            if (updates[key] !== undefined) filtered[key] = updates[key];
        }

        const result = await supabaseRestPatch(`/rest/v1/vendors?id=eq.${id}`, filtered);
        return NextResponse.json({ success: true, vendor: Array.isArray(result) ? result[0] : result });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
