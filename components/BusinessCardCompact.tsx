'use client';

import { MapPin, Star, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface BusinessCardCompactProps {
       business: {
              id: string;
              name: string;
              category: string;
              rating: number;
              reviewCount: number;
              distance: string;
              imageUrl: string;
              isVerified?: boolean;
       };
       onClick?: () => void;
}

export default function BusinessCardCompact({ business, onClick }: BusinessCardCompactProps) {
       const router = useRouter();

       const imgUrl = business.imageUrl ||
              'https://images.unsplash.com/photo-1574310391921-4b130467b2bb?auto=format&fit=crop&w=800&q=80';

       const CardContent = (
              <motion.div
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center p-3 gap-4"
              >
                     {/* Small Left Image */}
                     <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                                   src={imgUrl}
                                   alt={business.name}
                                   fill
                                   className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {business.isVerified && (
                                   <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-md p-1 rounded-lg shadow-sm border border-white/20">
                                          <CheckCircle size={8} className="text-blue-500" strokeWidth={3} />
                                   </div>
                            )}
                     </div>

                     {/* Info on Right */}
                     <div className="flex-1 min-w-0 py-1">
                            <div className="flex items-center gap-2 mb-1">
                                   <span className="text-[9px] font-black text-primary uppercase tracking-widest truncate">
                                          {business.category}
                                   </span>
                                   <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-md">
                                          <Star className="text-amber-500 fill-amber-500" size={8} />
                                          <span className="text-[10px] font-black text-amber-700">{business.rating || '4.5'}</span>
                                   </div>
                            </div>

                            <h3 className="text-sm font-black text-slate-900 leading-tight mb-1 truncate">
                                   {business.name}
                            </h3>

                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                   <span className="flex items-center gap-1">
                                          <MapPin size={10} className="text-slate-300" />
                                          {business.distance || 'Near you'}
                                   </span>
                                   <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                   <span>{business.reviewCount || 48} Reviews</span>
                            </div>
                     </div>

                     <div className="pr-1 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                            <ChevronRight size={18} />
                     </div>
              </motion.div>
       );

       const vendorId = business.id;

       if (onClick) {
              return (
                     <div onClick={onClick} className="cursor-pointer">
                            {CardContent}
                     </div>
              );
       }

       return (
              <Link href={`/vendor/${vendorId}`} className="block">
                     {CardContent}
              </Link>
       );
}
