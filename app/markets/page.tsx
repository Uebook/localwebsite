'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
       ArrowLeft,
       MapPin,
       Search,
       Filter,
       Store,
       ChevronRight,
       Sparkles
} from 'lucide-react';
import Header from '@/components/Header';
import { useLocation } from '@/lib/hooks';

const MARKETS_BY_CITY: Record<string, any[]> = {
       'Amritsar': [
              { id: 1, name: 'Hall Bazaar', shops: '200+', color: 'from-orange-500 to-amber-400', emoji: '🏛️', desc: 'Oldest and most famous market in Amritsar.' },
              { id: 2, name: 'Lawrence Road', shops: '150+', color: 'from-violet-500 to-purple-400', emoji: '🛍️', desc: 'Modern shopping and food hub.' },
              { id: 3, name: 'Putligarh Market', shops: '100+', color: 'from-emerald-500 to-green-400', emoji: '🥦', desc: 'Daily essentials and grocery market.' },
              { id: 4, name: 'Katra Jaimal Singh', shops: '180+', color: 'from-amber-500 to-yellow-400', emoji: '⭐', desc: 'Famous for traditional Phulkari and suits.' },
              { id: 5, name: 'Novelty Chowk', shops: '120+', color: 'from-red-500 to-rose-400', emoji: '🧃', desc: 'Electronic and textile market.' },
              { id: 6, name: 'Ranjit Avenue', shops: '90+', color: 'from-blue-500 to-sky-400', emoji: '☕', desc: 'Upscale shopping and cafe area.' },
              { id: 7, name: 'Guru Bazaar', shops: '300+', color: 'from-orange-400 to-red-400', emoji: '💍', desc: 'Gold and jewelry specialty market.' },
              { id: 8, name: 'Shastri Market', shops: '250+', color: 'from-pink-500 to-rose-400', emoji: '👗', desc: 'Wholesale textile and garments.' },
              { id: 9, name: 'Lahori Gate Market', shops: '80+', color: 'from-yellow-500 to-orange-400', emoji: '🥨', desc: 'Famous for spices and dry fruits.' },
              { id: 10, name: 'Cooper Road', shops: '60+', color: 'from-teal-500 to-cyan-400', emoji: '📚', desc: 'Books and stationery hub.' },
       ],
       'Noida': [
              { id: 101, name: 'Atta Market', shops: '500+', color: 'from-orange-500 to-amber-400', emoji: '🛍️', desc: 'Busiest street market in Noida.' },
              { id: 102, name: 'Brahmaputra Market', shops: '80+', color: 'from-violet-500 to-purple-400', emoji: '🍲', desc: 'Famous food and essential goods market.' },
              { id: 103, name: 'Indira Market', shops: '120+', color: 'from-emerald-500 to-green-400', emoji: '👕', desc: 'Budget clothing and accessories.' },
              { id: 104, name: 'Sector 18 Market', shops: '300+', color: 'from-blue-500 to-sky-400', emoji: '🏢', desc: 'Premium shopping and electronics.' },
              { id: 105, name: 'Sector 62 Market', shops: '150+', color: 'from-indigo-500 to-blue-400', emoji: '💻', desc: 'IT and electronics specialty area.' },
              { id: 106, name: 'Sector 110 Market', shops: '70+', color: 'from-lime-500 to-green-400', emoji: '🥛', desc: 'Modern residential market.' },
       ],
       'Greater Noida': [
              { id: 201, name: 'Jaguar Market', shops: '100+', color: 'from-orange-500 to-amber-400', emoji: '🐅', desc: 'Central market for daily needs.' },
              { id: 202, name: 'Alpha 1 Market', shops: '150+', color: 'from-violet-500 to-purple-400', emoji: '🏪', desc: 'Commercial hub of Greater Noida.' },
              { id: 203, name: 'Beta 2 Market', shops: '120+', color: 'from-emerald-500 to-green-400', emoji: '🛒', desc: 'Large residential shopping center.' },
              { id: 204, name: 'Grand Venice Area', shops: '50+', color: 'from-blue-500 to-sky-400', emoji: '🎭', desc: 'Premium themed shopping area.' },
              { id: 205, name: 'Jagat Farm', shops: '400+', color: 'from-red-500 to-orange-400', emoji: '🏘️', desc: 'Largest traditional market in GNoida.' },
              { id: 206, name: 'Pari Chowk Area', shops: '200+', color: 'from-teal-500 to-emerald-400', emoji: '🧚', desc: 'Main transit and retail hub.' },
              { id: 207, name: 'Tugalpur Market', shops: '180+', color: 'from-amber-500 to-yellow-400', emoji: '🛖', desc: 'Electronics and computer specialty.' },
              { id: 208, name: 'Omaxe Mall Area', shops: '90+', color: 'from-indigo-500 to-purple-400', emoji: '🎬', desc: 'High-end retail and cinematic hub.' },
       ]
};

