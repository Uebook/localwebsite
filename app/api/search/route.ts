import { NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const sort = searchParams.get('sort'); // price_asc, price_desc
        const format = searchParams.get('format'); // vendors (default), products

        // Normalize city/circle to handle hierarchical State selection ("All Punjab")
        const normalizeLocation = (loc: string | null) => {
            if (!loc) return { value: null, isAll: false };
            const clean = loc.split(',')[0].trim();
            const isAll = clean.startsWith('All ');
            return { 
                value: isAll ? clean.replace('All ', '').trim() : clean, 
                isAll 
            };
        };

        const cityRaw = searchParams.get('city');
        const circleRaw = searchParams.get('circle');
        const cityLoc = normalizeLocation(cityRaw);
        const circleLoc = normalizeLocation(circleRaw);
        const city = cityLoc.value;
        const circle = circleLoc.value;

        // 1. Fetch Categories for mapping
        const allCategories = await supabaseRestGet('/rest/v1/categories?select=*').catch(() => []);
        const catMap: Record<string, string> = {};
        if (Array.isArray(allCategories)) {
            allCategories.forEach(c => {
                catMap[c.id] = c.name;
            });
        }

        // Helper to normalize vendor data based on verified schema
        const normalizeVendor = (v: any) => ({
            ...v,
            imageUrl: v.image_url || v.shop_front_photo_url || v.profile_image_url || '',
            category_name: catMap[v.category_id] || v.category || 'General',
            rating: v.rating || 0,
            review_count: v.review_count || 0,
            reviewCount: v.review_count || 0,
            owner_name: v.owner_name || v.owner || ''
        });

        if (!query) {
            let filter = 'status=eq.Active';
            if (city) {
                const col = cityLoc.isAll ? 'state' : 'city';
                filter += `&${col}=ilike.${encodeURIComponent('%' + city + '%')}`;
            }
            if (circle && !circleLoc.isAll) filter += `&circle=ilike.${encodeURIComponent('%' + circle + '%')}`;
            
            const vendors = await supabaseRestGet(`/rest/v1/vendors?select=*&${filter}&order=created_at.desc&limit=20`);
            return NextResponse.json({
                results: (vendors || []).map((v: any) => ({
                    ...v,
                    category_name: catMap[v.category_id] || v.category || 'General'
                }))
            });
        }

        const lowerQuery = query.toLowerCase().trim();
        const words = lowerQuery.split(/\s+/).filter(w => w.length > 1);

        // Build a broad search pattern
        const pattern = `%${lowerQuery.replace(/\s+/g, '%')}%`;
        const encodedPattern = encodeURIComponent(pattern);

        // Special Keyword: Verified
        if (lowerQuery === 'verified') {
            let filter = 'is_verified=eq.true&status=eq.Active';
            if (city) filter += `&city=ilike.${encodeURIComponent('%' + city + '%')}`;
            if (circle) filter += `&circle=ilike.${encodeURIComponent('%' + circle + '%')}`;
            
            let verifiedVendors = await supabaseRestGet(`/rest/v1/vendors?select=*&${filter}&limit=20`);
            
            // Fallback if no verified vendors in city: get any high rated vendors
            if (!verifiedVendors || verifiedVendors.length === 0) {
                 verifiedVendors = await supabaseRestGet(`/rest/v1/vendors?select=*&status=eq.Active&limit=10`);
            }
            
            const uniqueVerified = (verifiedVendors || []).map((v: any) => normalizeVendor(v));
            return NextResponse.json({ results: uniqueVerified });
        }
        // Special Keyword: Offers / Featured / Low Price
        else if (lowerQuery === 'offers' || lowerQuery === 'featured' || lowerQuery.includes('cheap')) {
            let dealsQuery = `/rest/v1/vendor_products?select=*,vendors!inner(*)&is_active=eq.true&order=price.asc&limit=50`;
            
            // Try flagged items first
            let flaggedQuery = `/rest/v1/vendor_products?select=*,vendors!inner(*)&is_featured=eq.true&is_active=eq.true&limit=20`;
            if (city) flaggedQuery += `&vendors.city=ilike.${encodeURIComponent('%' + city + '%')}`;
            if (circle) flaggedQuery += `&vendors.circle=ilike.${encodeURIComponent('%' + circle + '%')}`;

            let deals = await supabaseRestGet(flaggedQuery).catch(() => []);
            
            // Fallback to general low price if no featured items
            if (!deals || deals.length === 0) {
                if (city) dealsQuery += `&vendors.city=ilike.${encodeURIComponent('%' + city.trim() + '%')}`;
                deals = await supabaseRestGet(dealsQuery).catch(() => []);
            }

            const offerResults: any[] = [];
            const seenOffers = new Set();

            if (Array.isArray(deals)) {
                deals.forEach((p: any) => {
                    const v = p.vendors;
                    if (v && v.id) {
                        if (!seenOffers.has(v.id)) {
                            seenOffers.add(v.id);
                            offerResults.push({
                                ...normalizeVendor(v),
                                matchingProducts: [{
                                    id: p.id,
                                    name: p.name,
                                    price: p.price,
                                    image: p.image_url,
                                    online_price: p.online_price,
                                    mrp: p.mrp
                                }]
                            });
                        } else {
                            const existing = offerResults.find(r => r.id === v.id);
                            if (existing && existing.matchingProducts.length < 3) {
                                existing.matchingProducts.push({
                                    id: p.id,
                                    name: p.name,
                                    price: p.price,
                                    image: p.image_url,
                                    online_price: p.online_price,
                                    mrp: p.mrp
                                });
                            }
                        }
                    }
                });
            }

            return NextResponse.json({ 
                results: offerResults,
                query: lowerQuery,
                count: offerResults.length
            });
        }
        // Special Keyword: Price Drops
        else if (lowerQuery === 'pricedrops' || lowerQuery === 'price drop' || lowerQuery === 'drops') {
            let dropsQuery = `/rest/v1/vendor_products?select=*,vendors!inner(*)&is_price_drop=eq.true&is_active=eq.true&limit=50`;
            if (city) dropsQuery += `&vendors.city=ilike.${encodeURIComponent('%' + city + '%')}`;
            if (circle) dropsQuery += `&vendors.circle=ilike.${encodeURIComponent('%' + circle + '%')}`;

            let drops = await supabaseRestGet(dropsQuery).catch(() => []);
            
            // Fallback to MRP comparison if no flagged price drops
            if (!drops || drops.length === 0) {
                let fallbackDrops = `/rest/v1/vendor_products?select=*,vendors(*)&is_active=eq.true&price=lt.mrp&limit=20`;
                if (city) fallbackDrops += `&vendors.city=ilike.${encodeURIComponent('%' + city.trim() + '%')}`;
                drops = await supabaseRestGet(fallbackDrops).catch(() => []);
            }

            return NextResponse.json({ 
                results: (drops || []).map((p: any) => {
                    const vendor = p.vendors || {};
                    return {
                        ...normalizeVendor(vendor),
                        id: vendor.id || p.vendor_id,
                        matchingProducts: [{
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            mrp: p.mrp,
                            image: p.image_url,
                            online_price: p.online_price
                        }]
                    };
                }),
                query: lowerQuery,
                count: (drops || []).length
            });
        }
        // Special Keyword: Mega Savings
        else if (lowerQuery === 'megasavings' || lowerQuery === 'savings') {
            let savingsQuery = `/rest/v1/vendor_products?select=*,vendors!inner(*)&is_mega_saving=eq.true&is_active=eq.true&limit=50`;
            if (city) savingsQuery += `&vendors.city=ilike.${encodeURIComponent('%' + city + '%')}`;
            if (circle) savingsQuery += `&vendors.circle=ilike.${encodeURIComponent('%' + circle + '%')}`;

            let savings = await supabaseRestGet(savingsQuery).catch(() => []);
            
            // Fallback to online price comparison if no flagged savings
            if (!savings || savings.length === 0) {
                let fallbackSavings = `/rest/v1/vendor_products?select=*,vendors(*)&is_active=eq.true&price=lt.online_price&limit=20`;
                if (city) fallbackSavings += `&vendors.city=ilike.${encodeURIComponent('%' + city.trim() + '%')}`;
                savings = await supabaseRestGet(fallbackSavings).catch(() => []);
            }

            return NextResponse.json({ 
                results: (savings || []).map((p: any) => {
                    const vendor = p.vendors || {};
                    return {
                        ...normalizeVendor(vendor),
                        id: vendor.id || p.vendor_id,
                        matchingProducts: [{
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            mrp: p.mrp,
                            image: p.image_url,
                            online_price: p.online_price
                        }]
                    };
                }),
                query: lowerQuery,
                count: (savings || []).length
            });
        } else {
            // 2. Search vendors by Name/Category with location filter
            let vendorQuery = `/rest/v1/vendors?select=*&status=eq.Active`;
            if (city) {
                const col = cityLoc.isAll ? 'state' : 'city';
                vendorQuery += `&${col}=ilike.${encodeURIComponent('%' + city + '%')}`;
            }
            if (circle && !circleLoc.isAll) vendorQuery += `&circle=ilike.${encodeURIComponent('%' + circle + '%')}`;
            vendorQuery += `&or=(name.ilike.${encodedPattern},category.ilike.${encodedPattern},address.ilike.${encodedPattern},city.ilike.${encodedPattern},state.ilike.${encodedPattern})`;
            
            const vendorResults = await supabaseRestGet(vendorQuery).catch(err => {
                console.error('Vendor search error:', err);
                return [];
            });
            
            // 3. Search products by Name and join vendor info
            let productQuery = `/rest/v1/vendor_products?select=*,vendors(*)&name=ilike.${encodedPattern}&is_active=eq.true`;
            if (city) {
                const col = cityLoc.isAll ? 'vendors.state' : 'vendors.city';
                productQuery += `&${col}=ilike.${encodeURIComponent('%' + city + '%')}`;
            }
            if (circle && !circleLoc.isAll) productQuery += `&vendors.circle=ilike.${encodeURIComponent('%' + circle + '%')}`;

            const productResults = await supabaseRestGet(productQuery).catch(err => {
                console.error('Product search error:', err);
                return [];
            });

            // Normalize and combine
            const seen = new Set();
            const results: any[] = [];
            const productList: any[] = [];

            // 1. Process product matches first
            if (Array.isArray(productResults)) {
                productResults.forEach((p: any) => {
                    const v = p.vendors;
                    if (v && v.id) {
                        const productItem = {
                            id: p.id,
                            name: p.name,
                            price: p.price,
                            mrp: p.mrp,
                            image: p.image_url,
                            online_price: p.online_price,
                            vendor_id: v.id,
                            vendor: normalizeVendor(v)
                        };
                        productList.push(productItem);

                        if (!seen.has(v.id)) {
                            seen.add(v.id);
                            results.push({
                                ...normalizeVendor(v),
                                matchingProducts: [productItem]
                            });
                        } else {
                            const existing = results.find(r => r.id === v.id);
                            if (existing && !existing.matchingProducts.find((mp: any) => mp.id === p.id)) {
                                existing.matchingProducts.push(productItem);
                            }
                        }
                    }
                });
            }

            // 2. Process vendor and category matches for global visibility
            if (Array.isArray(vendorResults)) {
                for (const v of vendorResults) {
                    if (v && v.id) {
                        const isVendorMatch = v.name && v.name.toLowerCase().includes(lowerQuery);
                        const isCategoryMatch = v.category && v.category.toLowerCase().includes(lowerQuery);
                        
                        if (format === 'products') {
                            // If it's a vendor match, always add the vendor as a top suggestion
                            if (isVendorMatch && !seen.has(`v-${v.id}`)) {
                                seen.add(`v-${v.id}`);
                                productList.unshift({
                                    id: `vendor-${v.id}`,
                                    name: v.name,
                                    type: 'vendor',
                                    price: 0,
                                    image: v.image_url || v.shop_front_photo_url || '',
                                    vendor_id: v.id,
                                    vendor: normalizeVendor(v)
                                });
                            }

                            // If it's a category match, add as a category suggestion
                            if (isCategoryMatch && !seen.has(`c-${v.category}`)) {
                                seen.add(`c-${v.category}`);
                                productList.unshift({
                                    id: `category-${v.category}`,
                                    name: v.category,
                                    type: 'category',
                                    price: 0,
                                    vendor_id: null,
                                    vendor: { name: 'Category' }
                                });
                            }

                            // Also add products for this vendor if not already seen
                            if (!seen.has(v.id)) {
                                seen.add(v.id);
                                const vendorProducts = await supabaseRestGet(`/rest/v1/vendor_products?select=*&vendor_id=eq.${v.id}&is_active=eq.true&limit=2`).catch(() => []);
                                if (Array.isArray(vendorProducts) && vendorProducts.length > 0) {
                                    vendorProducts.forEach((p: any) => {
                                        productList.push({
                                            id: p.id,
                                            type: 'product',
                                            name: p.name,
                                            price: p.price,
                                            mrp: p.mrp,
                                            image: p.image_url,
                                            online_price: p.online_price,
                                            vendor_id: v.id,
                                            vendor: normalizeVendor(v)
                                        });
                                    });
                                }
                            }
                        } else {
                            // Vendor-centric result
                            if (!seen.has(v.id)) {
                                seen.add(v.id);
                                const vendorProducts = await supabaseRestGet(`/rest/v1/vendor_products?select=*&vendor_id=eq.${v.id}&is_active=eq.true&limit=3`).catch(() => []);
                                results.push({
                                    ...normalizeVendor(v),
                                    matchingProducts: Array.isArray(vendorProducts) ? vendorProducts.map((p: any) => ({
                                        id: p.id,
                                        type: 'product',
                                        name: p.name,
                                        price: p.price,
                                        mrp: p.mrp,
                                        image: p.image_url,
                                        online_price: p.online_price,
                                        vendor_id: v.id,
                                        vendor: normalizeVendor(v)
                                    })) : []
                                });
                            }
                        }
                    }
                }
            }

            // 3. Fallback: If 0 results found in city/circle, try global search automatically
            if (results.length === 0 && (city || circle)) {
                console.log(`No results for ${lowerQuery} in ${city || circle}. Trying global fallback...`);
                let globalProductQuery = `/rest/v1/vendor_products?select=*,vendors(*)&name=ilike.${encodedPattern}&is_active=eq.true&limit=20`;
                const gProducts = await supabaseRestGet(globalProductQuery).catch(() => []);

                if (Array.isArray(gProducts)) {
                   gProducts.forEach((p: any) => {
                       const v = p.vendors;
                       if (v && v.id && !seen.has(v.id)) {
                           const productItem = {
                               id: p.id,
                               type: 'product',
                               name: p.name,
                               price: p.price,
                               mrp: p.mrp,
                               image: p.image_url,
                               online_price: p.online_price,
                               vendor_id: v.id,
                               vendor: normalizeVendor(v)
                           };
                           productList.push(productItem);
                           seen.add(v.id);
                           results.push({
                               ...normalizeVendor(v),
                               matchingProducts: [productItem]
                           });
                       }
                   });
                }

                // Also try global vendor matches
                let globalVendorQuery = `/rest/v1/vendors?select=*&status=eq.Active&name=ilike.${encodedPattern}&limit=5`;
                const gVendors = await supabaseRestGet(globalVendorQuery).catch(() => []);
                if (Array.isArray(gVendors)) {
                    gVendors.forEach((v: any) => {
                        if (v && v.id && !seen.has(`v-${v.id}`)) {
                            seen.add(`v-${v.id}`);
                            productList.unshift({
                                id: `vendor-${v.id}`,
                                name: v.name,
                                type: 'vendor',
                                price: 0,
                                image: v.image_url || v.shop_front_photo_url || '',
                                vendor_id: v.id,
                                vendor: normalizeVendor(v)
                            });
                        }
                    });
                }
            }

            // Apply sorting if requested
            if (sort === 'price_asc') {
                productList.sort((a, b) => {
                    const pa = (a.price && a.price > 0) ? a.price : 999999;
                    const pb = (b.price && b.price > 0) ? b.price : 999999;
                    return pa - pb;
                });
                results.sort((a, b) => {
                    const aPrices = a.matchingProducts.map((p: any) => (p.price && p.price > 0) ? p.price : 999999);
                    const bPrices = b.matchingProducts.map((p: any) => (p.price && p.price > 0) ? p.price : 999999);
                    const aMin = aPrices.length > 0 ? Math.min(...aPrices) : 999999;
                    const bMin = bPrices.length > 0 ? Math.min(...bPrices) : 999999;
                    return aMin - bMin;
                });
            } else if (sort === 'price_desc') {
                productList.sort((a, b) => (b.price || 0) - (a.price || 0));
                results.sort((a, b) => {
                    const aMax = Math.max(...a.matchingProducts.map((p: any) => p.price || 0), 0);
                    const bMax = Math.max(...b.matchingProducts.map((p: any) => p.price || 0), 0);
                    return bMax - aMax;
                });
            }

            if (format === 'products') {
                return NextResponse.json({
                    results: productList,
                    query: lowerQuery,
                    count: productList.length
                });
            }

            // 4. Final Aggregation for "Cheaper than online" badge support
            results.forEach(r => {
                if (r.matchingProducts && r.matchingProducts.length > 0) {
                    const onlineProducts = r.matchingProducts.filter((p: any) => p.online_price);
                    if (onlineProducts.length > 0) {
                        r.avgOnlinePrice = onlineProducts.reduce((sum: number, p: any) => sum + p.online_price, 0) / onlineProducts.length;
                        r.avgOfflinePrice = onlineProducts.reduce((sum: number, p: any) => sum + p.price, 0) / onlineProducts.length;
                    }
                }
            });

            return NextResponse.json({
                results,
                query: lowerQuery,
                count: results.length
            });
        }
    } catch (error: any) {
        console.error('Search API Error:', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            details: error.stack
        }, { status: 500 });
    }
}
