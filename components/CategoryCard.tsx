'use client';

import { ShoppingBag, Smartphone, Shirt, Pill, Zap, Home, Headphones, Trophy, Apple, Droplet, Gift, Camera, Music, Activity, Gamepad, Car, Bike, Palette, Square, Layers, Bed, Image, Sun, Utensils, Box, Star, Package, Heart, Leaf, Eye, Monitor } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    iconName: string;
  };
  onSelect: (name: string) => void;
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

export default function CategoryCard({ category, onSelect }: CategoryCardProps) {
  const Icon = iconMap[category.iconName] || ShoppingBag;

  return (
    <button
      onClick={() => onSelect(category.name)}
      className="flex flex-col items-center gap-4 p-5 bg-white rounded-2xl shadow-sm border border-slate-50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group w-full active:scale-95"
    >
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
        <Icon className="text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all duration-300" size={32} />
      </div>
      <span className="font-black text-slate-800 text-xs sm:text-xs uppercase tracking-widest text-center line-clamp-2 w-full px-1">
        {category.name}
      </span>
    </button>
  );
}

