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
              // Use a simpler string or even separate queries if needed, but or=(...) is fine if encoded correctly.
              // We use .ilike for better match flexibility and case-insensitivity
              const query = `/rest/v1/vendors?or=(sub_tehsil.ilike.*${marketName}*,circle.ilike.*${marketName}*)&select=*`;
              const vendorsResponse = await supabaseRestGet(query);

              const vendors = (vendorsResponse || []).filter((v: any) => v.status === 'Active');

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
