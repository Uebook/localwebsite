'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BusinessCard from '@/components/BusinessCard';
import CategoryCard from '@/components/CategoryCard';
import PromoCarousel from '@/components/PromoCarousel';
import { Search, MapPin, TrendingUp, Star, ShieldCheck, Zap, Tag, ChevronRight, TrendingDown, Mic, Store, Home as HomeIcon } from 'lucide-react';
import { NEARBY_BUSINESSES, FEATURED_BUSINESSES, HOME_SERVICES, RECENT_SEARCHES } from '@/lib/data';
import { TOP_9_CATEGORIES } from '@/lib/categories';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocation } from '@/lib/hooks';
import CategoryGrid from '@/components/CategoryGrid';
import SalesSection from '@/components/SalesSection';
import BusinessCardCompact from '@/components/BusinessCardCompact';
import SearchSuggestions from '@/components/SearchSuggestions';

// ──────────────────────────────────────────
// Fallback / Initial Empty States
// ──────────────────────────────────────────
const INITIAL_POPULAR_SEARCHES = [
  { label: 'Milk', icon: '🥛' },
  { label: 'Oil', icon: '🫙' },
  { label: 'Rice', icon: '🍚' },
  { label: 'Atta', icon: '🌾' }
];

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
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

  // Rotating placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = [
    "What is on your mind today?",
    "How you want to shell out?",
    "How you want to see your local market?",
    "Search products, markets or shops..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('localmarket_location');
    if (!saved) detectLocation();
  }, [detectLocation]);

  useEffect(() => {
    // Check auth
    const rawUser = localStorage.getItem('localmarket_user');
    const rawVendor = localStorage.getItem('localmarket_vendor');
    if (rawUser) {
      try { setUser({ ...JSON.parse(rawUser), role: 'customer' }); } catch { }
    } else if (rawVendor) {
      try { setUser({ ...JSON.parse(rawVendor), role: 'vendor' }); } catch { }
    }

    // Extract City and Circle from location string
    // locationState.city is often "Area/Circle, City, State"
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

    // Fetch live verified shops
    if (detectedCity || detectedCircle) {
      fetch(`/api/search?q=verified${cityParam}${circleParam}`)
        .then(res => res.json())
        .then(data => setVerifiedShops((data.results || []).slice(0, 4)))
        .catch(err => console.error('Failed to fetch verified shops:', err));

      // Fetch live deals
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

      // Fetch mega savings
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
              image: v.imageUrl || v.image_url || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80'
            }));
          setMegaSavings(mapped);
        })
        .catch(() => setMegaSavings([]));

      // Fetch live price drops
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
                id: `${v.id}-${p.id}`, // Guaranteed unique composite key
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

      // Fetch live circles for current area
      setLoadingCircles(true);
      const queryCity = detectedCity || detectedCircle;
      fetch(`/api/circles?city=${encodeURIComponent(queryCity)}`)
        .then(res => res.json())
        .then(data => setDbCircles(data.circles || []))
        .catch(err => console.error('Failed to fetch circles:', err))
        .finally(() => setLoadingCircles(false));
    }
  }, [locationState.city]);

  // Handle Dynamic Search Suggestions
  useEffect(() => {
    console.log('Search useEffect triggered:', { searchQuery, city: locationState.city });
    const timer = setTimeout(async () => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery.length >= 2) {
        console.log('Fetching suggestions for:', trimmedQuery);
        setIsSearching(true);
        setShowSuggestions(true);
        
        const city = locationState.city || '';
        const url = `/api/search?q=${encodeURIComponent(trimmedQuery)}&city=${encodeURIComponent(city)}&format=products&sort=price_asc&limit=10`;
        
        try {
          const res = await fetch(url);
          const data = await res.json();
          console.log('Suggestions received:', data.results?.length || 0);
          setSuggestions(data.results || []);
        } catch (err) {
          console.error('Failed to fetch suggestions:', err);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400); // Slight increase to debounce for stability

    return () => {
      console.log('Clearing search timer');
      clearTimeout(timer);
    };
  }, [searchQuery, locationState.city]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        fetch('/api/search/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery.trim(), city: locationState.city }),
        });
      } catch { }
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategorySelect = (name: string) => router.push(`/search?q=${encodeURIComponent(name)}`);

  // Determine which circles to show
  const nearbyCircles = dbCircles.length > 0 ? dbCircles : [];
  
  // For the featured "Cheapest Market Card", we use the first circle or a fallback
  const bestCircle = nearbyCircles[0] || { name: 'Local Markets', color: 'from-orange-500 to-amber-400', emoji: '🏛️' };

  const handleShopClick = (shopId: string) => {
    if (user) {
      router.push(`/vendor/${shopId}`);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        locationState={locationState}
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => router.push('/settings')}
        onNotificationClick={() => router.push('/notifications')}
      />

      {/* ─── STICKY LOCATION BAR ─── */}
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

      {/* ─── FLOATING HOME BUTTON (MOBILE) ─── */}
      <button
        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); router.push('/'); }}
        className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-full shadow-2xl lg:hidden active:scale-90 transition-transform hover:bg-primary"
      >
        <HomeIcon size={24} />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        {/* ─── FEATURED CIRCLE CARD ─── */}
        <div className="mt-6 mb-2">
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${bestCircle.color} shadow-xl shadow-orange-200/60 p-6 cursor-pointer hover:-translate-y-1 transition-all duration-300`}
            onClick={() => router.push(`/circle/${encodeURIComponent(bestCircle.name)}`)}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/4 translate-x-1/4" />
            <div className="absolute bottom-0 right-16 w-24 h-24 bg-white/10 rounded-full translate-y-1/3" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Today's Best Price Area</span>
                </div>
                <h2 className="text-4xl font-black text-white mb-1 tracking-tight">{bestCircle.name}</h2>
                <p className="text-white/85 font-semibold text-sm">
                  {bestCircle.common_products_count > 0 ? (
                    bestCircle.lower_price_pct >= 1 ? (
                      <>
                        <span className="font-black text-white">{bestCircle.lower_price_pct}% lower price</span> than nearby markets today
                      </>
                    ) : bestCircle.lower_price_pct <= -1 ? (
                      <>
                        <span className="font-black text-white">A popular choice</span> for shoppers in this city
                      </>
                    ) : (
                      <>
                        <span className="font-black text-white">Competitive prices</span> on everyday essentials
                      </>
                    )
                  ) : (
                    <>
                      <span className="font-black text-white">Top deals</span> across all markets in this area
                    </>
                  )}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 border border-white/30 rounded-full px-4 py-2">
                  <span className="text-white text-xs font-bold">Explore Area</span>
                  <ChevronRight size={13} className="text-white" />
                </div>
              </div>
              <div className="text-7xl opacity-25 select-none relative w-24 h-24 flex items-center justify-center">
                {bestCircle.icon ? (
                  <img src={bestCircle.icon} alt={bestCircle.name} className="w-full h-full object-contain filter brightness-0 invert" />
                ) : (
                  bestCircle.emoji || '🏷️'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── LARGE SEARCH BAR ─── */}
        <div className="my-6" ref={searchContainerRef}>
          {/* Corner label above search bar */}
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Tag size={12} />
            Find here best prices of articles you need
          </p>
          <form onSubmit={handleSearch} className="relative group">
            <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-lg shadow-slate-200/80 border-2 border-slate-100 group-focus-within:border-orange-300 transition-all duration-300">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="text-orange-400" size={22} />
                <input
                  id="main-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  placeholder="mention name of the article you need"
                  autoComplete="off"
                  className="flex-1 py-3.5 outline-none text-slate-900 font-bold placeholder-slate-400 bg-transparent text-base transition-all duration-500"
                />
                <button type="button" className="p-2 rounded-xl hover:bg-slate-100 transition-colors" title="Voice search">
                  <Mic size={18} className="text-slate-400" />
                </button>
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-orange-500 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-orange-600 transition-all shadow-md shadow-orange-200 active:scale-95"
              >
                Search
              </button>
            </div>

            {/* Suggestions Dropdown */}
            <SearchSuggestions 
              suggestions={suggestions}
              isLoading={isSearching}
              isVisible={showSuggestions}
              onSelect={(item: any) => {
                setSearchQuery(item.name);
                setShowSuggestions(false);
                if (item.type === 'category') {
                  router.push(`/search?q=${encodeURIComponent(item.name)}`);
                } else if (item.type === 'vendor') {
                  router.push(`/vendor/${item.vendor_id || item.vendor?.id}`);
                } else {
                  // Default to product highlighting
                  router.push(`/vendor/${item.vendor_id || item.vendor?.id}?highlightProductId=${item.id}`);
                }
              }}
            />
            {/* Quick suggestion chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['Milk', 'Cooking Oil', 'Atta', 'Mobile Charger', 'Shampoo'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => { setSearchQuery(chip); router.push(`/search?q=${encodeURIComponent(chip)}`); }}
                  className="px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-full text-xs font-bold hover:bg-orange-100 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* ─── GROUPED CIRCLES BY AREA ─── */}
        {!loadingCircles && (dbCircles.length > 0 || Object.keys(marketsByCity).length > 0) && (
          <div className="space-y-10 my-10">
            {/* Header for the section */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">🏛️ Neighborhood Markets</h2>
                <p className="text-slate-400 text-sm font-medium mt-0.5">Explore local hubs in {cityDisplay}</p>
              </div>
              <button
                onClick={() => router.push('/markets')}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200"
              >
                View All Cities
              </button>
            </div>

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
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] whitespace-nowrap bg-white pr-4 relative z-10">
                    {area}
                  </h3>
                  <div className="h-[2px] w-full bg-slate-100 absolute top-1/2 left-0 -translate-y-1/2" />
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {areaCircles.map((circle: any) => (
                    <button
                      key={circle.name}
                      onClick={() => router.push(`/market/${encodeURIComponent(circle.name)}`)}
                      className="flex flex-col items-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-orange-100 transition-all duration-300 group relative overflow-hidden"
                    >
                      {/* Decorative background element on hover */}
                      <div className="absolute -right-2 -top-2 w-8 h-8 bg-orange-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                      
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${circle.color || 'from-orange-500 to-amber-400'} flex items-center justify-center text-xl mb-2 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden ring-2 ring-white`}>
                        {circle.icon ? (
                          <img src={circle.icon} alt={circle.name} className="w-full h-full object-cover" />
                        ) : (
                          circle.emoji || '📍'
                        )}
                      </div>
                      
                      <div className="text-center w-full">
                        <p className="text-[11px] font-black text-slate-800 mb-0.5 group-hover:text-orange-600 transition-colors line-clamp-1 truncate">{circle.name}</p>
                        <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-all">
                          <Store size={8} className="text-orange-500" />
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{circle.shops} shops</p>
                        </div>
                      </div>

                      {/* Hover Arrow Indicator - Smaller */}
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center">
                           <ChevronRight size={10} className="text-white" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ─── LOADING CIRCLES SKELETON (OPTIONAL) ─── */}
        {loadingCircles && (
          <section className="my-8 opacity-50 animate-pulse">
            <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
              ))}
            </div>
          </section>
        )}

        {/* ─── CATEGORY ICONS ─── */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">📂 Categories</h2>
            <p className="text-slate-400 text-sm font-medium mt-0.5">Browse shops by their specialty</p>
          </div>
          <CategoryGrid
            onCategorySelect={handleCategorySelect}
            categories={categories.length > 0 ? categories : undefined}
          />
        </section>

        {/* ─── FIND LOW PRICE BUTTON ─── */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/search?q=offers&sort=price_asc')}
            className="w-full flex items-center gap-4 bg-slate-900 text-white rounded-2xl px-6 py-5 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.99] group"
          >
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Tag size={22} className="text-orange-400" />
            </div>
            <div className="text-left flex-1">
              <p className="font-black text-base leading-none mb-1">Find Low Price Items Near Me</p>
              <p className="text-slate-400 text-xs font-semibold">Compare prices across local shops instantly</p>
            </div>
            <ChevronRight size={20} className="text-orange-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ─── POPULAR SEARCHES ─── */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">🔥 Popular Today</h2>
            <p className="text-slate-400 text-sm font-medium mt-0.5">What people near you are searching</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((item) => (
              <button
                key={item.label}
                onClick={() => handleCategorySelect(item.label)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all shadow-sm"
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </section>


        {/* ─── SALES SECTION ─── */}
        <SalesSection />

        {/* ─── TODAY'S DEALS ─── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">🏷️ Today's Deals Near You</h2>
              <p className="text-slate-400 text-sm font-medium mt-0.5">Lowest prices from shops around you</p>
            </div>
            <button onClick={() => router.push('/offers')} className="text-orange-500 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              All Deals <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {todayDeals.length > 0 ? todayDeals.map((deal) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`deal-${deal.id}`}
                onClick={() => router.push(`/vendor/${deal.id}`)}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg">{deal.tag}</span>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg">{deal.savings}</span>
                </div>
                <p className="font-bold text-slate-800 text-sm mb-1 group-hover:text-primary transition-colors">{deal.name}</p>
                <p className="text-2xl font-black text-orange-500 mb-2">{deal.price}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Store size={11} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500 truncate max-w-[80px]">{deal.shop}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-slate-400" />
                    <span className="text-[10px] font-semibold text-slate-400">{deal.distance}</span>
                  </div>
                </div>
              </motion.div>
            )) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 h-32 animate-pulse" />
              ))
            )}
          </div>
        </section>

        {/* ─── PROMO CAROUSEL ─── */}
        <section className="mb-8">
          <PromoCarousel />
        </section>

        {/* ─── VERIFIED SHOPS ─── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-500" /> Verified Shops Near You
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-0.5">Manually verified for quality & trust</p>
            </div>
            <button onClick={() => router.push('/search?q=verified')} className="text-orange-500 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              See All <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {verifiedShops.length > 0 ? verifiedShops.map((shop, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={`shop-${shop.id}`}
                className="h-full"
              >
                <div 
                  onClick={() => router.push(`/vendor/${shop.id}`)}
                  className="cursor-pointer hover:opacity-95 transition-opacity h-full"
                >
                  <BusinessCardCompact
                    business={{
                      id: shop.id,
                      name: shop.shop_name || shop.name,
                      category: shop.category_name || shop.category || 'Shop',
                      rating: shop.rating || 0,
                      reviewCount: shop.review_count || 0,
                      distance: shop.distance || 'Near you',
                      imageUrl: shop.image_url || shop.shop_front_photo_url || '',
                      isVerified: true
                    }}
                  />
                </div>
              </motion.div>
            )) : (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl border border-slate-100 h-24 animate-pulse" />
              ))
            )}
          </div>
        </section>

        {/* ─── PRICE DROP ALERTS ─── */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              📉 Price Drops
              <span className="px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-black rounded-lg uppercase tracking-wide">New</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-0.5">Recent price reductions near you</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {priceDrops.map((item) => (
              <div 
                key={item.id} 
                onClick={() => router.push(`/vendor/${item.vendorId || item.id?.split('-')[0]}`)}
                className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1 mb-3">
                  <TrendingDown size={13} className="text-red-500" />
                  <span className="text-xs font-black text-red-500">{item.pct} drop</span>
                </div>
                <p className="font-bold text-slate-800 text-sm mb-3 leading-tight line-clamp-2 h-10">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-400 line-through">{item.old}</span>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span className="text-lg font-black text-green-600">{item.new}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── MEGA SAVINGS: LOCAL VS ONLINE ─── */}
        <section className="mb-14 reveal">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="text-green-500" size={24} />
                Mega Savings: Local vs Online
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-0.5">Huge savings when you buy from local shops instead of online</p>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
              <ShieldCheck size={14} className="text-green-600" />
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Verified Savings</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {megaSavings.length > 0 ? megaSavings.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={item.id}
                className="h-full"
              >
                <div 
                  onClick={() => router.push(`/vendor/${item.id}`)}
                  className="cursor-pointer h-full"
                >
                  <BusinessCard
                    business={{
                      id: item.id,
                      name: item.name,
                      category: 'Best Price',
                      rating: 4.8,
                      reviewCount: 92,
                      distance: item.distance || 'Near you',
                      imageUrl: item.image,
                      avgOnlinePrice: item.online,
                      avgOfflinePrice: item.offline,
                      isVerified: true
                    }}
                  />
                </div>
              </motion.div>
            )) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-[2rem] border border-slate-100 h-80 animate-pulse" />
              ))
            )}
          </div>
        </section>

      </div >

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(tab) => {
          setIsSidebarOpen(false);
          if (tab === 'logout') {
            localStorage.removeItem('localmarket_user');
            localStorage.removeItem('localmarket_vendor');
            window.dispatchEvent(new Event('authchange'));
            router.push('/login');
          }
          else if (tab === 'register-business') router.push('/vendor/register');
          else if (tab === 'settings') router.push('/settings');
          else if (tab === 'help') router.push('/help');
          else if (tab === 'home') router.push('/');
          else if (tab === 'categories') router.push('/categories');
          else if (tab === 'saved') router.push('/saved');
        }}
        userRole={user?.role || 'customer'}
        userName={user?.name || 'Guest User'}
      />
    </div >
  );
}
