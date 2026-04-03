import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet, supabaseRestInsert } from '@/lib/supabaseAdminFetch';

// POST /api/vendor/auth/register
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { 
            businessName, ownerName, category, subCategory, mobile, email, 
            address, city, pincode, idProofUrl, businessPhotoUrl,
            latitude, longitude, circle 
        } = body;

        // Required fields
        if (!businessName?.trim()) return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
        if (!ownerName?.trim()) return NextResponse.json({ error: 'Owner name is required' }, { status: 400 });
        if (!category) return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        if (!mobile || mobile.replace(/\D/g, '').length < 10) {
            return NextResponse.json({ error: 'Valid 10-digit mobile number is required' }, { status: 400 });
        }

        const cleanPhone = mobile.replace(/\D/g, '');

        // Check for duplicate phone
        const existing = await supabaseRestGet(
            `/rest/v1/vendors?contact_number=eq.${cleanPhone}&select=id,name&limit=1`
        );
        if (Array.isArray(existing) && existing.length > 0) {
            return NextResponse.json({
                error: 'A vendor account already exists with this mobile number. Please login instead.'
            }, { status: 409 });
        }

        // Check duplicate email if provided
        if (email?.trim()) {
            const emailCheck = await supabaseRestGet(
                `/rest/v1/vendors?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&select=id&limit=1`
            );
            if (Array.isArray(emailCheck) && emailCheck.length > 0) {
                return NextResponse.json({ error: 'A vendor account already exists with this email.' }, { status: 409 });
            }
        }

        const generateDisplayId = () => {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let result = '';
            for (let i = 0; i < 5; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        const displayId = generateDisplayId();
        const finalCategory = category === 'Services' && subCategory ? subCategory : category;

        const vendor = {
            name: businessName.trim(),
            owner_name: ownerName.trim(),
            owner: ownerName.trim(),
            category: finalCategory,
            contact_number: cleanPhone,
            email: email?.trim().toLowerCase() || null,
            address: address?.trim() || null,
            city: city?.trim() || null,
            pincode: pincode?.trim() || null,
            status: 'Pending',
            kyc_status: 'Pending',
            product_count: 0,
            id_proof_url: idProofUrl || null,
            shop_front_photo_url: businessPhotoUrl || null,
            image_url: businessPhotoUrl || null,
            shop_proof_url: body.shopDocumentUrl || null, // Added for KYC
            display_id: displayId, // Added 5-character short ID
            state: body.state || null,
            town: body.area || body.town || null,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            circle: circle || null,
        };

        const result = await supabaseRestInsert('/rest/v1/vendors', vendor);
        const saved = Array.isArray(result) ? result[0] : result;

        const vendorSession = {
            id: saved?.id,
            name: saved?.name ?? businessName.trim(),
            ownerName: saved?.owner_name ?? ownerName.trim(),
            email: saved?.email ?? (email?.trim() || ''),
            phone: saved?.contact_number ?? cleanPhone,
            category: saved?.category ?? finalCategory,
            address: saved?.address ?? '',
            city: saved?.city ?? '',
            circle: saved?.circle ?? (circle || ''),
            status: 'Pending',
            kycStatus: 'Pending',
            rating: 0,
            reviewCount: 0,
            latitude: saved?.latitude || latitude,
            longitude: saved?.longitude || longitude,
        };

        return NextResponse.json({ vendor: vendorSession }, { status: 201 });
    } catch (error: any) {
        console.error('Vendor register error:', error);
        return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
    }
}
