'use client';

import { MapPin, Star, Clock } from 'lucide-react';
import { NEARBY_BUSINESSES } from '@/lib/data';
import Image from 'next/image';

interface NearbySectionProps {
  onBusinessClick: (businessId: string) => void;
}

export default function NearbySection({ onBusinessClick }: NearbySectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-orange-500 rounded" />
        <h2 className="text-white text-xl font-bold">Nearby Businesses</h2>
      </div>
      <div className="space-y-3">
        {NEARBY_BUSINESSES.slice(0, 3).map((business) => (
          <button
            key={business.id}
            onClick={() => onBusinessClick(business.id)}
            className="w-full flex gap-3 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={business.imageUrl}
                alt={business.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-white font-semibold mb-1">{business.name}</h3>
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <MapPin size={14} />
                <span>{business.distance}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Star className="text-yellow-400 fill-yellow-400" size={14} />
                <span>{business.rating}</span>
                <span className="text-white/60">({business.reviewCount})</span>
                <Clock size={14} className="ml-2" />
                <span>{business.openTime}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

