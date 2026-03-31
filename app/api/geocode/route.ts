import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (!lat || !lng) {
            return NextResponse.json(
                { error: 'Latitude and longitude are required' },
                { status: 400 }
            );
        }

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

        const response = await fetch(url, {
            headers: {
                // Nominatim requires a valid user agent
                'User-Agent': 'LocalMarketApp/1.0 (contact@localmarket.com)',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            next: { revalidate: 3600 } // Cache for an hour
        });

        if (!response.ok) {
            throw new Error(`Nominatim API returned ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Geocoding error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to reverse geocode coordinates' },
            { status: 500 }
        );
    }
}
