'use client';

import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Activity, Package, MessageSquare, Star, User, Upload, MessageCircle, Loader2, LogOut, Bell, X } from 'lucide-react';
import Link from 'next/link';

interface VendorSession {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  address: string;
  city: string;
  status: string;
  kycStatus: string;
  rating: number;
  reviewCount: number;
  imageUrl?: string | null;
}

// Context so child pages can read the vendor + full data
export const VendorContext = createContext<{
  vendor: VendorSession | null;
  profile: any;
  products: any[];
  enquiries: any[];
  reviews: any[];
  loading: boolean;
  refresh: () => void;
}>({
  vendor: null, profile: null, products: [], enquiries: [], reviews: [], loading: true, refresh: () => { }
});

export const useVendor = () => useContext(VendorContext);

interface VendorDashboardLayoutProps {
  children: React.ReactNode;
  hideTabs?: boolean;
}

export default function VendorDashboardLayout({ children, hideTabs = false }: VendorDashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [vendor, setVendor] = useState<VendorSession | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEnquiryCount, setNewEnquiryCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: Activity, href: '/vendor/dashboard/analytics' },
    { id: 'catalog', label: 'Catalog', icon: Package, href: '/vendor/dashboard/catalog' },
    { id: 'offers', label: 'Offer & Sale', icon: Star, href: '/vendor/dashboard/offers' },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, href: '/vendor/dashboard/enquiries' },
    { id: 'reviews', label: 'Reviews', icon: Star, href: '/vendor/dashboard/reviews' },
    { id: 'profile', label: 'Profile', icon: User, href: '/vendor/dashboard/profile' },
    { id: 'bulk-update', label: 'Bulk Update', icon: Upload, href: '/vendor/dashboard/bulk-update' },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle, href: '/vendor/dashboard/feedback' },
  ];

  const activeTab = tabs.find(tab => pathname.includes(tab.id))?.id || 'analytics';

  const loadFromDB = async (session: VendorSession) => {
    try {
      const res = await fetch(`/api/vendor/profile?id=${session.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.vendor) {
          setProfile(data.vendor);
          setVendor(prev => ({ ...prev!, ...data.vendor }));
          // Update localStorage with fresh data
          const updated = { ...session, ...data.vendor };
          localStorage.setItem('localmarket_vendor', JSON.stringify(updated));
        }

        // Check for new enquiries
        if (enquiries.length > 0 && data.enquiries && data.enquiries.length > enquiries.length) {
          setNewEnquiryCount(prev => prev + (data.enquiries.length - enquiries.length));
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 5000);
        }

        setProducts(data.products || []);
        setEnquiries(data.enquiries || []);
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error('Failed to refresh vendor data from DB', e);
    } finally {
      setLoading(false);
    }
  };

  // Poll for new data every 30 seconds
  useEffect(() => {
    if (!vendor) return;
    const interval = setInterval(() => {
      loadFromDB(vendor);
    }, 30000);
    return () => clearInterval(interval);
  }, [vendor, enquiries.length]);

  const refresh = () => {
    if (vendor) loadFromDB(vendor);
  };

  useEffect(() => {
    const raw = localStorage.getItem('localmarket_vendor');
    if (!raw) {
      router.replace('/login');
      return;
    }
    const session: VendorSession = JSON.parse(raw);
    setVendor(session);
    if (session.id) {
      loadFromDB(session);
    } else {
      setLoading(false);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('localmarket_vendor');
    window.dispatchEvent(new Event('authchange'));
    router.push('/login');
  };

  const contextValue = useMemo(() => ({
    vendor, profile, products, enquiries, reviews, loading, refresh
  }), [vendor, profile, products, enquiries, reviews, loading, refresh]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: 'var(--primary)' }} />
          <p className="text-slate-400 text-sm font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!vendor) return null;

  const displayVendor = profile || vendor;

  return (
    <VendorContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-50">
        <Header
          locationState={{ loading: false, error: null, city: displayVendor.city || 'Your City' }}
          onMenuClick={() => setIsSidebarOpen(true)}
          onProfileClick={() => router.push('/vendor/dashboard/profile')}
          onNotificationClick={() => router.push('/notifications')}
        />

        {/* Dashboard Header */}
        <div className="bg-gradient-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-black truncate">{displayVendor.name}</h1>
                <p className="text-white/80 text-sm mt-0.5">
                  {displayVendor.category}
                  {displayVendor.address ? ` • ${displayVendor.address}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className="relative">
                  <Bell size={20} className="text-white/80" />
                  {newEnquiryCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--primary)]">
                      {newEnquiryCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold transition-colors flex-shrink-0"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Notification Toast */}
        {showNotification && (
          <div className="fixed bottom-6 right-6 z-[100] bg-white rounded-2xl shadow-2xl p-4 border border-slate-100 flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="font-black text-slate-900">New Enquiry Received!</p>
              <p className="text-xs text-slate-500">Check your enquiries tab for details.</p>
            </div>
            <button onClick={() => setShowNotification(false)} className="ml-4 text-slate-300 hover:text-slate-500">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        {!hideTabs && (
          <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className={`flex items-center gap-2 px-4 sm:px-5 py-4 border-b-2 transition-colors whitespace-nowrap text-sm font-semibold ${isActive
                        ? 'border-current'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                      style={isActive ? { color: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={(tab) => {
            setIsSidebarOpen(false);
            if (tab === 'home') router.push('/');
          }}
          userRole="vendor"
        />
      </div>
    </VendorContext.Provider>
  );
}
