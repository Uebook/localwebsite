import { NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    // Default trending items if logs are empty
    const defaultTrending = [
      { label: 'Milk', icon: '🥛' },
      { label: 'Cooking Oil', icon: '🫙' },
      { label: 'Rice', icon: '🍚' },
      { label: 'Atta', icon: '🌾' },
      { label: 'Mobile Charger', icon: '🔌' },
      { label: 'Shampoo', icon: '🧴' },
      { label: 'Gas Stove', icon: '🔥' },
      { label: 'Soap', icon: '🧼' },
    ];

    // Build the query for search logs
    let url = '/rest/v1/search_logs?select=search_query&limit=500&order=searched_at.desc';
    if (city) {
      url += `&location_city=ilike.${encodeURIComponent('%' + city.trim() + '%')}`;
    }

    // Get search logs to find popular searches
    const searches = await supabaseRestGet(url).catch(() => []);
    
    const searchCounts: Record<string, number> = {};
    const icons: Record<string, string> = {
      'milk': '🥛',
      'oil': '🫙',
      'rice': '🍚',
      'atta': '🌾',
      'charger': '🔌',
      'shampoo': '🧴',
      'gas': '🔥',
      'soap': '🧼',
      'bread': '🍞',
      'eggs': '🥚',
      'vegetables': '🥦',
      'fruits': '🍎'
    };

    if (Array.isArray(searches) && searches.length > 0) {
      searches.forEach((s: any) => {
        const q = (s.search_query || '').toLowerCase().trim();
        if (q && q.length > 1) {
          searchCounts[q] = (searchCounts[q] || 0) + 1;
        }
      });
    }

    const sortedSearches = Object.entries(searchCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([query]) => {
        // Try to find a matching icon
        const iconKey = Object.keys(icons).find(k => query.includes(k)) || '🔍';
        return {
          label: query.charAt(0).toUpperCase() + query.slice(1),
          icon: icons[iconKey] || '🔍'
        };
      });

    return NextResponse.json({
      trending: sortedSearches.length > 0 ? sortedSearches : defaultTrending
    });
  } catch (error) {
    console.error('Error fetching trending searches:', error);
    // Always return defaults on error to prevent empty UI
    return NextResponse.json({ 
      trending: [
        { label: 'Milk', icon: '🥛' },
        { label: 'Cooking Oil', icon: '🫙' },
        { label: 'Rice', icon: '🍚' },
        { label: 'Atta', icon: '🌾' },
      ] 
    });
  }
}

