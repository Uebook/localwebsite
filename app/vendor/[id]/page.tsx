'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import {
  MapPin, Star, Phone, MessageCircle, Heart, Share2, Clock, CheckCircle,
  ArrowLeft, Award, Package, ChevronRight, ShieldCheck, TrendingUp,
  Copy, ExternalLink, BadgeCheck, Users, Zap, Loader2, Lock, Tag, Search
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import EnquiryModal from '@/components/EnquiryModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import ReviewModal from '@/components/ReviewModal';
import { isVendorSaved, saveVendor, removeSavedVendor } from '@/lib/savedVendors';

export default function VendorDetailsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isRelModalOpen, setIsRelModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [productSearch, setProductSearch] = useState('');
  const [vendorData, setVendorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightProductId = searchParams.get('highlightProductId');

  // Check save status on mount
  useEffect(() => {
    if (params.id) {
      setIsSaved(isVendorSaved(params.id as string));
    }
  }, [params.id]);

  // Check auth on mount
  useEffect(() => {
    const customer = localStorage.getItem('localmarket_user');
    const vendor = localStorage.getItem('localmarket_vendor');
    setIsLoggedIn(!!(customer || vendor));
    setAuthChecked(true);

    const onAuthChange = () => {
      const c = localStorage.getItem('localmarket_user');
      const v = localStorage.getItem('localmarket_vendor');
      setIsLoggedIn(!!(c || v));
    };
    window.addEventListener('authchange', onAuthChange);
    return () => window.removeEventListener('authchange', onAuthChange);
  }, []);

  useEffect(() => {
    if (!params.id) return;

    const fetchVendor = () => {
      fetch(`/api/vendor/profile?id=${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setVendorData(data);
          }
        })
        .catch(err => console.error('Failed to fetch vendor profile:', err))
        .finally(() => setLoading(false));
    };

    setLoading(true);
    fetchVendor();

    // Polling for real-time updates (especially reviews)
    const interval = setInterval(() => {
      if (activeTab === 'reviews') {
        console.log('Polling for new reviews...');
        fetchVendor();
      }
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [params.id, activeTab]);

  const handleReplyReview = async (reviewId: string) => {
    const reply = prompt('Enter your reply:');
    if (!reply) return;

    try {
      const res = await fetch('/api/reviews/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, reply })
      });
      if (res.ok) {
        alert('Reply posted successfully!');
        // Trigger re-fetch
        window.location.reload();
      }
    } catch (err) {
      alert('Failed to post reply.');
    }
  };

  const business = vendorData?.vendor;
  const products = vendorData?.products || [];
  const reviews = vendorData?.reviews || [];
  const offers = vendorData?.offers || [];

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    return products.filter((p: any) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category_name?.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  // Compute real stats from fetched reviews
  const realReviewCount = reviews.length;
  const realRating = realReviewCount > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / realReviewCount).toFixed(1)
    : (business?.rating ? Number(business.rating).toFixed(1) : '—');

  const callLink = useMemo(() => {
    const phone = business?.phone || business?.contactNumber;
    if (!phone) return null;
    return `tel:${phone.toString().replace(/\D/g, '')}`;
  }, [business]);

  const whatsappLink = useMemo(() => {
    let phone = business?.whatsappNumber || business?.phone || business?.contactNumber;
    if (!phone) return null;
    let cleanPhone = phone.toString().replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    return `https://wa.me/${cleanPhone}`;
  }, [business]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: `Products & Services (${products.length})` },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'info', label: 'Contact Info' },
  ];

  // Handle product highlighting and scrolling
  useEffect(() => {
    if (highlightProductId && products.length > 0) {
      setActiveTab('products');
      
      // Give a tiny delay for the tab switch animation/render
      const timer = setTimeout(() => {
        const element = document.getElementById(`product-${highlightProductId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [highlightProductId, products.length]);

  const handleCall = () => {
    if (callLink) window.location.href = callLink;
  };

  const handleWhatsApp = () => {
    if (whatsappLink) window.open(whatsappLink, '_blank');
  };

  const handleCopyAddress = () => {
    if (business?.address) {
      navigator.clipboard.writeText(business.address);
    }
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: business?.name, text: `Check out ${business?.name}`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 opacity-75">
        <Header onMenuClick={() => { }} onProfileClick={() => { }} onNotificationClick={() => { }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="w-20 h-6 bg-slate-200 rounded mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-5">
              <div className="h-72 sm:h-96 w-full rounded-3xl bg-slate-200" />
              <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
                <div className="h-10 w-full bg-slate-100 rounded-xl" />
                <div className="h-24 w-full bg-slate-50 rounded-2xl" />
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 h-64" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-24 bg-white rounded-2xl border border-slate-100" />
                <div className="h-24 bg-white rounded-2xl border border-slate-100" />
                <div className="h-24 bg-white rounded-2xl border border-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Vendor Not Found</h2>
          <p className="text-slate-500 mb-6">{error || "We couldn't find the vendor you're looking for."}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-gradient-primary text-white rounded-2xl font-bold hover:opacity-90 transition-all"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* Auth gate overlay — shown when user is not logged in */}
      {!isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-blur-md bg-slate-900/40" />
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'linear-gradient(135deg, #E86A2C20, #4A6CF720)' }}>
              <Lock size={32} style={{ color: 'var(--primary)' }} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Members Only</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-7">
              Sign in or create a free account to view vendor details, products, and contact information.
            </p>
            <div className="space-y-3">
              <Link
                href={`/login?redirect=/vendor/${params.id}`}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
                style={{ background: 'linear-gradient(135deg, #E86A2C, #4A6CF7)' }}
              >
                Login to Continue
              </Link>
              <Link
                href={`/login?redirect=/vendor/${params.id}`}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-slate-700 border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
              >
                Create Free Account
              </Link>
            </div>
            <button
              onClick={() => router.back()}
              className="mt-5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Go Back
            </button>
          </div>
        </div>
      )}

      {/* Page content (always rendered but blurred when not logged in) */}
      <div className={!isLoggedIn ? 'blur-sm pointer-events-none select-none' : ''}>
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onProfileClick={() => router.push('/settings')}
          onNotificationClick={() => router.push('/notifications')}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ─── LEFT COLUMN ─── */}
            <div className="lg:col-span-8 space-y-5">

              {/* Hero Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-200"
              >
                {(() => {
                  const imgUrl = business.profile_image_url || business.imageUrl || business.image_url || business.shop_front_photo_url || 'https://images.unsplash.com/photo-1574310391921-4b130467b2bb?auto=format&fit=crop&w=800&q=80';
                  return (
                    <Image src={imgUrl} alt={business.name} fill className="object-cover" priority />
                  );
                })()}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                {/* Top actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => {
                      if (isSaved) {
                        removeSavedVendor(business.id);
                        setIsSaved(false);
                      } else {
                        saveVendor(business);
                        setIsSaved(true);
                      }
                    }}
                    className={`p-3 rounded-2xl backdrop-blur-md border transition-all ${isSaved ? 'bg-red-500 border-red-500 text-white' : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                      }`}
                  >
                    <Heart className={isSaved ? 'fill-white' : ''} size={18} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md text-white hover:bg-white/30 transition-all"
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Business info overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-wrap items-center gap-2 mb-3"
                  >
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
                      {business.category}
                    </span>
                    {business.isVerified && (
                      <span className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-500/90 text-white text-xs font-black rounded-full backdrop-blur-md shadow-lg border border-blue-400/30">
                        <BadgeCheck size={14} className="animate-pulse" />
                        Verified Partner
                      </span>
                    )}
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4 drop-shadow-xl"
                  >
                    {business.name}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-wrap items-center gap-4"
                  >
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white shadow-xl">
                      <Star className="fill-amber-400 text-amber-400" size={16} />
                      <span className="font-black text-lg">{realRating}</span>
                      <span className="text-white/60 text-xs font-bold">({realReviewCount} verified reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/90 text-sm font-black bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
                      <MapPin size={16} className="text-primary" style={{ color: 'var(--primary)' }} />
                      {business.city || 'Vendor Location'}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Tab Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 backdrop-blur-sm px-4">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative flex-shrink-0 ${activeTab === tab.id ? 'text-slate-900 scale-105' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        style={activeTab === tab.id ? { color: 'var(--primary)' } : {}}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTabUnderline"
                            className="absolute bottom-0 left-6 right-6 h-1 rounded-t-full"
                            style={{ backgroundColor: 'var(--primary)' }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6 sm:p-8 min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-8"
                      >
                        {/* Active Offers */}
                        {offers.length > 0 && (
                          <div>
                            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                              <Zap size={20} className="text-orange-500" />
                              Offer & Sale
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {offers.map((offer: any) => (
                                <div key={offer.id} className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100 shadow-sm group">
                                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-200/20 rounded-full blur-2xl group-hover:bg-orange-200/30 transition-all" />
                                  <div className="relative flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-orange-100 shadow-xs">
                                      <Tag size={12} className="text-orange-500" />
                                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">
                                        {offer.offer_type || 'Special Offer'}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">
                                      Ends {new Date(offer.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </span>
                                  </div>
                                  <h4 className="text-lg font-black text-slate-800 mb-1">{offer.title}</h4>
                                  <p className="text-xs text-slate-500 line-clamp-1 mb-3">{offer.description}</p>
                                  <div className="flex items-center justify-between mt-auto">
                                    <div className="text-sm font-black text-orange-600">
                                      {offer.offer_type === 'Flat Discount' ? `₹${offer.flat_discount_amount} OFF` :
                                        offer.offer_type === 'Discount %' ? `${offer.discount_percent}% OFF` :
                                          offer.offer_type}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 italic">
                                      {offer.offer_scope === 'all' ? 'All Products' :
                                        offer.offer_scope === 'min_purchase' ? `Min order ₹${offer.min_purchase_amount}` :
                                          'Selected Products'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* About */}
                        <div>
                          <h3 className="text-lg font-black text-slate-900 mb-3">About {business.name}</h3>
                          <p className="text-slate-500 leading-relaxed">
                            {business.about || 'A trusted local service provider committed to quality and customer satisfaction. We take pride in delivering exceptional service to our community.'}
                          </p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Location */}
                          <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl shadow-sm border border-slate-100/50">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <MapPin size={20} className="text-orange-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                              <p className="text-slate-800 font-semibold text-sm leading-snug">{business.address || 'Address not listed'}</p>
                              <button
                                onClick={handleCopyAddress}
                                className="mt-2 flex items-center gap-1 text-xs font-bold hover:opacity-80 transition-colors"
                                style={{ color: 'var(--primary)' }}
                              >
                                <Copy size={11} />
                                Copy Address
                              </button>
                            </div>
                          </div>

                          {/* Hours */}
                          <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl shadow-sm border border-slate-100/50">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Clock size={20} className="text-amber-500" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Open Hours</p>
                              <p className="text-slate-800 font-semibold text-sm">{business.openTime || '09:00 AM – 09:00 PM'}</p>
                              <span className="inline-block mt-2 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-lg">Open Now</span>
                            </div>
                          </div>

                          {/* Verification */}
                          <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl shadow-sm border border-slate-100/50">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <ShieldCheck size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                              <p className="text-slate-800 font-semibold text-sm">
                                {business.isVerified ? 'Verified & Professional' : 'Registered Business'}
                              </p>
                            </div>
                          </div>

                          {/* Popularity */}
                          <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl shadow-sm border border-slate-100/50">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <TrendingUp size={20} className="text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Popularity</p>
                              <p className="text-slate-800 font-semibold text-sm">Highly Rated Provider</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'products' && (
                      <motion.div
                        key="products"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                      >
                        {/* Store Search */}
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="text"
                            placeholder={`Search in ${business.name}...`}
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <AnimatePresence>
                            {filteredProducts.length > 0 ? filteredProducts.map((product: any, idx: number) => (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                                  key={product.id}
                                  id={`product-${product.id}`}
                                  onClick={() => handleProductClick(product)}
                                  className={`group flex gap-4 p-4 rounded-2xl transition-all cursor-pointer border ${
                                    product.id === highlightProductId 
                                    ? 'bg-orange-50/50 border-orange-400 ring-4 ring-orange-400/20 shadow-xl shadow-orange-500/10 z-10 scale-[1.02]' 
                                    : 'bg-slate-50 hover:bg-white hover:shadow-md hover:border-slate-100 border-transparent'
                                  }`}
                                >
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-slate-200">
                                  {product.image_url ? (
                                    <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs text-center border">No Image</div>
                                  )}
                                </div>
                                <div className="flex flex-col justify-center min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-bold text-slate-900 text-base leading-tight truncate">{product.name}</h4>
                                    {product.online_price && product.online_price > product.price && (
                                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0">
                                        Save ₹{product.online_price - product.price}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-slate-400 font-medium mt-0.5 truncate">{product.category_name}</span>
                                  <div className="flex items-baseline gap-2 mt-2">
                                    <div className="flex flex-col">
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Lokall Price</span>
                                      <span className="font-black text-lg text-orange-600">₹{product.price}</span>
                                    </div>
                                    {product.online_price && (
                                      <div className="flex flex-col border-l border-slate-200 pl-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Online Price</span>
                                        <span className="text-slate-400 text-sm line-through font-medium">₹{product.online_price}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )) : (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-16 text-center text-slate-300"
                              >
                                <Package size={48} className="mx-auto mb-3" />
                                <p className="text-sm font-semibold">No products matches your search</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'reviews' && (
                      <motion.div
                        key="reviews"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Customer Reviews</h4>
                          <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95"
                          >
                            Leave Review
                          </button>
                        </div>
                        {reviews.length > 0 ? reviews.map((review: any) => (
                          <div key={review.id} className="bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                                  {(review.user_name || review.reviewer_name || 'U')[0]}
                                </div>
                                <div>
                                  <h5 className="font-bold text-slate-900 text-sm">{review.user_name || review.reviewer_name || 'Customer'}</h5>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={10} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recently'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed italic">
                              "{review.comment || review.review_text || 'No comment provided.'}"
                            </p>
                            {review.reply ? (
                              <div className="mt-4 p-4 bg-white border-l-4 border-primary rounded-xl">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Vendor Reply</p>
                                <p className="text-xs text-slate-500 italic">{review.reply}</p>
                              </div>
                            ) : (
                              localStorage.getItem('localmarket_vendor') && (
                                <button
                                  onClick={() => handleReplyReview(review.id)}
                                  className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-all flex items-center gap-1"
                                >
                                  <MessageCircle size={12} /> Reply to Review
                                </button>
                              )
                            )}
                          </div>
                        )) : (
                          <div className="py-12 text-center text-slate-300">
                            <Star size={48} className="mx-auto mb-3" />
                            <p className="text-sm font-semibold">No reviews yet. Be the first!</p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'info' && (
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        {[
                          { icon: Phone, label: 'Phone', value: business.phone || business.contactNumber || 'Not provided', action: handleCall, href: callLink, color: 'bg-green-50 text-green-600' },
                          { icon: MessageCircle, label: 'WhatsApp', value: business.whatsappNumber || business.phone || business.contactNumber || 'Not provided', action: handleWhatsApp, href: whatsappLink, color: 'bg-green-50 text-green-600' },
                          { icon: MapPin, label: 'Address', value: business.address || 'Address not provided', action: handleCopyAddress, href: null, color: 'bg-orange-50 text-orange-500' },
                        ].map(({ icon: Icon, label, value, action, href, color }) => (
                          <a
                            key={label}
                            href={href || '#'}
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                            onClick={(e) => {
                              if (!href) {
                                e.preventDefault();
                                action();
                              }
                            }}
                            className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 rounded-2xl text-left transition-all group"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                              <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                              <p className="text-slate-800 font-semibold text-sm truncate">{value}</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 flex-shrink-0 transition-colors" />
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN ─── */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-4">

                {/* Book Service Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-base font-black text-slate-900 mb-4">Book Service</h3>

                  <div className="space-y-3">
                    {/* Call */}
                    <a
                      href={callLink || '#'}
                      onClick={(e) => !callLink && e.preventDefault()}
                      className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group text-left"
                    >
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-shadow">
                        <Phone size={18} className="text-slate-600" />
                      </div>
                      <span className="flex-1 font-bold text-slate-800 text-sm">Call Vendor</span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={whatsappLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => !whatsappLink && e.preventDefault()}
                      className="w-full flex items-center gap-3 px-4 py-3.5 bg-green-50 hover:bg-green-100 rounded-2xl transition-all group text-left"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageCircle size={18} className="text-white" />
                      </div>
                      <span className="flex-1 font-bold text-green-800 text-sm">WhatsApp Message</span>
                      <ChevronRight size={16} className="text-green-400" />
                    </a>

                    {/* Divider */}
                    <div className="border-t border-slate-100 my-1" />

                    {/* Enquiry CTA */}
                    <button
                      onClick={() => setIsEnquiryModalOpen(true)}
                      className="w-full py-3.5 bg-gradient-primary text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-md"
                    >
                      Direct Enquiry
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Star, value: realRating, label: 'Rating', color: 'text-amber-500' },
                    { icon: Users, value: realReviewCount > 0 ? `${realReviewCount}` : '0', label: 'Reviews', color: 'text-blue-500' },
                    { icon: Zap, value: '< 1hr', label: 'Response', color: 'text-green-500' },
                  ].map(({ icon: Icon, value, label, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-3 text-center border border-slate-100 shadow-sm">
                      <Icon size={18} className={`${color} mx-auto mb-1`} />
                      <p className="text-base font-black text-slate-900">{value}</p>
                      <p className="text-xs text-slate-400 font-medium">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Trust Badge */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Award size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trust Policy</p>
                      <p className="text-sm font-black text-slate-900">Purchase Protection</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Connect through us for premium support and guaranteed service quality.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400">+{150 + (business.reviewCount || 0)} Happy Customers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={() => { }} userRole="customer" />
        {isEnquiryModalOpen && (
          <EnquiryModal
            isOpen={isEnquiryModalOpen}
            onClose={() => setIsEnquiryModalOpen(false)}
            businessName={business.name}
            vendorId={business.id}
          />
        )}
        {isProductModalOpen && selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            vendorName={business.name}
            onClose={() => setIsProductModalOpen(false)}
            onWhatsApp={handleWhatsApp}
            onCall={handleCall}
            onEnquiry={() => {
              setIsProductModalOpen(false);
              setIsEnquiryModalOpen(true);
            }}
          />
        )}

        {business && (
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            vendorId={business.id}
            vendorName={business.name || business.shop_name}
            onSuccess={() => {
              // refresh data
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
}
