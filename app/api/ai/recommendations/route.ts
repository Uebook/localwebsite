import { NextResponse } from 'next/server';
import { supabaseRestGet, supabaseRestUpsert } from '@/lib/supabaseAdminFetch';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');


// CORS headers helper
function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders() });
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10; // Round to 1 decimal
}

// Calculate AI relevance score
function calculateRelevanceScore(
    vendor: any,
    distance: number,
    context: any
): number {
    let score = 0;

    // Distance (30%) - closer is better
    const distanceScore = Math.max(0, 100 - (distance * 10)); // Decrease score by 10 per km
    score += distanceScore * 0.3;

    // Rating (30%) - higher is better
    const ratingScore = (vendor.rating || 0) * 20; // Convert 5-star to 100 scale
    score += ratingScore * 0.3;

    // Availability (20%) - available now gets full score
    const availabilityScore = vendor.is_available ? 100 : 50;
    score += availabilityScore * 0.2;

    // Price Match (20%) - match budget preference
    let priceScore = 50; // Default
    if (context.budget) {
        const vendorPrice = vendor.price_range || 'medium';
        if (vendorPrice === context.budget) {
            priceScore = 100;
        } else if (
            (context.budget === 'low' && vendorPrice === 'medium') ||
            (context.budget === 'high' && vendorPrice === 'medium')
        ) {
            priceScore = 75;
        }
    }
    score += priceScore * 0.2;

    return Math.round(score);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { context, location } = body;

        // Default location (Delhi) if not provided
        const userLat = location?.lat || 28.6139;
        const userLng = location?.lng || 77.2090;

        // Extract intent for category filtering
        const intent = context?.intent?.toLowerCase() || '';
        const urgency = context?.urgency?.toLowerCase() || '';
        const budget = context?.budget?.toLowerCase() || 'any';
        const historyStr = (context.history || []).map((h: any) => `${h.role}: ${h.content}`).join('\n');

        const prompt = `
        Conversation History:
        ${historyStr}
        
        Task: Based on the conversation above, extract the single most relevant search keyword or category (e.g., "plumber", "medical", "iphone repair", "grocery") to find vendors in a database.
        
        Rules:
        1. Return ONLY the keyword.
        2. Combine terms if necessary (e.g., "laptop repair").
        3. FIX TYPOS.
        
        Return ONLY the keyword.
        `;

        let searchKeyword = 'general';
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });
        try {
            const result = await model.generateContent(prompt);
            const rawText = result.response.text();
            searchKeyword = rawText.trim().replace(/['"]/g, '').toLowerCase();
            console.log('AI Refined Keyword:', searchKeyword);
        } catch (e) {
            console.error('Gemini extraction failed:', e);
            searchKeyword = context.intent || 'general';
        }

        // 2. Validate Keyword
        if (searchKeyword === 'invalid_query') {
            return NextResponse.json({
                vendors: [],
                message: "I'm your Local Market assistant! I can only help you find local vendors and services. Please search for things like home services, food, repairs, or shopping.",
                meta: { filterUsed: 'invalid_query' }
            }, { headers: corsHeaders() });
        }

        // Build Supabase query
        let query = '/rest/v1/vendors?select=*';

        // Filter by category/service type based on intent
        if (intent.includes('plumb')) {
            query += '&category=ilike.*Plumbing*';
        } else if (intent.includes('electric')) {
            query += '&category=ilike.*Electrical*';
        } else if (intent.includes('repair') || intent.includes('electronic')) {
            query += '&category=ilike.*Electronics Repair*';
        } else if (intent.includes('food') || intent.includes('restaurant') || intent.includes('snack') || intent.includes('hungry') || intent.includes('craving')) {
            // Include restaurants, snacks, bakery, beverages
            query += '&or=(category.ilike.*Food*,category.ilike.*Restaurant*,category.ilike.*Snacks*,category.ilike.*Bakery*,category.ilike.*Beverages*)';
        } else if (intent.includes('clean')) {
            query += '&category=ilike.*Cleaning*';
        } else if (intent.includes('grocery') || intent.includes('shop') || intent.includes('groceries') || intent.includes('buy') || intent.includes('milk') || intent.includes('fruit')) {
            // Broad grocery mapping
            query += '&or=(category.ilike.*Grocery*,category.ilike.*General Store*,category.ilike.*Dairy*,category.ilike.*Fruits*,category.ilike.*Vegetables*,category.ilike.*Spices*)';
        } else if (intent.includes('medical') || intent.includes('pharmacy') || intent.includes('doctor') || intent.includes('medicine') || intent.includes('mediacl') || intent.includes('health')) {
            query += '&category=ilike.*Health*';
        } else if (intent.includes('hair') || intent.includes('salon') || intent.includes('barber') || intent.includes('beauty') || intent.includes('makeup') || intent.includes('spa')) {
            // Mapping for beauty and grooming services
            query += '&or=(category.ilike.*Beauty*,category.ilike.*Salon*,category.ilike.*Barber*,category.ilike.*Spa*)';
        } else {
            // Fallback: If no specific category mapping, search by name or category using the keyword
            query += `&or=(name.ilike.*${intent}*,category.ilike.*${intent}*)`;
        }



        // Filter by active status
        query += '&status=ilike.*Active*';

        // Fetch vendors from Supabase
        let vendors: any[] = [];
        try {
            vendors = await supabaseRestGet(query);
        } catch (error) {
            console.error('Supabase query error:', error);
            // No results for specific query
            vendors = [];
        }

        // Async log search for analytics/learning
        try {
            await supabaseRestUpsert('/rest/v1/search_logs', [{
                search_query: intent,
                results_count: vendors.length,
                location_state: context.state || null,
                location_city: context.city || null,
                searched_at: new Date().toISOString()
            }]);
        } catch (logError) {
            console.warn('Failed to log search:', logError);
        }

        // Check if we found anything for the specific intent
        if (vendors.length === 0 && intent.length > 0) {
            return NextResponse.json({
                vendors: [],
                message: `I couldn't find any vendors matching "${intent}" nearby right now. Would you like to try searching for something else?`,
                meta: {
                    total: 0,
                    filterUsed: intent,
                    location: { lat: userLat, lng: userLng }
                }
            }, { headers: corsHeaders() });
        }

        // Calculate distance and relevance score for each vendor
        const vendorsWithScores = vendors.map((vendor) => {
            const distance = calculateDistance(
                userLat,
                userLng,
                vendor.latitude || userLat,
                vendor.longitude || userLng
            );

            const relevanceScore = calculateRelevanceScore(vendor, distance, context);

            // Calculate ETA based on distance
            let eta = 'Schedule';
            if (distance < 2) {
                eta = '20-30 mins';
            } else if (distance < 5) {
                eta = '45 mins - 1 hour';
            } else if (distance < 10) {
                eta = '1-2 hours';
            }

            return {
                id: vendor.id,
                name: vendor.name || vendor.business_name || 'Vendor',
                service: vendor.category || 'Service',
                price: vendor.price_display || `₹${vendor.min_price || 500} min`,
                rating: vendor.rating || 4.5,
                distance: `${distance} km`,
                eta: eta,
                isTopMatch: false,
                bgImage: vendor.image_url || 'https://images.unsplash.com/photo-1581578731117-104f2a412727?w=500&auto=format&fit=crop&q=60',
                explanation: '',
                relevanceScore,
                actualDistance: distance
            };
        });

        // Sort by relevance score
        vendorsWithScores.sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Mark top match
        if (vendorsWithScores.length > 0) {
            vendorsWithScores[0].isTopMatch = true;
            vendorsWithScores[0].explanation = `Best match: ${vendorsWithScores[0].distance} away, ${vendorsWithScores[0].rating}★ rated`;
        }

        // Limit to top 10 results
        const topVendors = vendorsWithScores.slice(0, 10);


        return NextResponse.json({
            vendors: topVendors,
            meta: {
                total: topVendors.length,
                filterUsed: intent,
                location: { lat: userLat, lng: userLng }
            }
        });


    } catch (error) {
        console.error('Recommendations error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recommendations', vendors: getMockVendors() },
            { status: 500 }
        );
    }
}

