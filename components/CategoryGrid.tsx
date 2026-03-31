'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ShoppingBag, Smartphone, Shirt, Pill, Zap, Home, Headphones, Trophy, Apple, Droplet, Gift, Camera, Music, Activity, Gamepad, Car, Bike, Palette, Square, Layers, Bed, Image as ImageIcon, Sun, Utensils, Box, Star, Package, Heart, Leaf, Eye, Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import { ALL_CATEGORIES, TOP_9_CATEGORIES } from '@/lib/categories';
import Image from 'next/image';

interface CategoryGridProps {
  onCategorySelect: (categoryName: string) => void;
  variant?: 'light' | 'dark';
  showAll?: boolean;
  categories?: any[];
  hideButton?: boolean;
}

const iconMap: Record<string, any> = {
  ShoppingBag, Smartphone, Shirt, Pill, Zap, Home,
  FileText: Headphones,
  Tool: Trophy,
  Apple, Droplet, Gift, Camera, Music, Activity, Gamepad, Car, Bike,
  Circle: Square,
  Palette, Square, Layers, Bed, Image: ImageIcon, Sun, Utensils, Box, Star, Package, Heart, Leaf, Eye, Monitor,
  Drumstick: Gift,
  Fish: Droplet,
  Sparkles: Star,
  Wind: Activity,
  Gem: Star,
  Footprints: Activity,
  Toy: Gift,
  Briefcase: Box,
  Clock: Activity,
};

// Subtle colored icon backgrounds per category index
const iconColors = [
  { bg: 'bg-orange-50', text: 'text-orange-500' },
  { bg: 'bg-blue-50', text: 'text-blue-500' },
  { bg: 'bg-green-50', text: 'text-green-600' },
  { bg: 'bg-purple-50', text: 'text-purple-500' },
  { bg: 'bg-rose-50', text: 'text-rose-500' },
  { bg: 'bg-amber-50', text: 'text-amber-500' },
  { bg: 'bg-teal-50', text: 'text-teal-600' },
  { bg: 'bg-indigo-50', text: 'text-indigo-500' },
];

export default function CategoryGrid({
  onCategorySelect,
  variant = 'light',
  showAll: initialShowAll = false,
  categories,
  hideButton = false
}: CategoryGridProps) {
  const [isExpandedState, setIsExpandedState] = useState(initialShowAll);

  const isExpanded = initialShowAll || isExpandedState;
  const router = useRouter();

  const handleCategoryClick = (categoryName: string) => {
    // Slugify category name for pretty URLs
    const slug = categoryName.toLowerCase()
      .replace(/ \/ /g, '-')
      .replace(/ & /g, '-')
      .replace(/ /g, '-');

    router.push(`/${slug}`);
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
  };

  const baseCategories = categories || ALL_CATEGORIES;
  const categoriesToShow = isExpanded
    ? baseCategories
    : baseCategories.slice(0, 9);

  const isDark = variant === 'dark';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
        {categoriesToShow.map((category: any, i: number) => {
          const Icon = iconMap[category.iconName] || ShoppingBag;
          const color = iconColors[i % iconColors.length];
          const hasImage = !!category.imageUrl;

          if (isDark) {
            // Dark variant for use on colored backgrounds
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="group relative flex flex-col items-center justify-center gap-4 p-6 rounded-3xl transition-all duration-400 hover:-translate-y-1 min-h-[170px] overflow-hidden reveal bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="relative p-4 rounded-2xl bg-white/20 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-bold text-white text-center line-clamp-2 leading-tight">
                  {category.name}
                </span>
              </button>
            );
          }

          // Premium Light Variant Card (Image-centric)
          return (
            <button
              key={category.id || category.name}
              onClick={() => onCategorySelect(category.name)}
              className="group relative flex flex-col items-start justify-end gap-0 rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] min-h-[180px] overflow-hidden reveal bg-white border border-slate-100 shadow-sm"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {/* Background Image with High Transparency Overlay */}
              <div className="absolute inset-0 z-0">
                {hasImage ? (
                  <>
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className={`w-full h-full ${color.bg} opacity-30`} />
                )}
              </div>

              {/* Icon (Floating Top Right) */}
              <div className={`absolute top-5 right-5 z-20 p-2 rounded-xl transition-all duration-500 shadow-sm bg-white/80 backdrop-blur-sm text-slate-400 group-hover:text-primary group-hover:scale-110 group-hover:rotate-6 border border-slate-50 w-10 h-10 flex items-center justify-center overflow-hidden`}>
                {category.iconUrl ? (
                  <img src={category.iconUrl} alt="" className="w-full h-full object-contain" />
                ) : (
                  <Icon size={20} strokeWidth={2} />
                )}
              </div>

              {/* Label & Content */}
              <div className="relative z-10 w-full p-5 text-left">
                {/* Category Badge */}
                <span className="inline-block px-2 py-0.5 bg-blue-100/80 text-[9px] font-black text-blue-500 uppercase tracking-widest rounded-md mb-2 transform transition-all duration-500 group-hover:translate-x-1">
                  Category
                </span>

                <h3 className="text-base font-black text-slate-800 leading-tight transition-all duration-500 group-hover:translate-x-1 line-clamp-2 mb-3">
                  {category.name}
                </h3>

                {/* Decorative Green Bar */}
                <div className="h-1 w-6 bg-green-600 rounded-full transition-all duration-500 group-hover:w-12" />
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 z-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </button>
          );
        })}
      </div>

      {!hideButton && !initialShowAll && baseCategories.length > 9 && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setIsExpandedState(!isExpandedState)}
            className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            {isExpandedState ? (
              <>
                <ChevronUp size={20} className="transition-transform group-hover:-translate-y-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={20} className="transition-transform group-hover:translate-y-1" />
                Explore {baseCategories.length - 9} More Categories
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
