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
        if (status !== 'Active') {
            if (status === 'Blocked') {
                return NextResponse.json({
                    error: 'Your account has been blocked. Please contact support.'
                }, { status: 403 });
            }
            // Pending, Inactive, etc.
            return NextResponse.json({
                error: 'Your account is pending admin approval or awaiting payment completion.',
                status,
                needs_payment: true,
                vendorId: v.id
            }, { status: 403 });
        }

        // --- Subscription Expiry Check for Active Vendors ---
        if (status === 'Active') {
            const billingRes = await supabaseRestGet(`/rest/v1/vendor_billing?vendor_id=eq.${v.id}&order=created_at.desc&limit=1`);
            if (Array.isArray(billingRes) && billingRes.length > 0) {
                const latestBilling = billingRes[0];
                const dueDateStr = latestBilling.due_date; // e.g. '2024-04-20'
                if (dueDateStr) {
                    const dueDate = new Date(dueDateStr);
                    const today = new Date();
                    dueDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    if (dueDate < today) {
                        return NextResponse.json({
                            error: 'Your subscription has expired. Please renew to continue.',
                            needs_payment: true,
                            vendorId: v.id,
                        }, { status: 403 });
                    }
                }
            } else {
                 return NextResponse.json({
                     error: 'No active subscription found. Please complete your payment.',
                     needs_payment: true,
                     vendorId: v.id,
                 }, { status: 403 });
            }
        }


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
