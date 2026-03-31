'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BusinessCard from '@/components/BusinessCard';
import { Heart } from 'lucide-react';
import { getSavedVendors, removeSavedVendor, SavedVendor } from '@/lib/savedVendors';

export default function SavedPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedBusinesses, setSavedBusinesses] = useState<SavedVendor[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSavedBusinesses(getSavedVendors());
    setMounted(true);
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeSavedVendor(id);
    setSavedBusinesses(getSavedVendors());
  };

  if (!mounted) return null; // Wait for hydration
  return (
    <div className="min-h-screen bg-white">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => router.push('/settings')}
        onNotificationClick={() => router.push('/notifications')}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-primary rounded" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Items</h1>
          </div>
          <p className="text-gray-900 ml-3">
            {savedBusinesses.length} {savedBusinesses.length === 1 ? 'business' : 'businesses'} saved
          </p>
        </div>

        {/* Grid View */}
        {savedBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {savedBusinesses.map((business) => (
              <div key={business.id} className="relative">
                <BusinessCard business={business as any} />
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={(e) => handleRemove(business.id, e)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-50 transition-colors"
                  >
                    <Heart className="text-red-500 fill-red-500" size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="text-gray-300 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Items</h3>
            <p className="text-gray-900 mb-6">Start saving businesses you like!</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-colors"
            >
              Explore Businesses
            </button>
          </div>
        )}
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(tab) => {
          setIsSidebarOpen(false);
          if (tab === 'home') router.push('/');
          else if (tab === 'categories') router.push('/categories');
          else if (tab === 'saved') router.push('/saved');
        }}
        userRole="customer"
      />
    </div>
  );
}
