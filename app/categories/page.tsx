'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CategoryGrid from '@/components/CategoryGrid';
import { ALL_CATEGORIES } from '@/lib/categories';
import { Grid3X3, ChevronDown, ChevronUp, Search, ArrowLeft } from 'lucide-react';

export default function CategoriesPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [locationState, setLocationState] = useState({
    lat: null,
    lng: null,
    city: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const savedLocation = localStorage.getItem('localmarket_location');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        if (parsed.city) {
          setLocationState({ ...parsed, loading: false, error: null });
        } else {
          setLocationState(prev => ({ ...prev, loading: false }));
        }
      } catch (e) {
        setLocationState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setLocationState(prev => ({ ...prev, loading: false }));
    }
  }, []);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoadingCategories(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories(ALL_CATEGORIES);
        }
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setCategories(ALL_CATEGORIES);
      })
      .finally(() => {
        setLoadingCategories(false);
      });
  }, []);

  const handleCategorySelect = (categoryName: string) => {
    router.push(`/search?q=${encodeURIComponent(categoryName)}`);
  };

  const handleSidebarNavigation = (tab: string) => {
    setIsSidebarOpen(false);
    if (tab === 'logout') router.push('/login');
    else if (tab === 'register-business') router.push('/vendor/register');
    else if (tab === 'settings') router.push('/settings');
    else if (tab === 'help') router.push('/help');
    else if (tab === 'home') router.push('/');
    else if (tab === 'categories') router.push('/categories');
    else if (tab === 'saved') router.push('/saved');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => router.push('/settings')}
        onNotificationClick={() => router.push('/notifications')}
      />

      {/* Page Header */}
      <div className="bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <button
                className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md hover:border-primary/20 transition-all active:scale-95 group"
                onClick={() => router.back()}
              >
                <ArrowLeft className="text-slate-600 group-hover:text-primary transition-colors" size={20} />
              </button>
              <div>
                <nav className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Explore</span>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Categories</span>
                </nav>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                  {showAll ? 'Browse All' : 'Top Categories'}
                </h1>
                <p className="text-slate-500 text-sm mt-1 max-w-md font-medium">
                  {loadingCategories
                    ? 'Loading categories...'
                    : 'Find the best local shops and services by their specialty.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold text-slate-600">
                {categories.length} Total
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <CategoryGrid
          onCategorySelect={handleCategorySelect}
          variant="light"
          showAll={showAll}
          categories={categories}
          hideButton={true}
        />

        {/* View All / Show Less toggle */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-primary text-white font-bold rounded-2xl shadow-md hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
            disabled={loadingCategories}
          >
            {showAll ? (
              <><ChevronUp size={18} /> Show Less</>
            ) : (
              <><ChevronDown size={18} /> View All {loadingCategories ? '' : categories.length} Categories</>
            )}
          </button>
        </div>

        {/* Can't find */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 mb-3">Can't find what you're looking for?</p>
          <button
            onClick={() => router.push('/search')}
            className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-colors"
            style={{ color: 'var(--primary)' }}
          >
            <Search size={16} />
            Search for it
          </button>
        </div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleSidebarNavigation}
        userRole="customer"
      />
    </div>
  );
}
