'use client';

import { ShoppingBag, Smartphone, Shirt, Pill, Zap, Home, Headphones, Trophy, Apple, Droplet, Gift, Camera, Music, Activity, Gamepad, Car, Bike, Palette, Square, Layers, Bed, Image, Sun, Utensils, Box, Star, Package, Heart, Leaf, Eye, Monitor } from 'lucide-react';
import Link from 'next/link';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    iconName: string;
  };
  // onSelect remains as an optional prop if needed, but we'll prioritize href
  onSelect?: (name: string) => void;
  href?: string;
}

const iconMap: Record<string, any> = {
  ShoppingBag,
  Smartphone,
  Shirt,
  Pill,
  Zap,
  Home,
  FileText: Headphones,
  Tool: Trophy,
  Apple,
  Droplet,
  Gift,
  Camera,
  Music,
  Activity,
  Gamepad,
  Car,
  Bike,
  Circle: Square,
  Palette,
  Square,
  Layers,
  Bed,
  Image,
  Sun,
  Utensils,
  Box,
  Star,
  Package,
  Heart,
  Leaf,
  Eye,
  Monitor,
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

export default function CategoryCard({ category, onSelect, href }: CategoryCardProps) {
  const Icon = iconMap[category.iconName] || ShoppingBag;
  const targetHref = href || `/search?q=${encodeURIComponent(category.name)}`;

  return (
    <Link
      href={targetHref}
      onClick={() => onSelect?.(category.name)}
      className="flex flex-col items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-slate-50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group w-full active:scale-95"
    >
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
        <Icon className="text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all duration-300" size={32} />
      </div>
      <span className="font-black text-slate-800 text-xs sm:text-xs uppercase tracking-widest text-center line-clamp-2 w-full px-1">
        {category.name}
      </span>
    </Link>
  );
}

