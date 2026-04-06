'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import BusinessCard from '@/components/BusinessCard';
import { Search, SlidersHorizontal, ArrowLeft, X, Star, ShoppingCart } from 'lucide-react';

// ─── Filter Types ──────────────────────────────────────────────────────────
interface Filters {
  categories: string[];
  minRating: number;
  sortBy: 'default' | 'rating' | 'name' | 'price_asc';
}

const DEFAULT_FILTERS: Filters = { categories: [], minRating: 0, sortBy: 'default' };

// ─── Filter Panel ──────────────────────────────────────────────────────────
function FilterPanel({
  filters,
  allCategories,
  onApply,
  onClose,
}: {
  filters: Filters;
  allCategories: string[];
  onApply: (f: Filters) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<Filters>(filters);

  const toggleCategory = (cat: string) => {
    setLocal(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const isActive =
    local.categories.length > 0 || local.minRating > 0 || local.sortBy !== 'default';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50 shadow-2xl overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-black text-slate-900">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-8">
          {/* Sort */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Sort By</h3>
            <div className="space-y-2">
              {[
                { id: 'default', label: 'Relevance' },
                { id: 'price_asc', label: 'Cheapest First' },
                { id: 'rating', label: 'Top Rated' },
                { id: 'name', label: 'Name (A–Z)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLocal(prev => ({ ...prev, sortBy: opt.id as Filters['sortBy'] }))}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${local.sortBy === opt.id
                    ? 'border-transparent text-white'
                    : 'border-slate-100 text-slate-700 hover:border-slate-200 bg-white'
                    }`}
                  style={local.sortBy === opt.id ? { background: 'var(--gradient-primary, linear-gradient(135deg, #E86A2C, #4A6CF7))' } : {}}
                >
                  {opt.label}
                  {local.sortBy === opt.id && <span className="text-white/80 text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Min Rating */}
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Min Rating</h3>
            <div className="flex gap-2 flex-wrap">
              {[0, 3, 3.5, 4, 4.5].map(r => (
                <button
                  key={r}
                  onClick={() => setLocal(prev => ({ ...prev, minRating: r }))}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl border text-sm font-bold transition-all ${local.minRating === r
                    ? 'border-transparent text-white'
                    : 'border-slate-100 text-slate-700 hover:border-slate-200 bg-white'
                    }`}
                  style={local.minRating === r ? { background: 'var(--gradient-primary, linear-gradient(135deg, #E86A2C, #4A6CF7))' } : {}}
                >
                  {r === 0 ? 'Any' : (
                    <>
                      <Star size={12} className="fill-current" />
                      {r}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          {allCategories.length > 0 && (
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Category</h3>
              <div className="space-y-2">
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${local.categories.includes(cat)
                      ? 'border-transparent text-white'
                      : 'border-slate-100 text-slate-700 hover:border-slate-200 bg-white'
                      }`}
                    style={local.categories.includes(cat) ? { background: 'var(--gradient-primary, linear-gradient(135deg, #E86A2C, #4A6CF7))' } : {}}
                  >
                    {cat}
                    {local.categories.includes(cat) && <span className="text-white/80 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 space-y-3">
          {isActive && (
            <button
              onClick={() => setLocal(DEFAULT_FILTERS)}
              className="w-full py-3 bg-slate-50 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
            >
              Clear All Filters
            </button>
          )}
          <button
            onClick={() => onApply(local)}
            className="w-full py-3.5 text-white rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-md"
            style={{ background: 'var(--gradient-primary, linear-gradient(135deg, #E86A2C, #4A6CF7))' }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

// ─── SearchContent ─────────────────────────────────────────────────────────
function SearchContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allResults, setAllResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const sort = searchParams.get('sort');

    setSearchQuery(query);
    if (sort === 'price_asc' || sort === 'rating' || sort === 'name') {
      setFilters(prev => ({ ...prev, sortBy: sort as Filters['sortBy'] }));
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => { setAllResults(data.results || []); setLoading(false); })
      .catch(err => { console.error('Search failed:', err); setAllResults([]); setLoading(false); });
  }, [searchParams]);

  // Unique categories from raw results
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    allResults.forEach(b => {
      const cat = b.category_name || b.category;
      if (cat) cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [allResults]);

  // Apply filters + sort client-side
  const results = useMemo(() => {
    let filtered = [...allResults];
    if (filters.categories.length > 0) {
      filtered = filtered.filter(b => filters.categories.includes(b.category_name || b.category || ''));
    }
    if (filters.minRating > 0) {
      filtered = filtered.filter(b => (b.rating ?? 0) >= filters.minRating);
    }
    if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (filters.sortBy === 'name') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (filters.sortBy === 'price_asc') {
      filtered.sort((a, b) => {
        const getMinPrice = (biz: any) => {
          if (!biz.matchingProducts || biz.matchingProducts.length === 0) return 999999;
          // Ensure we only sort by non-zero prices to keep 'Visit Store' entries at the bottom
          const prices = biz.matchingProducts.map((p: any) => (p.price && p.price > 0) ? p.price : 999999);
          return Math.min(...prices);
        };
        return getMinPrice(a) - getMinPrice(b);
      });
    }
    return filtered;
  }, [allResults, filters]);

  const activeFilterCount =
    filters.categories.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.sortBy !== 'default' ? 1 : 0);

  const handleSearch = async (query: string) => {
    try {
      const savedLoc = localStorage.getItem('localmarket_location');
      const city = savedLoc ? JSON.parse(savedLoc).city : 'Delhi, India';
      const user = JSON.parse(localStorage.getItem('localmarket_user') || localStorage.getItem('localmarket_vendor') || '{}');
      fetch('/api/search/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), city: city, userId: user.id })
      });
    } catch (err) { console.warn('Failed to track search:', err); }
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => router.push('/settings')}
        onNotificationClick={() => router.push('/notifications')}
      />

      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header row */}
        <div className="mb-10 reveal">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.history.length > 2) {
                    router.back();
                  } else {
                    const isVendor = typeof window !== 'undefined' && localStorage.getItem('localmarket_vendor');
                    router.push(isVendor ? '/vendor/dashboard' : '/');
                  }
                }}
                className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-4"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tight mb-2">
                {searchQuery ? `Results for "${searchQuery}"` : 'Browse Everything'}
              </h1>
              <p className="text-sm font-bold text-slate-500">
                Showing {results.length} of {allResults.length} {allResults.length === 1 ? 'business' : 'businesses'}
                {activeFilterCount > 0 ? ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)` : ''}
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <div className="flex-1 md:w-80">
                <SearchBar onSearch={handleSearch} />
              </div>
              <button
                id="filter-btn"
                onClick={() => setIsFilterOpen(true)}
                className={`relative px-6 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-black transition-all shadow-sm ${activeFilterCount > 0 ? 'text-white' : 'bg-white border border-slate-100 text-slate-700 hover:bg-slate-50'
                  }`}
                style={activeFilterCount > 0 ? { background: 'linear-gradient(135deg, #E86A2C, #4A6CF7)' } : {}}
              >
                <SlidersHorizontal size={18} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-white/30 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.sortBy !== 'default' && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                  Sort: {filters.sortBy === 'rating' ? 'Top Rated' : filters.sortBy === 'price_asc' ? 'Cheapest First' : 'Name A–Z'}
                  <button onClick={() => setFilters(f => ({ ...f, sortBy: 'default' }))} className="hover:text-red-500"><X size={12} /></button>
                </span>
              )}
              {filters.minRating > 0 && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                  {filters.minRating}+ Stars
                  <button onClick={() => setFilters(f => ({ ...f, minRating: 0 }))} className="hover:text-red-500"><X size={12} /></button>
                </span>
              )}
              {filters.categories.map(cat => (
                <span key={cat} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                  {cat}
                  <button onClick={() => setFilters(f => ({ ...f, categories: f.categories.filter(c => c !== cat) }))} className="hover:text-red-500"><X size={12} /></button>
                </span>
              ))}
              <button onClick={() => setFilters(DEFAULT_FILTERS)} className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-full transition-colors">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm h-[340px] opacity-70">
                <div className="w-full h-48 bg-slate-100" />
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="w-3/4 h-5 bg-slate-200 rounded-md" />
                  <div className="w-1/2 h-3 bg-slate-100 rounded-md" />
                  <div className="mt-auto flex justify-between items-center">
                    <div className="w-1/3 h-4 bg-slate-100 rounded-md" />
                    <div className="w-1/4 h-6 bg-slate-200 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 reveal" style={{ animationDelay: '0.2s' }}>
            {results.map((business, i) => (
              <div key={business.id} className="reveal relative group bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all overflow-hidden flex flex-col" style={{ animationDelay: `${i * 0.05 + 0.3}s` }}>
                <BusinessCard business={business} variant="flat" onClick={() => router.push(`/vendor/${business.id}`)} />

                {/* Matching Items Overview */}
                {business.matchingProducts && business.matchingProducts.length > 0 ? (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4 space-y-3 mt-auto">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Matching Items</p>
                    <div className="flex flex-col gap-2">
                      {business.matchingProducts.slice(0, 2).map((prod: any) => {
                        const isMatch = searchQuery && prod.name.toLowerCase().includes(searchQuery.toLowerCase());
                        return (
                          <div key={prod.id} className={`flex items-center justify-between p-2.5 rounded-xl shadow-sm border transition-all hover:border-primary/30 ${
                            isMatch 
                            ? 'bg-orange-50/50 border-orange-400 ring-4 ring-orange-400/10 z-10 scale-[1.02]' 
                            : 'bg-white border-slate-100'
                          }`}>
                            <div className="flex items-center gap-3">
                              {prod.image && (
                                <div className="w-10 h-10 rounded-lg overflow-hidden relative border border-slate-100/50">
                                  <img src={prod.image} className="object-cover w-full h-full" alt={prod.name} />
                                </div>
                              )}
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</span>
                              <span className="text-[11px] font-black text-primary">₹{prod.price}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const { addToCart } = require('@/lib/cart');
                              addToCart({
                                id: prod.id,
                                vendorId: business.id,
                                vendorName: business.name,
                                name: prod.name,
                                price: prod.price,
                                quantity: 1,
                                image: prod.image
                              });
                            }}
                            className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all group/btn"
                            title="Add to Basket"
                          >
                            <ShoppingCart size={14} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                          </div>
                        );
                      })}
                      {business.matchingProducts.length > 2 && (
                        <button
                          onClick={() => router.push(`/vendor/${business.id}`)}
                          className="mt-1 text-[10px] font-black text-slate-500 hover:text-primary transition-colors text-center w-full py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-100"
                        >
                          + {business.matchingProducts.length - 2} more matching items
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto border-t border-slate-50/50 p-4 bg-slate-50/30">
                    <button
                      onClick={() => router.push(`/vendor/${business.id}`)}
                      className="w-full py-3 bg-white border border-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm group-hover:border-slate-200 group-hover:text-slate-900"
                    >
                      Explore Store →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl shadow-slate-200/50 border border-slate-50 reveal" style={{ animationDelay: '0.2s' }}>
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Search className="text-slate-300" size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
              {activeFilterCount > 0 ? 'No Results for These Filters' : 'No Matches Found'}
            </h3>
            <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
              {activeFilterCount > 0
                ? 'Try removing some filters to see more results.'
                : searchQuery
                  ? `We couldn't find any results for "${searchQuery}". Maybe try a different keyword?`
                  : 'Start searching to find the best local businesses near you.'}
            </p>
            {activeFilterCount > 0 ? (
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
              >
                Clear Filters
              </button>
            ) : searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); router.push('/search'); }}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
              >
                Clear Search & Try Again
              </button>
            )}
          </div>
        )}
      </div>

      {isFilterOpen && (
        <FilterPanel
          filters={filters}
          allCategories={allCategories}
          onApply={(f) => { setFilters(f); setIsFilterOpen(false); }}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(tab) => {
          setIsSidebarOpen(false);
          if (tab === 'home') router.push('/');
          else if (tab === 'categories') router.push('/categories');
          else if (tab === 'saved') router.push('/saved');
        }}
        userRole={typeof window !== 'undefined' && localStorage.getItem('localmarket_vendor') ? 'vendor' : 'customer'}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
          <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Searching...</span>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
