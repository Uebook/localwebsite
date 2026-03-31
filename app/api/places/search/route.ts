import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyAonK15hotzDslX4ePjIbmizRii-7Ng4QE';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');

        if (!q || q.length < 2) {
            return NextResponse.json([]);
        }

        // Try Google Places API first
        try {
            const googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q)}&key=${GOOGLE_API_KEY}&region=in`;
            const googleRes = await fetch(googleUrl);
            
            if (googleRes.ok) {
                const googleData = await googleRes.json();
                if (googleData.status === 'OK' && googleData.results.length > 0) {
                    const results = googleData.results.map((item: any) => ({
                        display_name: item.formatted_address || item.name,
                        lat: item.geometry.location.lat.toString(),
                        lon: item.geometry.location.lng.toString(),
                        address: {
                            road: item.name,
                            suburb: '', // Google doesn't easily provide these in text search without more calls
                            city: '',
                            state: '',
                            postcode: '',
                        }
                    }));
                    return NextResponse.json(results);
                }
            }
        } catch (googleError) {
            console.error('Google Places API error:', googleError);
            // Fall back to Nominatim
        }

        // Fallback to Nominatim (OpenStreetMap)
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&addressdetails=1&limit=5`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'LocalMarketApp/1.0 (contact@localmarket.com)',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`Nominatim API returned ${response.status}`);
        }

        const data = await response.json();

        // Simplify the response for the frontend
        const results = data.map((item: any) => ({
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
            address: {
                road: item.address.road || '',
                suburb: item.address.suburb || item.address.neighbourhood || '',
                city: item.address.city || item.address.town || item.address.village || '',
                state: item.address.state || '',
                postcode: item.address.postcode || '',
            }
        }));

        return NextResponse.json(results);
    } catch (error: any) {
        console.error('Places search handle error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to search places' },
            { status: 500 }
        );
    }
}
