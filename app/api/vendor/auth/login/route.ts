import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

// POST /api/vendor/auth/login
export async function POST(request: NextRequest) {
    try {
        const { phone, email } = await request.json();

        if (!phone && !email) {
            return NextResponse.json({ error: 'Phone or email is required' }, { status: 400 });
        }

        let query = '/rest/v1/vendors?select=*&limit=1';
        if (phone) {
            let cleaned = phone.replace(/\D/g, '');
            // Handle common prefixes/formats
            if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
            if (cleaned.length === 12 && cleaned.startsWith('91')) {
                cleaned = cleaned.substring(2);
            }
            // If it's still 10 digits after basic cleaning, that's likely the core number.
            // But we will query for both versions (with and without 91) just in case.
            const queryValue = cleaned;
            query += `&contact_number=in.(${encodeURIComponent(queryValue)},91${encodeURIComponent(queryValue)})`;
        } else {
            query += `&email=eq.${encodeURIComponent(email.toLowerCase().trim())}`;
        }

        const results = await supabaseRestGet(query);
        if (!Array.isArray(results) || results.length === 0) {
            return NextResponse.json({ error: 'No vendor account found with that phone/email. Please register first.' }, { status: 404 });
        }

        const v = results[0];
        const status = (v.status ?? '').trim();
        if (status === 'Blocked') {
            return NextResponse.json({
                error: 'Your account has been blocked. Please contact support.'
            }, { status: 403 });
        }
        
        // Removed payment and subscription checks per user request to allow direct login.


        const vendor = {
            id: v.id,
            name: v.name ?? v.shop_name ?? '',
            ownerName: v.owner ?? v.owner_name ?? '',
            email: v.email ?? '',
            phone: v.contact_number ?? '',
            category: v.category ?? '',
            address: v.address ?? '',
            city: v.city ?? '',
            state: v.state ?? '',
            pincode: v.pincode ?? '',
            status: v.status ?? 'Pending',
            kycStatus: v.kyc_status ?? v.kycStatus ?? 'Pending',
            rating: v.rating ?? 0,
            reviewCount: v.review_count ?? v.reviewCount ?? 0,
            imageUrl: v.image_url ?? v.imageUrl ?? v.shop_front_photo_url ?? null,
        };

        return NextResponse.json({ vendor }, { status: 200 });
    } catch (error: any) {
        console.error('Vendor login error:', error);
        return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
    }
}
