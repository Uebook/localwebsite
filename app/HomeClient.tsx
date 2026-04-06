'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BusinessCard from '@/components/BusinessCard';
import CategoryCard from '@/components/CategoryCard';
import PromoCarousel from '@/components/PromoCarousel';
import { Search, MapPin, TrendingUp, Star, ShieldCheck, Zap, Tag, ChevronRight, TrendingDown, Store, Home as HomeIcon } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocation } from '@/lib/hooks';
import CategoryGrid from '@/components/CategoryGrid';
import SalesSection from '@/components/SalesSection';
import BusinessCardCompact from '@/components/BusinessCardCompact';
import SearchSuggestions from '@/components/SearchSuggestions';
import MarketCard from '@/components/MarketCard';

// ──────────────────────────────────────────
// Fallback / Initial Empty States
// ──────────────────────────────────────────
const INITIAL_POPULAR_SEARCHES = [
  { label: 'Milk', icon: '🥛' },
  { label: 'Oil', icon: '🫙' },
  { label: 'Rice', icon: '🍚' },
  { label: 'Atta', icon: '🌾' }
];

interface HomeClientProps {
  initialCategories: any[];
}

export default function HomeClient({ initialCategories }: HomeClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [popularSearches, setPopularSearches] = useState<any[]>(INITIAL_POPULAR_SEARCHES);
  const [marketsByCity, setMarketsByCity] = useState<Record<string, any[]>>({});
  const [todayDeals, setTodayDeals] = useState<any[]>([]);
  const [megaSavings, setMegaSavings] = useState<any[]>([]);
  const [priceDrops, setPriceDrops] = useState<any[]>([]);
  const [verifiedShops, setVerifiedShops] = useState<any[]>([]);
  const [dbCircles, setDbCircles] = useState<any[]>([]);
  const [loadingCircles, setLoadingCircles] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Search Suggestions State
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { location: locationState, detectLocation } = useLocation();
  const router = useRouter();

  const cityDisplay = locationState.city
    ? locationState.city.split(',')[0].trim()
    : 'Detecting...';
  const areaDisplay = locationState.city || 'Detecting location...';

  useEffect(() => {
    // Check auth
    const rawUser = localStorage.getItem('localmarket_user');
    const rawVendor = localStorage.getItem('localmarket_vendor');
    if (rawUser) {
      try { setUser({ ...JSON.parse(rawUser), role: 'customer' }); } catch { }
    } else if (rawVendor) {
      try { setUser({ ...JSON.parse(rawVendor), role: 'vendor' }); } catch { }
    }

    const parts = locationState.city.split(',').map(p => p.trim());
    const detectedCity = parts.length >= 2 ? parts[1] : (parts[0] || '');
    const detectedCircle = parts.length >= 2 ? parts[0] : '';

    const cityParam = detectedCity ? `&city=${encodeURIComponent(detectedCity)}` : '';
    const circleParam = detectedCircle ? `&circle=${encodeURIComponent(detectedCircle)}` : '';

    // Fetch dynamic markets
    fetch('/api/markets')
      .then(res => res.json())
      .then(data => setMarketsByCity(data.marketsByCity || {}))
      .catch(err => console.error('Failed to fetch markets:', err));

    // Fetch trending searches
    const trendingUrl = `/api/trending?city=${encodeURIComponent(detectedCity)}`;
    fetch(trendingUrl)
      .then(res => res.json())
      .then(data => setPopularSearches(data.trending || INITIAL_POPULAR_SEARCHES))
      .catch(() => setPopularSearches(INITIAL_POPULAR_SEARCHES));

    if (detectedCity || detectedCircle) {
      // Background data fetching for sections
      fetch(`/api/search?q=verified${cityParam}${circleParam}`)
        .then(res => res.json())
        .then(data => setVerifiedShops((data.results || []).slice(0, 4)))
        .catch(() => setVerifiedShops([]));

      fetch(`/api/search?q=offers${cityParam}${circleParam}`)
        .then(res => res.json())
        .then(data => {
          const results = data.results || [];
          const mapped = results.slice(0, 4).map((v: any) => ({
            id: v.id,
            name: v.matchingProducts?.[0]?.name || `${v.category_name} Items`,
            price: `₹${v.matchingProducts?.[0]?.price || '99'}`,
            shop: v.name || v.shop_name,
            distance: v.distance || 'Near you',
            savings: 'Special Price',
            tag: 'Hot Deal'
          }));
          setTodayDeals(mapped);
        })
        .catch(() => setTodayDeals([]));

      fetch(`/api/search?q=megasavings${cityParam}${circleParam}`)
        .then(res => res.json())
        .then(data => {
          const results = data.results || [];
          const seenVendors = new Set();
          const mapped = results
            .filter((v: any) => {
              if (!v.id || seenVendors.has(v.id)) return false;
              seenVendors.add(v.id);
              return true;
            })
            .slice(0, 4)
            .map((v: any) => ({
              id: v.id,
              name: v.matchingProducts?.[0]?.name || v.name || v.shop_name,
              online: v.avgOnlinePrice || 1000,
              offline: v.avgOfflinePrice || 800,
              shop: v.name || v.shop_name,
              distance: v.distance || 'Near you',
              imageUrl: v.matchingProducts?.[0]?.image || v.imageUrl || v.image_url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'
            }));
          setMegaSavings(mapped);
        })
        .catch(() => setMegaSavings([]));

      fetch(`/api/search?q=pricedrops${cityParam}${circleParam}`)
        .then(res => res.json())
        .then(data => {
          const results = data.results || [];
          const seenProducts = new Set();
          const mapped = results
            .filter((v: any) => {
              const pId = v.matchingProducts?.[0]?.id;
              if (!v.id || !pId || seenProducts.has(pId)) return false;
              seenProducts.add(pId);
              return true;
            })
            .slice(0, 4)
            .map((v: any) => {
              const p = v.matchingProducts?.[0] || {};
              const oldPrice = p.mrp || (p.price * 1.2);
              const newPrice = p.price;
              const pct = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
              return {
                id: `${v.id}-${p.id}`,
                productId: p.id,
                name: p.name || v.name,
                old: `₹${Math.round(oldPrice)}`,
                new: `₹${Math.round(newPrice)}`,
                pct: `${pct}%`,
                vendorId: v.id
              };
            });
          setPriceDrops(mapped);
        })
        .catch(() => setPriceDrops([]));

      setLoadingCircles(true);
      fetch(`/api/circles?city=${encodeURIComponent(detectedCity || detectedCircle)}`)
        .then(res => res.json())
        .then(data => setDbCircles(data.circles || []))
        .catch(() => setDbCircles([]))
        .finally(() => setLoadingCircles(false));
    }
  }, [locationState.city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const bestCircle = dbCircles[0] || { name: 'Local Markets', color: 'from-orange-500 to-amber-400', emoji: '🏛️' };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        locationState={locationState}
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => router.push('/settings')}
        onNotificationClick={() => router.push('/notifications')}
      />

      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Location</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-slate-900 leading-none">{cityDisplay}</p>
                <span className="text-slate-300 text-xs">·</span>
                <p className="text-xs font-semibold text-slate-500 leading-none truncate max-w-[150px] sm:max-w-none">{areaDisplay}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => detectLocation()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-orange-600 transition-all shadow-sm shadow-orange-200 active:scale-95"
          >
            <MapPin size={10} />
            Change
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mt-6 mb-2">
          <Link href={`/market/${encodeURIComponent(bestCircle.name)}`} className={`block relative overflow-hidden rounded-3xl bg-gradient-to-r ${bestCircle.color} shadow-xl shadow-orange-200/60 p-6 cursor-pointer hover:-translate-y-1 transition-all duration-300`}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/4 translate-x-1/4" />
            <div className="absolute bottom-0 right-16 w-24 h-24 bg-white/10 rounded-full translate-y-1/3" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Today's Best Price Area</span>
                </div>
                <h2 className="text-4xl font-black text-white mb-1 tracking-tight">{bestCircle.name}</h2>
                <p className="text-white/85 font-semibold text-sm">Top deals across all markets in this area</p>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-4 py-2">
                  <span className="text-white text-xs font-bold">Explore Area</span>
                  <ChevronRight size={13} className="text-white" />
                </div>
              </div>
              <div className="text-7xl opacity-25 select-none w-24 h-24 flex items-center justify-center">
                {bestCircle.emoji || '🏷️'}
              </div>
            </div>
          </Link>
        </div>

        <div className="my-6" ref={searchContainerRef}>
          <form onSubmit={handleSearch} className="relative group">
            <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-lg shadow-slate-200/80 border-2 border-slate-100 group-focus-within:border-orange-300 transition-all duration-300">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="text-orange-400" size={22} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  placeholder="mention name of the article you need"
                  autoComplete="off"
                  className="flex-1 py-3.5 outline-none text-slate-900 font-bold placeholder-slate-400 bg-transparent text-base"
                />
              </div>
              <button type="submit" className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-orange-600 transition-all">
                Search
              </button>
            </div>
            <SearchSuggestions
              suggestions={suggestions}
              isLoading={isSearching}
              isVisible={showSuggestions}
              onSelect={(item: any) => {
                setSearchQuery(item.name);
                setShowSuggestions(false);
                if (item.type === 'category') router.push(`/search?q=${encodeURIComponent(item.name)}`);
                else router.push(`/vendor/${item.vendor_id || item.vendor?.id}`);
              }}
            />
          </form>
        </div>

        {/* Neighborhood Markets */}
        {!loadingCircles && (dbCircles.length > 0 || Object.keys(marketsByCity).length > 0) && (
          <div className="space-y-10 my-10">
            {Object.entries(
              dbCircles.length > 0
                ? dbCircles.reduce((acc: Record<string, any[]>, circle) => {
                  const area = circle.town || circle.city || 'Other Areas';
                  if (!acc[area]) acc[area] = [];
                  acc[area].push(circle);
                  return acc;
                }, {})
                : (marketsByCity[cityDisplay] ? { [cityDisplay]: marketsByCity[cityDisplay] } : {})
            ).map(([area, areaCircles]: [string, any[]]) => (
              <section key={area} className="relative">
                <div className="flex items-center gap-4 mb-5">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] bg-white pr-4 relative z-10">{area}</h3>
                  <div className="h-[2px] w-full bg-slate-100 absolute top-1/2 left-0 -translate-y-1/2" />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-4 sm:gap-6">
                  {areaCircles.map((circle: any) => (
                    <MarketCard
                      key={circle.name}
                      name={circle.name}
                      shops={circle.shops || 0}
                      icon={circle.icon || circle.imageUrl}
                      href={`/market/${encodeURIComponent(circle.name)}`}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Categories Section */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">📂 Categories</h2>
          </div>
          <CategoryGrid onCategorySelect={(name) => router.push(`/search?q=${encodeURIComponent(name)}`)} categories={categories} />
        </section>

        <SalesSection />

        {/* Deals and Sections */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900">🏷️ Today's Deals Near You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {todayDeals.map((deal) => (
              <Link key={deal.id} href={`/vendor/${deal.id}`} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:-translate-y-1 transition-all group">
                <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg mb-2 inline-block">{deal.tag}</span>
                <p className="font-bold text-slate-800 text-sm mb-1">{deal.name}</p>
                <p className="text-2xl font-black text-orange-500 mb-2">{deal.price}</p>
                <p className="text-xs font-semibold text-slate-500">{deal.shop}</p>
              </Link>
            ))}
          </div>
        </section>

        <PromoCarousel />

        {/* Verified Shops */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-500" /> Verified Shops
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {verifiedShops.map((shop) => (
              <Link key={shop.id} href={`/vendor/${shop.id}`}>
                <BusinessCardCompact business={{ ...shop, name: shop.shop_name || shop.name, isVerified: true }} />
              </Link>
            ))}
          </div>
        </section>

        {/* Price Drops */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-900">📉 Price Drops</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {priceDrops.map((item) => (
              <Link key={item.id} href={`/vendor/${item.vendorId}`} className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-1 mb-2">
                  <TrendingDown size={13} className="text-red-500" />
                  <span className="text-xs font-black text-red-500">{item.pct} drop</span>
                </div>
                <p className="font-bold text-slate-800 text-sm mb-2 h-10 line-clamp-2">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-slate-400">{item.old}</span>
                  <span className="text-lg font-black text-green-600">{item.new}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mega Savings */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp size={24} className="text-green-500" /> Mega Savings: Local vs Online
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {megaSavings.map((item) => (
              <Link key={item.id} href={`/vendor/${item.id}`}>
                <BusinessCard business={{ ...item, category: 'Savings' }} />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(tab) => {
          setIsSidebarOpen(false);
          router.push(`/${tab}`);
        }}
        userRole={user?.role || 'customer'}
        userName={user?.name || 'Guest User'}
      />
    </div>
  );
}
