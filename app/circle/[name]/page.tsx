'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
       ArrowLeft,
       MapPin,
       Store,
       ShoppingBag,
       ChevronRight,
       LayoutGrid
} from 'lucide-react';
import Header from '@/components/Header';
import { useLocation } from '@/lib/hooks';

export default function CircleDetailPage() {
       const params = useParams();
       const router = useRouter();
       const circleName = decodeURIComponent(params.name as string);
       const { location: locationState } = useLocation();
       const [loading, setLoading] = useState(true);
       const [data, setData] = useState<any>(null);

       useEffect(() => {
              const fetchCircleData = async () => {
                     try {
                            const res = await fetch(`/api/markets/circle?circle=${encodeURIComponent(circleName)}`);
                            const json = await res.json();
                            setData(json);
                     } catch (err) {
                            console.error('Failed to fetch circle data:', err);
                     } finally {
                            setLoading(false);
                     }
              };
              fetchCircleData();
       }, [circleName]);

       if (loading) {
              return (
                     <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                   <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                   <p className="font-bold text-slate-500">Loading Markets in {circleName}...</p>
                            </div>
                     </div>
              );
       }

       const markets = data?.markets || [];

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
                                          onClick={() => router.push('/')}
                                          className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all active:scale-95"
                                   >
                                          <ArrowLeft size={20} className="text-slate-600" />
                                   </button>
                                   <div>
                                          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{circleName}</h1>
                                          <div className="flex items-center gap-2 mt-1">
                                                 <MapPin size={14} className="text-orange-500" />
                                                 <p className="text-sm font-bold text-slate-500">Select a market to browse shops</p>
                                          </div>
                                   </div>
                            </div>

                            {/* ─── MARKETS GRID ─── */}
                            <section className="mb-12">
                                   <div className="flex items-center justify-between mb-6">
                                          <div>
                                                 <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">🏛️ Shopping Hubs</h2>
                                                 <p className="text-slate-500 text-sm font-medium mt-0.5">Popular local markets within {circleName}</p>
                                          </div>
                                   </div>

                                   {markets.length > 0 ? (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                 {markets.map((market: any) => (
                                                        <div
                                                               key={market.name}
                                                               onClick={() => router.push(`/market/${encodeURIComponent(market.name)}`)}
                                                               className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex items-center justify-between"
                                                        >
                                                               <div className="flex items-center gap-5">
                                                                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${market.color || 'from-orange-500 to-amber-400'} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                                                                             {market.emoji || '🏪'}
                                                                      </div>
                                                                      <div>
                                                                             <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-orange-500 transition-colors">{market.name}</h3>
                                                                             <div className="flex items-center gap-3 mt-1.5 font-bold text-slate-400 text-xs uppercase tracking-widest">
                                                                                    <span className="flex items-center gap-1"><Store size={12} className="text-slate-300" /> {market.shops} Shops</span>
                                                                             </div>
                                                                      </div>
                                                               </div>
                                                               <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all text-slate-300">
                                                                      <ChevronRight size={18} />
                                                               </div>
                                                        </div>
                                                 ))}
                                          </div>
                                   ) : (
                                          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-100">
                                                 <LayoutGrid size={48} className="mx-auto text-slate-200 mb-4" />
                                                 <p className="text-slate-400 font-bold">No markets defined in this circle yet.</p>
                                          </div>
                                   )}
                            </section>

                            {/* ─── QUICK TIPS ─── */}
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                   <div className="relative z-10">
                                          <h3 className="text-2xl font-black mb-2 italic">Lokall Insights</h3>
                                          <p className="text-slate-400 text-sm max-w-lg mb-6 leading-relaxed font-medium">
                                                 Prices in <span className="text-white font-bold">{circleName}</span> markets are generally 5-8% lower than corporate retailers. Support your local vendors and save more!
                                          </p>
                                          <button className="px-6 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-200/20">
                                                 Compare Prices
                                          </button>
                                   </div>
                            </div>
                     </main>
              </div>
       );
}
