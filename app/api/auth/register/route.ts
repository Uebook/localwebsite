import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet, supabaseRestUpsert } from '@/lib/supabaseAdminFetch';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, phone, email } = body;

        if (!name?.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Database has phone as NULLABLE (requires manual SQL change). 
        // We now allow registration if EITHER phone OR email is provided.
        if (!phone?.trim() && !email?.trim()) {
            return NextResponse.json({
                error: 'Please provide either a mobile number or an email address to register.'
            }, { status: 400 });
        }

        // Additional validation if phone is provided
        if (phone?.trim() && phone.trim().length < 10) {
            return NextResponse.json({ error: 'Please provide a valid 10-digit mobile number.' }, { status: 400 });
        }

        // Additional validation if email is provided
        if (email?.trim() && !email.includes('@')) {
            return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
        }

        // Check if phone already exists (only if provided)
        if (phone?.trim()) {
            const existingPhone = await supabaseRestGet(
                `/rest/v1/users?phone=eq.${encodeURIComponent(phone.trim())}&select=id&limit=1`
            );
            if (Array.isArray(existingPhone) && existingPhone.length > 0) {
                return NextResponse.json({ error: 'An account with this phone number already exists. Please login.' }, { status: 409 });
            }
        }

        // Check if email already exists (only if provided)
        if (email?.trim()) {
            const existingEmail = await supabaseRestGet(
                `/rest/v1/users?email=eq.${encodeURIComponent(email.trim().toLowerCase())}&select=id&limit=1`
            );
            if (Array.isArray(existingEmail) && existingEmail.length > 0) {
                return NextResponse.json({ error: 'An account with this email already exists. Please login.' }, { status: 409 });
            }
        }

        const newUser: any = {
            full_name: name.trim(),
            status: 'Active'
        };
        
        if (phone?.trim()) newUser.phone = phone.trim();
        if (email?.trim()) newUser.email = email.trim().toLowerCase();

        const result = await supabaseRestUpsert('/rest/v1/users', [newUser]);

        if (!Array.isArray(result) || result.length === 0) {
            return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
        }

        const user = result[0];

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
                state: user.state || '',
                city: user.city || '',
                status: user.status || 'Active',
                createdAt: user.created_at,
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Register error:', error);
        if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
            return NextResponse.json({ error: 'Database unreachable. Please try again later.' }, { status: 503 });
        }
        return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
    }
}
