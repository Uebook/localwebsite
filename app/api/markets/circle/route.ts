import { NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const circleName = searchParams.get('circle');

        if (!circleName) {
            return NextResponse.json({ error: 'Circle name is required' }, { status: 400 });
        }

        // 1. Fetch unique markets (sub_tehsils or tehsils) for this circle
        // We'll prioritize sub_tehsil as the "Market" name.
        const query = `/rest/v1/locations?circle=eq.${encodeURIComponent(circleName)}&select=sub_tehsil,tehsil,city`;
        const locations = await supabaseRestGet(query).catch(() => []);

        if (!Array.isArray(locations)) {
            throw new Error('Failed to fetch markets for circle');
        }

        // 2. Fetch shop counts per market (sub_tehsil)
        const vendorQuery = `/rest/v1/vendors?circle=eq.${encodeURIComponent(circleName)}&select=sub_tehsil,status`;
        const vendors = await supabaseRestGet(vendorQuery).catch(() => []);
        
        const marketStats: Record<string, number> = {};
        vendors.forEach((v: any) => {
            if (v.sub_tehsil && v.status === 'Active') {
                marketStats[v.sub_tehsil] = (marketStats[v.sub_tehsil] || 0) + 1;
            }
        });

        // 3. Extract unique markets and attach stats
        const marketsMap: Record<string, any> = {};
        locations.forEach((loc: any) => {
            const name = loc.sub_tehsil || loc.tehsil;
            if (name && !marketsMap[name]) {
                marketsMap[name] = {
                    name,
                    shops: marketStats[name] || 0,
                    city: loc.city,
                    ...getMarketStyle(name)
                };
            }
        });

        const markets = Object.values(marketsMap);

        return NextResponse.json({ 
            success: true, 
            circle: circleName,
            markets 
        });
    } catch (error: any) {
        console.error('Markets in Circle API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getMarketStyle(name: string) {
    const marketStyles: Record<string, any> = {
        'Atta Market': { color: 'from-orange-500 to-amber-400', emoji: '🛍️' },
        'Sector 18': { color: 'from-blue-500 to-sky-400', emoji: '🏢' },
        'Jagat Farm': { color: 'from-red-500 to-orange-400', emoji: '🏘️' },
        'Pari Chowk': { color: 'from-teal-500 to-emerald-400', emoji: '🧚' },
    };

    return marketStyles[name] || {
        color: 'from-slate-500 to-slate-400',
        emoji: '🛒'
    };
}
