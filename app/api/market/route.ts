import { NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: Request) {
       const { searchParams } = new URL(request.url);
       const marketName = searchParams.get('name');

       if (!marketName) {
              return NextResponse.json({ error: 'Market name is required' }, { status: 400 });
       }

       try {
              // 1. Fetch vendors in this market
              // To handle typos (like STREET vs STREERT), we'll do a more fuzzy search
              // We'll search for the full name first, then words if no results, 
              // or just use a broader OR with the first significant word.
              
              const words = marketName.split(/\s+/).filter(w => 
                     w.length > 2 && !['market', 'street', 'circle', 'area', 'town'].includes(w.toLowerCase())
              );
              const primaryKeyword = words[0] || marketName;
              const encodedKeyword = encodeURIComponent(`*${primaryKeyword}*`);
              const encodedFullName = encodeURIComponent(`*${marketName}*`);

              // Try searching for the full name OR the primary keyword across columns
              const query = `/rest/v1/vendors?or=(sub_tehsil.ilike.${encodedFullName},circle.ilike.${encodedFullName},town.ilike.${encodedFullName},circle.ilike.${encodedKeyword},town.ilike.${encodedKeyword})&select=*`;
              const vendorsResponse = await supabaseRestGet(query);

              // Allow any shop that is Active, or has been verified by admin
              const vendors = (vendorsResponse || []).filter((v: any) => 
                     v.status === 'Active' || 
                     v.is_verified === true || 
                     v.kyc_status === 'Verified' ||
                     v.kycStatus === 'Verified'
              );

              // 2. Fetch some products from these vendors to show trending items
              let products: any[] = [];
              if (vendors.length > 0) {
                     const vendorIds = vendors.map((v: any) => v.id).join(',');
                     const productsResponse = await supabaseRestGet(
                            `/rest/v1/vendor_products?vendor_id=in.(${vendorIds})&limit=12&select=*,vendors(name)`
                     );
                     products = productsResponse || [];
              }

              return NextResponse.json({
                     success: true,
                     market: {
                            name: marketName,
                            vendorCount: vendors.length,
                            productCount: products.length
                     },
                     vendors,
                     products
              });
       } catch (error: any) {
              console.error('Market API Error:', error);
              return NextResponse.json({ error: error.message }, { status: 500 });
       }
}
