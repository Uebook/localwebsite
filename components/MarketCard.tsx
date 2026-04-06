'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Store } from 'lucide-react';
import { motion } from 'framer-motion';

interface MarketCardProps {
  name: string;
  shops: number;
  icon?: string | null;
  href: string;
  className?: string;
}

export default function MarketCard({ name, shops, icon, href, className }: MarketCardProps) {
  // Default placeholder icon if none provided
  const imageUrl = icon || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

  return (
    <Link href={href} className={`block group ${className}`}>
      <motion.div
        whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
        className="relative bg-white border-2 border-slate-50 rounded-[2rem] p-4 flex flex-col items-center transition-all duration-300 h-full shadow-sm group-hover:border-orange-100"
      >
        {/* Market Visual */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-50 shadow-inner mb-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Title */}
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight text-center leading-tight line-clamp-2 min-h-[2rem] mb-1 group-hover:text-orange-500 transition-colors">
          {name}
        </h3>

        {/* Shop Stats */}
        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[9px] uppercase tracking-widest mb-3">
          <Store size={10} className="text-orange-400" />
          <span>{shops} Shops</span>
        </div>

        {/* Navigation Button */}
        <div className="mt-auto w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-300">
          <ChevronRight size={14} strokeWidth={3} />
        </div>
      </motion.div>
    </Link>
  );
}
