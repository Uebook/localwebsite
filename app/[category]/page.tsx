'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BusinessCard from '@/components/BusinessCard';
import {
       ArrowLeft,
       Activity,
       Scissors,
       Shirt,
       ShoppingBag,
       Star,
       MapPin,
       Zap,
       Sparkles,
       TrendingUp,
       Clock,
       CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

export default function CategoryDiscoveryPage() {
       const { category } = useParams();
       const router = useRouter();
       const [isSidebarOpen, setIsSidebarOpen] = useState(false);
       const [results, setResults] = useState<any[]>([]);
       const [loading, setLoading] = useState(true);

       const decodedCategory = decodeURIComponent(category as string).replace(/-/g, ' ');

       useEffect(() => {
              setLoading(true);
              fetch(`/api/search?q=${encodeURIComponent(decodedCategory)}`)
                     .then(res => res.json())
                     .then(data => {
                            setResults(data.results || []);
                            setLoading(false);
                     })
                     .catch(err => {
                            console.error('Failed to fetch category results:', err);
                            setLoading(false);
                     });
       }, [decodedCategory]);

       const isHealth = decodedCategory.toLowerCase().includes('health') || decodedCategory.toLowerCase().includes('fitness');
       const isSpa = decodedCategory.toLowerCase().includes('spa') || decodedCategory.toLowerCase().includes('salon');
       const isClothing = decodedCategory.toLowerCase().includes('clothing') || decodedCategory.toLowerCase().includes('fashion');

       const getHeroDetails = () => {
              if (isHealth) return {
                     title: 'Health & Fitness',
                     subtitle: 'Premium gyms, yoga studios, and fitness experts near you.',
                     icon: <Activity className="text-white" size={32} />,
                     gradient: 'from-blue-600 to-cyan-500',
                     image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80'
              };
              if (isSpa) return {
                     title: 'Spa & Salon',
                     subtitle: 'Relax and rejuvenate with the best beauty and wellness experts.',
                     icon: <Scissors className="text-white" size={32} />,
                     gradient: 'from-purple-600 to-pink-500',
                     image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80'
              };
              if (isClothing) return {
                     title: 'Top Clothing Merchants',
                     subtitle: 'Exclusive fashion, traditional wear, and trendy collections.',
                     icon: <Shirt className="text-white" size={32} />,
                     gradient: 'from-amber-600 to-orange-500',
                     image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
              };
              return {
                     title: decodedCategory,
                     subtitle: `Discover the best ${decodedCategory} shops and services in your area.`,
                     icon: <ShoppingBag className="text-white" size={32} />,
                     gradient: 'from-slate-800 to-slate-900',
                     image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'
              };
       };

       const hero = getHeroDetails();

       return (
              <div className="min-h-screen bg-slate-50">
                     <Header
                            onMenuClick={() => setIsSidebarOpen(true)}
                            onProfileClick={() => router.push('/settings')}
                            onNotificationClick={() => router.push('/notifications')}
                     />

                     {/* Premium Hero Section */}
                     <div className={`relative h-[60vh] min-h-[400px] overflow-hidden`}>
                            <Image
                                   src={hero.image}
                                   alt={hero.title}
                                   fill
                                   className="object-cover"
                                   priority
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent`} />

                            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-20 max-w-7xl mx-auto w-full">
                                   <div className="flex flex-col items-start gap-6 max-w-3xl">
                                          <button
                                                 onClick={() => router.back()}
                                                 className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all mb-4"
                                          >
                                                 <ArrowLeft size={16} /> Back to explore
                                          </button>

                                          <div className="flex items-center gap-4">
                                                 <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${hero.gradient} flex items-center justify-center shadow-2xl`}>
                                                        {hero.icon}
                                                 </div>
                                                 <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                                                        <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Verified Partner</span>
                                                 </div>
                                          </div>

                                          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                                                 {hero.title}
                                          </h1>
                                          <p className="text-white/80 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
                                                 {hero.subtitle}
                                          </p>

                                          <div className="flex flex-wrap gap-4 mt-4">
                                                 <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white text-sm font-bold border border-white/10">
                                                        <Zap className="text-yellow-400" size={16} />
                                                        <span>Instant Booking</span>
                                                 </div>
                                                 <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white text-sm font-bold border border-white/10">
                                                        <Star className="text-orange-400 fill-orange-400" size={16} />
                                                        <span>Top Rated Locals</span>
                                                 </div>
                                          </div>
                                   </div>
                            </div>
                     </div>

                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            {/* Stats / Highlights */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                                   {[
                                          { label: 'Total Partners', value: '50+', icon: <ShoppingBag size={20} className="text-blue-500" /> },
                                          { label: 'Happy Customers', value: '1.2k+', icon: <CheckCircle2 size={20} className="text-green-500" /> },
                                          { label: 'Avg Rating', value: '4.8', icon: <Star size={20} className="text-orange-500" /> },
                                          { label: 'State-wise Sales', value: 'Active', icon: <TrendingUp size={20} className="text-red-500" /> },
                                   ].map((stat, i) => (
                                          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        {stat.icon}
                                                 </div>
                                                 <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                                          </div>
                                   ))}
                            </div>

                            {/* Filters & Results */}
                            <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                                   <div>
                                          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Handpicked Partners</h2>
                                          <p className="text-slate-500 font-medium">Verified local merchants offering the best prices</p>
                                   </div>

                                   <div className="flex items-center gap-3">
                                          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-600 flex items-center gap-2">
                                                 <Clock size={16} /> Open Now
                                          </div>
                                          <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-black flex items-center gap-2">
                                                 <MapPin size={16} /> Near Me
                                          </div>
                                   </div>
                            </div>

                            {loading ? (
                                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                                 <div key={i} className="aspect-[3/4] bg-slate-200 animate-pulse rounded-[2.5rem]" />
                                          ))}
                                   </div>
                            ) : results.length > 0 ? (
                                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                          {results.map((business) => (
                                                 <BusinessCard
                                                        key={business.id}
                                                        business={business}
                                                        onClick={() => router.push(`/vendor/${business.id}`)}
                                                 />
                                          ))}
                                   </div>
                            ) : (
                                   <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                                          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                                 <ShoppingBag className="text-slate-300" size={40} />
                                          </div>
                                          <h3 className="text-2xl font-black text-slate-900 mb-2">No results in this area</h3>
                                          <p className="text-slate-500 font-medium max-w-xs mx-auto">We're expanding rapidly! Check back soon or try another location.</p>
                                   </div>
                            )}
                     </div>

                     <Sidebar
                            isOpen={isSidebarOpen}
                            onClose={() => setIsSidebarOpen(false)}
                            onNavigate={(tab) => {
                                   setIsSidebarOpen(false);
                                   if (tab === 'home') router.push('/');
                            }}
                            userRole="customer"
                     />
              </div>
       );
}
