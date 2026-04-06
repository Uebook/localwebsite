import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        // IP-based fallback if no lat/lng provided or geocoding fails
        const getIpLocation = async () => {
            try {
                const ipRes = await fetch('https://ipapi.co/json/', { next: { revalidate: 3600 } });
                if (ipRes.ok) {
                    const ipData = await ipRes.json();
                    return {
                        city: ipData.city,
                        state: ipData.region,
                        displayLabel: `${ipData.city}, ${ipData.region}`
                    };
                }
            } catch (e) { /* ignore */ }
            return null;
        };

        if (!lat || !lng) {
            const ipLoc = await getIpLocation();
            if (ipLoc) return NextResponse.json({ success: true, ...ipLoc });
            return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
        }

        // 1. Reverse Geocode (Nominatim) with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        let addr = {};
        try {
            const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
            const geoRes = await fetch(geocodeUrl, {
                headers: { 'User-Agent': 'LocalMarketApp/1.0 (contact@localmarket.com)' },
                signal: controller.signal,
                next: { revalidate: 3600 }
            });
            clearTimeout(timeoutId);

            if (geoRes.ok) {
                const geoData = await geoRes.json();
                addr = geoData.address || {};
            }
        } catch (e: any) {
            console.error('Nominatim search failed or timed out:', e.name === 'AbortError' ? 'Timeout' : e.message);
            // If GPS geocoding fails, try IP as fallback
            const ipLoc = await getIpLocation();
            if (ipLoc) return NextResponse.json({ success: true, ...ipLoc });
        }

        // 2. Extract best names for matching
        const a: any = addr;
        const mainArea = a.village || a.hamlet || a.suburb || a.neighbourhood || a.subdistrict || '';
        const city = a.city || a.town || a.city_district || '';
        const state = a.state || '';

        // 3. Match against Market Circles (Parallel Optimized)
        let matchedCircle = null;
        const searchTerms = [mainArea, city, state].filter(Boolean);
        
        if (searchTerms.length > 0) {
            const encodedTerms = searchTerms.map(t => encodeURIComponent(t)).join(',');
            // One single query to check all possible matches
            const query = `/rest/v1/locations?select=circle&or=(city.in.(${encodedTerms}),town.in.(${encodedTerms}),circle.in.(${encodedTerms}))&limit=1`;
            const locs = await supabaseRestGet(query).catch(() => []);
            if (locs && locs.length > 0 && locs[0].circle) {
                matchedCircle = locs[0].circle;
            }
        }

        // 4. Construct response
        return NextResponse.json({
            success: true,
            displayLabel: matchedCircle || (mainArea && city ? `${mainArea}, ${city}` : mainArea || city || state || 'Your Location'),
            matchedCircle: matchedCircle,
            address: addr
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
