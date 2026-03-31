'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
       ArrowLeft,
       MapPin,
       Store,
       ShoppingBag,
       Star,
       Tag,
       ChevronRight,
       TrendingUp,
       Info,
       Filter,
       Navigation
} from 'lucide-react';
import Header from '@/components/Header';
import { useLocation } from '@/lib/hooks';

export default function MarketDetailPage() {
       const params = useParams();
       const router = useRouter();
       const marketName = decodeURIComponent(params.name as string);
       const { location: locationState } = useLocation();
       const [loading, setLoading] = useState(true);
       const [data, setData] = useState<any>(null);
       const [selectedCategory, setSelectedCategory] = useState<string>('All');
       const [maxDistance, setMaxDistance] = useState<number>(10);
       const [categories, setCategories] = useState<string[]>(['All']);

       useEffect(() => {
              const fetchMarketData = async () => {
                     try {
                            const res = await fetch(`/api/market?name=${encodeURIComponent(marketName)}`);
                            const json = await res.json();
                            setData(json);
                            
                            // Extract unique categories
                            const vendors = json.vendors || [];
                            const cats = Array.from(new Set(vendors.map((v: any) => v.category_name || v.category).filter(Boolean))) as string[];
                            setCategories(['All', ...cats]);
                     } catch (err) {
                            console.error('Failed to fetch market data:', err);
                     } finally {
                            setLoading(false);
                     }
              };
              fetchMarketData();
       }, [marketName]);

       if (loading) {
              return (
                     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                   <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                   <p className="font-bold text-slate-500">Loading Market Details...</p>
                            </div>
                     </div>
              );
       }

       const vendors = data?.vendors || [];
       const products = data?.products || [];

       return (
              <div className="min-h-screen bg-[#F8FAFC]">
                     <Header
                            locationState={locationState}
                            onMenuClick={() => { }}
                            onProfileClick={() => router.push('/settings')}
                            onNotificationClick={() => { }}
                     />

                     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
                            {/* ─── BACK BUTTON & TITLE ─── */}
                            <div className="flex items-center gap-4 mb-8">
                                   <button
                                          onClick={() => router.back()}
                                          className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                                   >
                                          <ArrowLeft size={20} className="text-slate-600" />
                                   </button>
                                   <div>
                                          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{marketName}</h1>
                                          <div className="flex items-center gap-2 mt-1">
                                                 <MapPin size={14} className="text-orange-500" />
                                                 <p className="text-sm font-bold text-slate-500">{locationState.city || 'Local Market'}</p>
                                          </div>
                                   </div>
                            </div>

                            {/* ─── MARKET STATS BANNERS ─── */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                   <div className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-3xl p-6 text-white shadow-lg shadow-orange-200/50">
                                          <div className="flex justify-between items-start mb-4">
                                                 <div className="p-2 bg-white/20 rounded-xl">
                                                        <Store size={22} />
                                                 </div>
                                                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg">Total Shops</span>
                                          </div>
                                          <p className="text-4xl font-black mb-1">{vendors.length}</p>
                                          <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Active Vendors</p>
                                   </div>

                                   <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
                                          <div className="flex justify-between items-start mb-4">
                                                 <div className="p-2 bg-white/10 rounded-xl text-orange-400">
                                                        <ShoppingBag size={22} />
                                                 </div>
                                                 <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-slate-400 px-2 py-1 rounded-lg">Variety</span>
                                          </div>
                                          <p className="text-4xl font-black mb-1">{products.length}</p>
                                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Products Listed</p>
                                   </div>

                                   <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                          <div className="flex justify-between items-start mb-4">
                                                 <div className="p-2 bg-orange-50 rounded-xl text-orange-500">
                                                        <Info size={22} />
                                                 </div>
                                                 <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">Market Info</span>
                                          </div>
                                          <p className="text-lg font-black text-slate-900 mb-1">Traditional Local Hub</p>
                                          <p className="text-slate-500 text-xs font-semibold">Known for daily essentials and low price items.</p>
                                   </div>
                            </div>

                            {/* ─── VENDORS SECTION ─── */}
                            <section className="mb-12">
                                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                          <div>
                                                 <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">🏪 Popular Shops</h2>
                                                 <p className="text-slate-500 text-sm font-medium mt-0.5">Top rated vendors inside {marketName}</p>
                                          </div>
                                          
                                          {/* ─── FILTERS ─── */}
                                          <div className="flex flex-wrap items-center gap-3">
                                                 <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                                                        <Filter size={14} className="text-slate-400" />
                                                        <select 
                                                               value={selectedCategory} 
                                                               onChange={(e) => setSelectedCategory(e.target.value)}
                                                               className="bg-transparent border-none outline-none text-xs font-black text-slate-700 uppercase tracking-widest cursor-pointer"
                                                        >
                                                               {categories.map(cat => (
                                                                      <option key={cat} value={cat}>{cat}</option>
                                                               ))}
                                                        </select>
                                                 </div>
                                                 
                                                 <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                                                        <Navigation size={14} className="text-slate-400" />
                                                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{maxDistance}km</span>
                                                        <input 
                                                               type="range" 
                                                               min="1" 
                                                               max="50" 
                                                               value={maxDistance}
                                                               onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                                                               className="w-24 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                                        />
                                                 </div>
                                          </div>
                                   </div>

                                   {(() => {
                                          const filteredVendors = vendors.filter((v: any) => {
                                                 const cat = v.category_name || v.category || 'General';
                                                 const categoryMatch = selectedCategory === 'All' || cat === selectedCategory;
                                                 // Distance check (mocking distance if not available in DB for demo)
                                                 const dist = v.distance_val || (Math.random() * 5); 
                                                 const distanceMatch = dist <= maxDistance;
                                                 return categoryMatch && distanceMatch;
                                          });

                                          return filteredVendors.length > 0 ? (
                                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {filteredVendors.map((vendor: any) => (
                                                               <div
                                                                      key={vendor.id}
                                                                      onClick={() => router.push(`/vendor/${vendor.id}`)}
                                                                      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group"
                                                               >
                                                                      <div className="flex items-center gap-4 mb-4">
                                                                             <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                                                                                    🏪
                                                                             </div>
                                                                             <div>
                                                                                    <h3 className="font-black text-slate-900 leading-tight">{vendor.shop_name || vendor.name}</h3>
                                                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{vendor.category_name || vendor.category || 'General'}</p>
                                                                             </div>
                                                                      </div>
                                                                      <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-50">
                                                                             <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                                                                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                                                                    <span>{vendor.rating || '4.0'}</span>
                                                                                    <span className="text-slate-400 font-medium">({vendor.review_count || 0})</span>
                                                                             </div>
                                                                             <div className="flex items-center gap-1 text-orange-500 font-black uppercase tracking-tighter">
                                                                                    Visit Shop <ChevronRight size={12} />
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                        ))}
                                                 </div>
                                          ) : (
                                                 <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-100">
                                                        <p className="text-slate-400 font-bold">No shops match your filters.</p>
                                                 </div>
                                          );
                                   })()}
                            </section>

                            {/* ─── PRODUCTS SECTION ─── */}
                            {products.length > 0 && (
                                   <section>
                                          <div className="flex items-center justify-between mb-6">
                                                 <div>
                                                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">🔥 Trending Products</h2>
                                                        <p className="text-slate-500 text-sm font-medium mt-0.5">Best deals currently available</p>
                                                 </div>
                                          </div>

                                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                 {products.map((product: any) => (
                                                        <div
                                                               key={product.id}
                                                               onClick={() => router.push(`/vendor/${product.vendor_id}`)}
                                                               className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group"
                                                        >
                                                               <div className="aspect-square bg-slate-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                                                                      {product.image_url ? (
                                                                             <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                      ) : (
                                                                             <ShoppingBag size={24} className="text-slate-300" />
                                                                      )}
                                                               </div>
                                                               <p className="font-bold text-slate-900 text-xs leading-tight mb-1 truncate">{product.name}</p>
                                                               <div className="flex items-center gap-2 mb-2">
                                                                      <span className="text-sm font-black text-slate-900">₹{product.price}</span>
                                                                      {product.mrp > product.price && (
                                                                             <span className="text-[10px] text-slate-400 line-through font-bold">₹{product.mrp}</span>
                                                                      )}
                                                               </div>
                                                               <div className="pt-2 border-t border-slate-50">
                                                                      <p className="text-[9px] font-black text-orange-500 uppercase truncate">{product.vendors?.shop_name || 'Local Shop'}</p>
                                                               </div>
                                                        </div>
                                                 ))}
                                          </div>
                                   </section>
                            )}
                     </main>
              </div>
       );
}
