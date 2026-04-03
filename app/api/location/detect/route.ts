import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (!lat || !lng) {
            return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
        }

        // 1. Reverse Geocode (Nominatim)
        const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        const geoRes = await fetch(geocodeUrl, {
            headers: { 'User-Agent': 'LocalMarketApp/1.0 (contact@localmarket.com)' },
            next: { revalidate: 3600 }
        });

        if (!geoRes.ok) throw new Error('Geocoding service unavailable');
        const geoData = await geoRes.json();
        const addr = geoData.address || {};

        // 2. Extract best name for matching
        const mainArea = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.city || addr.town || '';
        const city = addr.city || addr.town || addr.city_district || '';
        const state = addr.state || '';

        // 3. Match against Market Circles (Optimized)
        let matchedCircle = null;
        const searchTerms = [mainArea, city, state].filter(Boolean);
        
        if (searchTerms.length > 0) {
            // Try matching each term until we find a circle
            for (const term of searchTerms) {
                const query = `/rest/v1/locations?select=circle&or=(city.eq.${encodeURIComponent(term)},town.eq.${encodeURIComponent(term)},circle.eq.${encodeURIComponent(term)})&limit=1`;
                const locs = await supabaseRestGet(query).catch(() => []);
                if (locs && locs.length > 0 && locs[0].circle) {
                    matchedCircle = locs[0].circle;
                    break;
                }
            }
        }

        // 4. Construct response
        return NextResponse.json({
            success: true,
            address: addr,
            displayLabel: matchedCircle || (mainArea && city ? `${mainArea}, ${city}` : mainArea || city || state || 'Unknown Area'),
            matchedCircle: matchedCircle
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        });

    } catch (err: any) {
        console.error('Location detection error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
