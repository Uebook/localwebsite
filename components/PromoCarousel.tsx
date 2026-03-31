'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PROMO_BANNERS } from '@/lib/data';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [banners, setBanners] = useState<any[]>(PROMO_BANNERS);

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (data.banners && data.banners.length > 0) {
          // Map the API structure slightly to fit the UI gracefully
          const apiBanners = data.banners.map((b: any) => ({
            id: b.id,
            title: b.title,
            subtitle: "Exclusive Local Offer", // Default fallback subtitle since DB doesn't have it
            imageUrl: b.imageUrl,
            ctaText: "Claim Now", // Default
            link: b.linkUrl || "#"
          }));
          setBanners(apiBanners);
        }
      })
      .catch(err => console.error('Failed to fetch banners:', err));
  }, []);

  useEffect(() => {
    if (isHovered || banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[300px] sm:h-[400px] md:h-[450px] rounded-[2rem] overflow-hidden shadow-2xl shadow-orange-500/10">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 scale-100 translate-x-0 z-10' : 'opacity-0 scale-105 translate-x-4 z-0'
              }`}
          >
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 md:px-20 text-white">
              <div className={`transition-all duration-700 delay-300 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <span className="inline-block px-4 py-1 bg-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-primary/20">
                  Featured Offer
                </span>
                <h3 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tighter leading-none max-w-2xl">
                  {banner.title}
                </h3>
                <p className="text-slate-200 text-sm sm:text-lg md:text-xl mb-8 max-w-xl font-medium leading-relaxed">
                  {banner.subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl hover:-translate-y-1">
                    {banner.ctaText}
                  </button>
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none z-20">
        <button
          onClick={prev}
          className="pointer-events-auto p-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <button
          onClick={next}
          className="pointer-events-auto p-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
        >
          <ChevronRight size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex
              ? 'w-12 bg-white'
              : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
