import React from 'react';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';
import { ALL_CATEGORIES } from '@/lib/categories';
import HomeClient from './HomeClient';

async function getCategories() {
    try {
        const query = new URLSearchParams();
        query.set('select', '*');
        query.set('order', 'priority.asc');
        query.set('visible', 'eq.true');

        const rows = await supabaseRestGet(`/rest/v1/categories?${query.toString()}`);
        const categories = Array.isArray(rows) ? rows.map((c: any) => {
            const dName = c.name.toLowerCase();
            const dNameClean = dName.replace(/[^a-z0-9]/g, '');

            let staticCat = ALL_CATEGORIES.find(sc => {
                const sName = sc.name.toLowerCase();
                const sNameClean = sName.replace(/[^a-z0-9]/g, '');
                return sNameClean.includes(dNameClean) || dNameClean.includes(sNameClean);
            });

            if (!staticCat) {
                const dWords = dName.split(/[\s/&]+/).filter((w: string) => w.length > 3);
                staticCat = ALL_CATEGORIES.find(sc => {
                    const sName = sc.name.toLowerCase();
                    return dWords.some((word: string) => sName.includes(word));
                });
            }

            let fallbackImage = staticCat?.imageUrl || null;
            if (!fallbackImage) {
                if (dName.includes('food')) fallbackImage = 'https://images.unsplash.com/photo-1502301103675-d7597481f064?auto=format&fit=crop&w=800&q=80';
                else fallbackImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';
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

        return categories;
    } catch (e) {
        console.error('Categories Fetch Error (Server):', e);
        return [];
    }
}

export default async function Page() {
    const categories = await getCategories();
    
    return <HomeClient initialCategories={categories} />;
}