export default function AllMarketsPage() {
       const router = useRouter();
       const { location: locationState } = useLocation();
       const [searchQuery, setSearchQuery] = useState('');
       const [selectedCity, setSelectedCity] = useState<string | null>(null);
       const [dbMarkets, setDbMarkets] = useState<any[]>([]);
       const [loading, setLoading] = useState(true);

       useEffect(() => {
              fetch('/api/markets')
                     .then(res => res.json())
                     .then(data => {
                            if (data.success) {
                                   setDbMarkets(data.markets);
                            }
                     })
                     .catch(err => console.error('Failed to fetch markets:', err))
                     .finally(() => setLoading(false));
       }, []);

       const cities = Object.keys(MARKETS_BY_CITY);

       // Group DB markets by city for display
       const marketsByCity: Record<string, any[]> = {};
       dbMarkets.forEach(m => {
              m.cities.forEach((city: string) => {
                     if (!marketsByCity[city]) marketsByCity[city] = [];
                     
                     // Find fallback info from hardcoded data if available
                     const fallback = MARKETS_BY_CITY[city]?.find((hm: any) => hm.name === m.name) || {};
                     
                     marketsByCity[city].push({
                            id: m.name, // Use name since we don't have ID in this API
                            name: m.name,
                            shops: `${m.shops}+`,
                            color: m.color || fallback.color || 'from-slate-500 to-slate-400',
                            emoji: m.emoji || fallback.emoji || '🏪',
                            icon: m.icon || null,
                            desc: fallback.desc || 'Local market hub with various shops and services.'
                     });
              });
       });

       // Use DB markets if loaded, else fallback to hardcoded for UI structure while loading
       const displayCities = dbMarkets.length > 0 ? Object.keys(marketsByCity).sort() : cities;
       const currentMarketsByCity = dbMarkets.length > 0 ? marketsByCity : MARKETS_BY_CITY;

       return (
              <div className="min-h-screen bg-[#F8FAFC]">
                     <Header
                            locationState={locationState}
                            onMenuClick={() => { }}
                            onProfileClick={() => router.push('/settings')}
                            onNotificationClick={() => { }}
                     />

                     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
                            {/* ─── TITLE & SEARCH ─── */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                                   <div>
                                          <div className="flex items-center gap-3 mb-4">
                                                 <button
                                                        onClick={() => router.back()}
                                                        className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all"
                                                 >
                                                        <ArrowLeft size={18} className="text-slate-600" />
                                                 </button>
                                                 <h1 className="text-4xl font-black text-slate-900 tracking-tight">All Markets</h1>
                                          </div>
                                          <p className="text-slate-500 font-bold max-w-lg">
                                                 Explore the best local shopping hubs across your favorite cities. Find everything from fresh produce to premium fashion.
                                          </p>
                                   </div>

                                   <div className="relative w-full md:w-80">
                                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                          <input
                                                 type="text"
                                                 placeholder="Search markets..."
                                                 value={searchQuery}
                                                 onChange={(e) => setSearchQuery(e.target.value)}
                                                 className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold text-slate-900 transition-all shadow-sm"
                                          />
                                   </div>
                            </div>

                            {/* ─── CITY FILTER ─── */}
                            <div className="flex flex-wrap gap-2 mb-12">
                                   <button
                                          onClick={() => setSelectedCity(null)}
                                          className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all ${selectedCity === null
                                                        ? 'bg-slate-900 text-white shadow-lg'
                                                        : 'bg-white text-slate-500 border border-slate-100 hover:border-orange-400'
                                                 }`}
                                   >
                                          All Cities
                                   </button>
                                   {displayCities.map(city => (
                                          <button
                                                 key={city}
                                                 onClick={() => setSelectedCity(city)}
                                                 className={`px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all ${selectedCity === city
                                                               ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                                               : 'bg-white text-slate-500 border border-slate-100 hover:border-orange-400'
                                                        }`}
                                          >
                                                 {city}
                                          </button>
                                   ))}
                            </div>

                            {/* ─── MARKETS LIST BY CITY ─── */}
                            <div className="space-y-16">
                                   {displayCities.filter(city => !selectedCity || city === selectedCity).map(city => {
                                          const markets = currentMarketsByCity[city].filter(m =>
                                                 m.name.toLowerCase().includes(searchQuery.toLowerCase())
                                          );

                                          if (markets.length === 0) return null;

                                          return (
                                                 <section key={city}>
                                                        <div className="flex items-center gap-3 mb-8">
                                                               <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                                                               <h2 className="text-2xl font-black text-slate-900 tracking-tight">{city}</h2>
                                                               <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                                                      {markets.length} Markets
                                                               </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                               {markets.map(market => (
                                                                      <div
                                                                             key={market.id}
                                                                             onClick={() => router.push(`/market/${encodeURIComponent(market.name)}`)}
                                                                             className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all cursor-pointer"
                                                                      >
                                                                             <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${market.color} flex items-center justify-center text-3xl mb-6 shadow-md group-hover:scale-110 transition-transform overflow-hidden`}>
                                                                                    {market.icon ? (
                                                                                           <img src={market.icon} alt={market.name} className="w-full h-full object-cover" />
                                                                                    ) : (
                                                                                           market.emoji
                                                                                    )}
                                                                             </div>

                                                                             <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                                                                                    {market.name}
                                                                             </h3>

                                                                             <p className="text-slate-500 text-sm font-semibold mb-6 line-clamp-2">
                                                                                    {market.desc}
                                                                             </p>

                                                                             <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                                                    <div className="flex items-center gap-1.5">
                                                                                           <Store size={14} className="text-orange-500" />
                                                                                           <span className="text-xs font-black text-slate-900">{market.shops} Shops</span>
                                                                                    </div>
                                                                                    <div className="bg-orange-50 p-2 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                                                           <ChevronRight size={16} />
                                                                                    </div>
                                                                             </div>
                                                                      </div>
                                                               ))}
                                                        </div>
                                                 </section>
                                          );
                                   })}
                            </div>
                     </main>
              </div>
       );
}
