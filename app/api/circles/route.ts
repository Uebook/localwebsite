import { NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const cityParamRaw = searchParams.get('city') || '';
        const cityParam = cityParamRaw.split(',')[0].trim();
        const isAllPrefix = cityParam.startsWith('All ');
        let areaName = isAllPrefix ? cityParam.replace('All ', '').trim() : cityParam.trim();

        // ─── ENHANCE MATCHING: Strip common suffixes (City, Town, Tehsil) for broader matching ───
        const baseAreaName = areaName.replace(/\s+(City|Town|Tehsil|Sub-Tehsil)$/i, '').trim();

        let query = '/rest/v1/locations?select=city,state,town,circle,market_icon';
        let locations: any[] = [];

        if (areaName) {
            if (isAllPrefix) {
                // Hierarchical aggregation (All in State, City, Town, or Tehsil)
                // We try matching multiple levels to find relevant circles
                const searchFilters = [
                    `state=ilike.${encodeURIComponent('%' + areaName + '%')}`,
                    `city=ilike.${encodeURIComponent('%' + areaName + '%')}`,
                    `town=ilike.${encodeURIComponent('%' + areaName + '%')}`,
                    `tehsil=ilike.${encodeURIComponent('%' + areaName + '%')}`,
                    // Also try matching the base name (e.g. "Amritsar") for all columns
                    `city=ilike.${encodeURIComponent('%' + baseAreaName + '%')}`,
                    `town=ilike.${encodeURIComponent('%' + baseAreaName + '%')}`
                ];

                for (const filter of searchFilters) {
                    const levelQuery = `${query}&${filter}`;
                    const currentLocs = await supabaseRestGet(levelQuery).catch(() => []);
                    if (currentLocs && Array.isArray(currentLocs) && currentLocs.length > 0) {
                        locations = [...locations, ...currentLocs];
                    }
                }
            } else {
                // Specific selection (City or Circle)
                // 1. Try matching by city, town, or state
                const areaFilters = [
                    `city=eq.${encodeURIComponent(areaName)}`,
                    `town=eq.${encodeURIComponent(areaName)}`,
                    `state=eq.${encodeURIComponent(areaName)}`
                ];

                for (const filter of areaFilters) {
                    const levelQuery = `${query}&${filter}`;
                    const currentLocs = await supabaseRestGet(levelQuery).catch(() => []);
                    if (currentLocs && currentLocs.length > 0) {
                        locations = [...locations, ...currentLocs];
                    }
                }

                // 2. If nothing found, try matching by partial city or town (ilike)
                if (locations.length === 0) {
                    const ilikeFilters = [
                        `city=ilike.${encodeURIComponent('%' + areaName + '%')}`,
                        `town=ilike.${encodeURIComponent('%' + areaName + '%')}`
                    ];
                    for (const filter of ilikeFilters) {
                        const ilikeQuery = `${query}&${filter}`;
                        const currentLocs = await supabaseRestGet(ilikeQuery).catch(() => []);
                        if (currentLocs && currentLocs.length > 0) {
                            locations = [...locations, ...currentLocs];
                        }
                    }
                }

                // 3. If still nothing found, it might be a circle name or a partial circle name
                if (locations.length === 0) {
                    const circleMatchQuery = `${query}&or=(circle.eq.${encodeURIComponent(areaName)},circle.ilike.${encodeURIComponent('%' + areaName + '%')})&limit=1`;
                    const circleMatch = await supabaseRestGet(circleMatchQuery).catch(() => []);
                    if (circleMatch && circleMatch.length > 0) {
                        const parentCity = circleMatch[0].city;
                        locations = await supabaseRestGet(`${query}&city=eq.${encodeURIComponent(parentCity)}`).catch(() => []);
                    }
                }
            }
        }

        if (!Array.isArray(locations)) {
            throw new Error('Failed to fetch locations');
        }

        // 2. Fetch vendor counts per circle to show "X shops"
        const vendors = await supabaseRestGet('/rest/v1/vendors?select=circle,status').catch(() => []);
        const circleStats: Record<string, { shops: number; city: string; icon: string | null }> = {};

        vendors.forEach((v: any) => {
            if (v.circle && v.status === 'Active') {
                if (!circleStats[v.circle]) {
                    circleStats[v.circle] = { shops: 0, city: '', icon: null };
                }
                circleStats[v.circle].shops++;
            }
        });

        // 3. Fetch Market Comparison Stats (for % lower price display)
        const comparisonStats = await supabaseRestGet('/rest/v1/market_comparison_stats?select=*').catch(() => []);
        const savingsMap: Record<string, number> = {};
        const countMap: Record<string, number> = {};
        if (Array.isArray(comparisonStats)) {
            comparisonStats.forEach((s: any) => {
                if (s.circle) {
                    savingsMap[s.circle] = s.lower_price_pct;
                    countMap[s.circle] = s.common_products_count;
                }
            });
        }

        // 4. Map metadata from locations to circles
        const circlesMap: Record<string, any> = {};
        locations.forEach((loc: any) => {
            if (loc.circle) {
                if (!circlesMap[loc.circle]) {
                    circlesMap[loc.circle] = {
                        name: loc.circle,
                        city: loc.city,
                        town: loc.town || loc.city,
                        shops: circleStats[loc.circle]?.shops || 0,
                        lower_price_pct: savingsMap[loc.circle] || 0,
                        common_products_count: countMap[loc.circle] || 0,
                        icon: loc.market_icon || null,
                        ...getCircleStyle(loc.circle)
                    };
                }
            }
        });

        const circles = Object.values(circlesMap);

        return NextResponse.json({ success: true, circles });
    } catch (error: any) {
        console.error('Circles API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getCircleStyle(name: string) {
    // Reusing the style logic for consistency
    const styles: Record<string, any> = {
        'Noida Circle': { color: 'from-orange-500 to-amber-400', emoji: '🏢' },
        'Greater Noida Circle': { color: 'from-blue-500 to-sky-400', emoji: '🏙️' },
        'Amritsar Circle': { color: 'from-red-500 to-rose-400', emoji: '🏛️' },
        'Golden Temple': { color: 'from-amber-400 to-yellow-600', emoji: '🕌' },
        'Lawrence Road': { color: 'from-indigo-500 to-blue-600', emoji: '🛍️' },
        'Ranjit Avenue': { color: 'from-emerald-500 to-teal-600', emoji: '🏙️' },
    };

    return styles[name] || {
        color: 'from-slate-500 to-slate-400',
        emoji: '📍'
    };
}
