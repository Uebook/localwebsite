'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Tag, MapPin, Zap, TrendingUp, Filter, Search, ChevronDown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/lib/hooks';
import OfferDetailModal from '@/components/OfferDetailModal';

export default function SalesPage() {
       const [sales, setSales] = useState<any[]>([]);
       const [loading, setLoading] = useState(true);
       const [filter, setFilter] = useState<'all' | 'state' | 'india'>('all');
       const [selectedSale, setSelectedSale] = useState<any>(null);
       const { location: locationState } = useLocation();
       const router = useRouter();

       useEffect(() => {
              const cityParts = locationState.city?.split(',');
              const state = cityParts && cityParts.length > 1 ? cityParts[cityParts.length - 1].trim() : '';

              fetch('/api/festive-offers?status=active')
                     .then(res => res.json())
                     .then(data => {
                            if (Array.isArray(data)) {
                                   let filtered = data;
                                   if (filter === 'state' && state) {
                                          filtered = data.filter(s => s.circle?.includes(state));
                                   } else if (filter === 'india') {
                                          filtered = data.filter(s => !s.circle || s.circle === 'All India');
                                   }
                                   setSales(filtered);
                            }
                            setLoading(false);
                     })
                     .catch(err => {
                            console.error('Failed to fetch sales:', err);
                            setLoading(false);
                     });
       }, [filter, locationState.city]);

       return (
              <div className="min-h-screen bg-white">
                     <Header />

                     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                            <div className="mb-10 text-center">
                                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                          <Sparkles size={14} /> LocalMarket Exclusive
                                   </div>
                                   <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Active Sales & Mega Offers</h1>
                                   <p className="text-slate-500 text-lg max-w-2xl mx-auto">Discover the best deals from your local markets, your state, and across India. Shop authentic, save more.</p>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100">
                                   <div className="flex items-center gap-2">
                                          <button
                                                 onClick={() => setFilter('all')}
                                                 className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all ${filter === 'all' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                                          >
                                                 All Offers
                                          </button>
                                          <button
                                                 onClick={() => setFilter('state')}
                                                 className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all ${filter === 'state' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                                          >
                                                 State-wise
                                          </button>
                                          <button
                                                 onClick={() => setFilter('india')}
                                                 className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all ${filter === 'india' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                                          >
                                                 India-wise
                                          </button>
                                   </div>

                                   <div className="relative w-full md:w-80">
                                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                          <input
                                                 type="text"
                                                 placeholder="Search sales (e.g. Diwali, Shoes...)"
                                                 className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                          />
                                   </div>
                            </div>

                            {loading ? (
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {[1, 2, 3, 4, 5, 6].map(i => (
                                                 <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-3xl" />
                                          ))}
                                   </div>
                            ) : sales.length > 0 ? (
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                          {sales.map((sale) => (
                                                 <div
                                                        key={sale.id}
                                                        className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] shadow-xl shadow-slate-200 transition-all hover:-translate-y-2 hover:shadow-2xl"
                                                 >
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${sale.color || 'from-orange-500 to-rose-500'} opacity-90`} />
                                                        <div className="relative p-8 h-full flex flex-col justify-between min-h-[320px]">
                                                               <div>
                                                                      <div className="flex items-center justify-between mb-6">
                                                                             <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                                                                    {sale.circle || 'All India'}
                                                                             </span>
                                                                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                                                                    <Tag className="text-orange-500" size={24} />
                                                                             </div>
                                                                      </div>
                                                                      <h3 className="text-3xl font-black text-white leading-tight mb-3">{sale.title}</h3>
                                                                      <p className="text-white/80 text-base font-medium leading-relaxed">{sale.description}</p>
                                                               </div>

                                                               <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
                                                                      <div>
                                                                             <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                                                                             <p className="text-white font-black">Active Now</p>
                                                                      </div>
                                                                      <button className="px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-black text-sm transition-all shadow-xl hover:bg-slate-900 hover:text-white active:scale-95">
                                                                             Explore Deals
                                                                      </button>
                                                               </div>
                                                        </div>
                                                 </div>
                                          ))}
                                   </div>
                            ) : (
                                   <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mx-auto mb-6">
                                                 <Tag className="text-slate-300" size={40} />
                                          </div>
                                          <h3 className="text-2xl font-black text-slate-900 mb-2">No Active Sales Found</h3>
                                          <p className="text-slate-500 font-medium">Try changing your location or filters to find more deals.</p>
                                   </div>
                            )}
                     </main>
              </div>
       );
}
