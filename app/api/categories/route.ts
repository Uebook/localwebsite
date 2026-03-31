import { supabaseRestGet } from '@/lib/supabaseAdminFetch';
import { ALL_CATEGORIES } from '@/lib/categories';

export async function GET() {
    try {
        const query = new URLSearchParams();
        query.set('select', '*');
        query.set('order', 'priority.asc');
        query.set('visible', 'eq.true');

        const rows = await supabaseRestGet(`/rest/v1/categories?${query.toString()}`);
        const categories = Array.isArray(rows) ? rows.map((c: any) => {
            const dName = c.name.toLowerCase();
            const dNameClean = dName.replace(/[^a-z0-9]/g, '');

            // 1. Try Exact/Contains match first
            let staticCat = ALL_CATEGORIES.find(sc => {
                const sName = sc.name.toLowerCase();
                const sNameClean = sName.replace(/[^a-z0-9]/g, '');
                return sNameClean.includes(dNameClean) || dNameClean.includes(sNameClean);
            });

            // 2. Try Word-based match if no match found
            if (!staticCat) {
                const dWords = dName.split(/[\s/&]+/).filter((w: string) => w.length > 3);
                staticCat = ALL_CATEGORIES.find(sc => {
                    const sName = sc.name.toLowerCase();
                    return dWords.some((word: string) => sName.includes(word));
                });
            }

            // 3. Broad Type Fallbacks if still no match
            let fallbackImage = staticCat?.imageUrl || null;
            if (!fallbackImage) {
                if (dName.includes('food') || dName.includes('rest') || dName.includes('eat') || dName.includes('cafe')) {
                    fallbackImage = 'https://images.unsplash.com/photo-1502301103675-d7597481f064?auto=format&fit=crop&w=800&q=80';
                } else if (dName.includes('shop') || dName.includes('store') || dName.includes('market') || dName.includes('grocery')) {
                    fallbackImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
                } else if (dName.includes('serv') || dName.includes('fix') || dName.includes('repair') || dName.includes('mechanic')) {
                    fallbackImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&w=800&q=80';
                } else if (dName.includes('health') || dName.includes('med') || dName.includes('doctor')) {
                    fallbackImage = 'https://images.unsplash.com/photo-1505751172107-573225a9627e?auto=format&fit=crop&w=800&q=80';
                } else if (dName.includes('tech') || dName.includes('electro') || dName.includes('digital')) {
                    fallbackImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
                } else {
                    // Ultimate high-quality abstract local market fallback
                    fallbackImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';
                }
            }

            return {
                id: c.id,
                name: c.name,
                priority: c.priority ?? 999,
                iconName: staticCat?.iconName || 'ShoppingBag',
                iconUrl: c.icon_url || null,
                imageUrl: c.image_url || c.icon_url || fallbackImage
            };
        }) : [];

        return Response.json({ categories }, { status: 200 });
    } catch (e: any) {
        console.error('Categories GET Error:', e);
        return Response.json({ error: e?.message || 'Failed to load categories' }, { status: 500 });
    }
}
