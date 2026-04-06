import React from 'react';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';
import MarketDetailClient from './MarketDetailClient';

interface PageProps {
       params: Promise<{ name: string }>;
}

async function getMarketData(marketName: string) {
       try {
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

              // Fetch some products from these vendors to show trending items
              let products: any[] = [];
              if (vendors.length > 0) {
                     const vendorIds = vendors.map((v: any) => v.id).join(',');
                     const productsResponse = await supabaseRestGet(
                            `/rest/v1/vendor_products?vendor_id=in.(${vendorIds})&limit=12&select=*,vendors(name)`
                     );
                     products = productsResponse || [];
              }

              return { vendors, products };
       } catch (error) {
              console.error('Error fetching market data:', error);
              return { vendors: [], products: [] };
       }
}

export default async function Page({ params }: PageProps) {
       const resolvedParams = await params;
       const marketName = decodeURIComponent(resolvedParams.name);
       const data = await getMarketData(marketName);

       return <MarketDetailClient marketName={marketName} initialData={data} />;
}
