import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const circle = searchParams.get('circle');

        const query = new URLSearchParams();
        query.set('select', '*');
        query.set('active', 'eq.true');
        query.set('order', 'sort_order.asc,created_at.desc');

        // Location-based filtering: 
        // Show banner if (city is null AND circle is null) OR (city matches AND (circle is null OR circle matches))
        if (city) {
            if (circle) {
                query.set('or', `(and(target_city.is.null,target_circle.is.null),and(target_city.eq.${city},or(target_circle.is.null,target_circle.eq.${circle})))`);
            } else {
                query.set('or', `(target_city.is.null,target_city.eq.${city})`);
            }
        } else {
            // No location provided, only show global banners
            query.set('target_city', 'is.null');
            query.set('target_circle', 'is.null');
        }

        const rows = await supabaseRestGet(`/rest/v1/banners?${query.toString()}`);

        // Ensure we only show banners that are currently active chronologically
        const now = new Date();
        const banners = (Array.isArray(rows) ? rows : []).filter((b: any) => {
            if (b.start_at && new Date(b.start_at) > now) return false;
            if (b.end_at && new Date(b.end_at) < now) return false;
            return true;
        }).map((b: any) => ({
            id: b.id,
            title: b.title,
            imageUrl: b.image_url,
            linkUrl: b.link_url,
            priority: b.sort_order ?? 999,
        }));

        return Response.json({ banners }, { status: 200 });
    } catch (e: any) {
        console.error('Banners GET Error:', e);
        return Response.json({ error: e?.message || 'Failed to load banners' }, { status: 500 });
    }
}
