'use client';

import { MapPin, Star, Clock, CheckCircle, Package, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { addToCart } from '@/lib/cart';
import { useState } from 'react';

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    distance: string;
    imageUrl: string;
    address?: string;
    openTime?: string;
    isVerified?: boolean;
    avgOnlinePrice?: number;
    avgOfflinePrice?: number;
  };
  onClick?: () => void;
  variant?: 'default' | 'flat';
}

export default function BusinessCard({ business, onClick, variant = 'default' }: BusinessCardProps) {
  const [added, setAdded] = useState(false);
  const router = useRouter();

  // Check if it's a service (simplified list)
  const isService = business.category.toLowerCase().includes('service') ||
    business.category.toLowerCase().includes('repair') ||
    business.category.toLowerCase().includes('spa') ||
    business.category.toLowerCase().includes('salon');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: business.id + '_gen',
      vendorId: business.id,
      vendorName: business.name,
      name: `Shopping from ${business.name}`,
      price: business.avgOfflinePrice || 0,
      quantity: 1,
      image: business.imageUrl
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const imgUrl = business.imageUrl ||
    (business as any).profile_image_url ||
    (business as any).image_url ||
    (business as any).image ||
    (business as any).shop_front_photo_url ||
    'https://images.unsplash.com/photo-1574310391921-4b130467b2bb?auto=format&fit=crop&w=800&q=80';

  const CardContent = (
    <motion.div
      whileHover={variant === 'default' ? { y: -8 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group relative bg-white overflow-hidden h-full flex flex-col ${variant === 'default'
          ? 'rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40'
          : 'rounded-none border-none shadow-none'
        }`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imgUrl}
          alt={business.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {business.isVerified && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/20">
              <CheckCircle size={12} className="text-blue-500 fill-blue-500/10" strokeWidth={3} />
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Verified</span>
            </div>
          )}
          {business.avgOnlinePrice && business.avgOfflinePrice && business.avgOnlinePrice > business.avgOfflinePrice && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-white rounded-full shadow-lg border border-emerald-400/20 animate-pulse">
              <span className="text-[10px] font-black uppercase tracking-tight">Save ₹{business.avgOnlinePrice - business.avgOfflinePrice}</span>
            </div>
          )}
        </div>

        {/* Distance Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white/90 border border-white/10">
            <MapPin size={10} className="text-primary" />
            <span className="text-[10px] font-bold">{business.distance || 'Near you'}</span>
          </div>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block">
              {business.category}
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {business.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
            <Star className="text-amber-500 fill-amber-500" size={12} />
            <span className="text-xs font-black text-amber-700">{business.rating > 0 ? business.rating : 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-6">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {business.openTime || '09:00 - 21:00'}
          </span>
          <div className="w-1 h-1 bg-slate-200 rounded-full" />
          <span>{business.reviewCount || 0} Reviews</span>
        </div>

        <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
          {!isService ? (
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${added ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-primary shadow-slate-200'
                }`}
            >
              {added ? (
                <>
                  <CheckCircle size={14} /> Added
                </>
              ) : (
                <>
                  <Package size={14} /> Add to Basket
                </>
              )}
            </button>
          ) : (
            <button
              className="flex-1 h-10 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onClick) onClick(); else router.push(`/vendor/${business.id}`); }}
            >
              View Services
            </button>
          )}

          <div className="ml-4 p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const vendorId = business.id || (business as any).vendor_id;
  // Final safety check: if ID is numeric and looks like mock data, we might want to prevent it or track it.
  // For now, let's just use the ID we have.

  if (onClick) {
    return (
      <div onClick={onClick} className="h-full cursor-pointer">
        {CardContent}
      </div>
    );
  }

  return (
    <Link href={`/vendor/${vendorId}`} className="h-full block">
      {CardContent}
    </Link>
  );
}