// Fallback mock data
function getMockVendors() {
    return [
        {
            id: 'v1',
            name: 'QuickFix Plumbers',
            service: 'Plumbing & Repair',
            price: '₹500 min',
            rating: 4.8,
            distance: '1.2 km',
            eta: '30 mins',
            isTopMatch: true,
            bgImage: 'https://images.unsplash.com/photo-1585675409540-1b6c7a7fe6d2?w=500&auto=format&fit=crop&q=60',
            explanation: 'Best rated for emergency repairs nearby.',
            relevanceScore: 95,
            actualDistance: 1.2
        },
        {
            id: 'v2',
            name: 'Sharma Electronics',
            service: 'Mobile & Laptop',
            price: '₹300 min',
            rating: 4.5,
            distance: '2.5 km',
            eta: '1 hour',
            isTopMatch: false,
            bgImage: 'https://images.unsplash.com/photo-1591123720164-de1348028a82?w=500&auto=format&fit=crop&q=60',
            explanation: 'Very affordable and available today.',
            relevanceScore: 82,
            actualDistance: 2.5
        },
        {
            id: 'v3',
            name: 'HomeCare Pro',
            service: 'Cleaning & Maintenance',
            price: '₹800',
            rating: 4.9,
            distance: '3.0 km',
            eta: 'Schedule',
            isTopMatch: false,
            bgImage: 'https://images.unsplash.com/photo-1581578731117-104f2a412727?w=500&auto=format&fit=crop&q=60',
            explanation: 'Premium service with verified professionals.',
            relevanceScore: 78,
            actualDistance: 3.0
        }
    ];
}
