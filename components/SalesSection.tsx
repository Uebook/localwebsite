'use client';

import { useState, useEffect, useMemo } from 'react';
import { Tag, MapPin, ChevronRight, Zap, TrendingUp, Sparkles, Flag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/lib/hooks';
import OfferDetailModal from './OfferDetailModal';

interface SaleOffer {
       id: string;
       title: string;
       description: string;
       discount_amount?: string;
       circle?: string;
       image_url?: string;
       color?: string;
       is_active: boolean;
       type: string;
}

export default function SalesSection() {
       const [sales, setSales] = useState<SaleOffer[]>([]);
       const [loading, setLoading] = useState(true);
       const [selectedSale, setSelectedSale] = useState<any>(null);
       const router = useRouter();
       const { location } = useLocation();

       useEffect(() => {
              fetch('/api/festive-offers?status=active')
                     .then(res => res.json())
                     .then(data => {
                            if (Array.isArray(data)) setSales(data);
                            setLoading(false);
                     })
                     .catch(err => {
                            console.error('Failed to fetch sales:', err);
                            setLoading(false);
                     });
       }, []);

       const { stateSales, indiaSales } = useMemo(() => {
              const state = location.city?.split(',').pop()?.trim() || '';

              const sSales: SaleOffer[] = [];
              const iSales: SaleOffer[] = [];

              sales.forEach(sale => {
                     const circle = sale.circle?.toLowerCase() || '';
                     if (circle === 'all india' || !circle) {
                            iSales.push(sale);
                     } else if (state && circle.includes(state.toLowerCase())) {
                            sSales.push(sale);
                     } else {
                            // If doesn't match state, put in India-wide if it's general, 
                            // or just skip if it's for another state. For now, let's keep all non-state in India row if they are national.
                            if (circle === 'all india') iSales.push(sale);
                            else sSales.push(sale); // Default to state row for specific local offers
                     }
              });

              return { stateSales: sSales, indiaSales: iSales };
       }, [sales, location.city]);

       const renderSaleCard = (sale: SaleOffer) => (
              <div
                     key={sale.id}
                     onClick={() => setSelectedSale(sale)}
                     className="min-w-[300px] sm:min-w-[340px] relative group cursor-pointer overflow-hidden rounded-3xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 hover:shadow-2xl h-48"
              >
                     {/* Background Image or Gradient */}
                     {sale.image_url ? (
                            <div className="absolute inset-0">
                                   <img 
                                          src={sale.image_url} 
                                          alt={sale.title} 
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                   />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>
                     ) : (
                            <>
                                   <div className={`absolute inset-0 bg-gradient-to-br ${sale.color || 'from-orange-500 to-rose-500'} opacity-90`} />
                                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                            </>
                     )}

                     <div className="relative p-6 h-full flex flex-col justify-between">
                            <div>
                                   <div className="flex items-center justify-between mb-4">
                                          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                                 {sale.circle || 'All India'}
                                          </span>
                                          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                                                 <Sparkles className="text-white" size={20} />
                                          </div>
                                   </div>
                                   <h3 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-sm">{sale.title}</h3>
                                   <p className="text-white/80 text-sm font-medium leading-snug line-clamp-2">{sale.description}</p>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                                 <Tag className="text-orange-500" size={16} />
                                          </div>
                                          <p className="text-white font-black text-lg">{sale.discount_amount || 'Special'}</p>
                                   </div>
                                   <div className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                          Shop Deal
                                   </div>
                            </div>
                     </div>
              </div>
       );

       if (loading) {
              return (
                     <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {[1, 2, 3].map(i => (
                                   <div key={i} className="min-w-[280px] h-40 bg-slate-100 animate-pulse rounded-2xl" />
                            ))}
                     </div>
              );
       }

       if (sales.length === 0) return null;

       return (
              <section className="mb-14">
                     <div className="flex items-center justify-between mb-6">
                            <div>
                                   <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                          <Zap className="text-orange-500 fill-orange-500" size={24} />
                                          Active Offer & Sale
                                   </h2>
                                   <p className="text-slate-400 text-sm font-medium mt-0.5">Big savings from top local markets</p>
                            </div>
                            <button
                                   onClick={() => router.push('/sales')}
                                   className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm font-black hover:bg-orange-100 transition-all flex items-center gap-1 group"
                            >
                                   View All <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                     </div>

                     {/* State-wise Sales */}
                     {stateSales.length > 0 && (
                            <div className="mb-10">
                                   <div className="flex items-center gap-2 mb-4">
                                          <MapPin size={16} className="text-orange-500" />
                                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                                 Sales in {location.city?.split(',').pop()?.trim() || 'Your State'}
                                          </h3>
                                   </div>
                                   <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                                          {stateSales.map(renderSaleCard)}
                                   </div>
                            </div>
                     )}

                     {/* India-wide Sales */}
                     {indiaSales.length > 0 && (
                            <div>
                                   <div className="flex items-center gap-2 mb-4">
                                          <Flag size={16} className="text-primary" />
                                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                                 All India Mega Sales
                                          </h3>
                                   </div>
                                   <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                                          {indiaSales.map(renderSaleCard)}

                                          {/* Explore More Card */}
                                          <div
                                                 onClick={() => router.push('/sales')}
                                                 className="min-w-[200px] flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl hover:border-orange-300 hover:bg-orange-50/30 transition-all group cursor-pointer"
                                          >
                                                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                                        <TrendingUp className="text-orange-500" size={32} />
                                                 </div>
                                                 <p className="font-black text-slate-600 group-hover:text-orange-600 transition-colors">See More Sales</p>
                                                 <p className="text-xs font-bold text-slate-400">View all offers</p>
                                          </div>
                                   </div>
                            </div>
                     )}

                     {selectedSale && (
                            <OfferDetailModal
                                   offer={selectedSale}
                                   onClose={() => setSelectedSale(null)}
                            />
                     )}
              </section>
       );
}
