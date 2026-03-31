import { NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const category = searchParams.get('category') || '';

        if (!city) {
            return NextResponse.json({ error: 'City is required' }, { status: 400 });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Try city-specific trending
        let query = `/rest/v1/search_logs?location_city=ilike.${city}&searched_at=gte.${thirtyDaysAgo.toISOString()}&select=search_query`;
        let logs = await supabaseRestGet(query);

        // 2. Fallback to state-wide or general trending if city is empty
        if (logs.length < 3) {
            query = `/rest/v1/search_logs?searched_at=gte.${thirtyDaysAgo.toISOString()}&select=search_query&limit=100`;
            logs = await supabaseRestGet(query);
        }

        // Group and count
        const counts: Record<string, number> = {};
        logs.forEach((log: any) => {
            const q = log.search_query?.toLowerCase().trim();
            if (q) {
                counts[q] = (counts[q] || 0) + 1;
            }
        });

        const trending = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([query, count]) => ({ query, count }));

        // 3. Generate Auto Recommendations based on trending and vendor category
        const recommendations = [];
        
        if (trending.length > 0) {
            // Recommendation based on top trending item
            const topTrend = trending[0].query;
            recommendations.push({
                type: 'product',
                title: `Highlight ${topTrend.charAt(0).toUpperCase() + topTrend.slice(1)}`,
                description: `Many customers in your area are searching for "${topTrend}". Consider adding or highlighting related products.`,
                priority: 'high',
                icon: 'Package'
            });
        }

        // Add some behavior-based recommendations if no specific data
        recommendations.push({
            type: 'pricing',
            title: 'Competitive Price Check',
            description: 'Based on current market trends, reviewing your prices for top items could increase conversion by 15%.',
            priority: 'medium',
            icon: 'DollarSign'
        });

        if (category) {
            recommendations.push({
                type: 'visibility',
                title: `${category} Specialists`,
                description: `You are in high demand! Completing your profile with more ${category} keywords will improve your local ranking.`,
                priority: 'high',
                icon: 'Target'
            });
        }

        return NextResponse.json({ 
            trending, 
            recommendations,
            meta: {
                scope: logs.length > 0 ? (logs[0].location_city ? 'local' : 'general') : 'none',
                totalLogsProcessed: logs.length
            }
        });
    } catch (error) {
        console.error('Trending fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch trending searches' }, { status: 500 });
    }
}

