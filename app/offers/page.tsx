'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { NEARBY_BUSINESSES } from '@/lib/data';
import { Tag, Copy, Store, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import OfferDetailModal from '@/components/OfferDetailModal';

export default function OffersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchOffers() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/festive-offers');
        if (res.ok) {
          const data = await res.json();
          // Transform festive offers to match the UI format
          const transformedOffers = data.map((offer: any) => {
            let discountLabel = '';
            if (offer.offer_type === 'Flat Discount') {
              discountLabel = `₹${offer.flat_discount_amount} OFF`;
            } else if (offer.offer_type === 'Discount %') {
              discountLabel = `${offer.discount_percent}% OFF`;
            } else {
              discountLabel = offer.offer_type || 'DEAL';
            }

            let scopeLabel = '';
            if (offer.offer_scope === 'min_purchase') {
              scopeLabel = `On orders above ₹${offer.min_purchase_amount}`;
            } else if (offer.offer_scope === 'all') {
              scopeLabel = 'On all products';
            }

            return {
              id: offer.id,
              title: offer.title,
              description: scopeLabel ? `${offer.description} (${scopeLabel})` : offer.description,
              code: discountLabel,
              color: 'bg-gradient-primary',
              imageUrl: offer.image_url,
              vendorName: offer.vendor_name || 'Local Vendor', // Fallback if name not in offer
              vendorId: offer.vendor_ids?.[0]
            };
          });
          setOffers(transformedOffers);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOffers();
  }, []);

  const getOfferColor = (color: string) => {
    return 'bg-gradient-primary'; // Force theme gradient for all
  };

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Offer & Sale</h1>
          </div>
          <p className="text-gray-900 ml-3">Curated offers from local vendors nearby</p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Fetching best deals for you...</p>
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => setSelectedOffer(offer)}
                className="group cursor-pointer"
              >
                <div className={`${getOfferColor(offer.color)} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col`}>
                  {/* Business Image / Default Cover */}
                  <div className="relative h-48 overflow-hidden bg-slate-900 flex flex-col justify-end">
                    {offer.imageUrl ? (
                      <Image
                        src={offer.imageUrl}
                        alt={offer.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-2 opacity-50">
                          <Tag size={12} className="text-white" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">Special Offer</span>
                        </div>
                        <h4 className="text-white font-black text-xl leading-tight truncate">{offer.vendorName}</h4>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg">
                        <Store size={14} className="text-white" />
                        <span className="text-white text-xs font-medium">{offer.vendorName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Offer Content */}
                  <div className="p-4 sm:p-6 text-white flex-1 flex flex-col">
                    <div className="mb-3">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">{offer.title}</h3>
                      <p className="text-white/90 text-sm sm:text-base">{offer.description}</p>
                    </div>

                    {/* Discount Badge */}
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg">
                        <Tag size={18} />
                        <span className="font-mono font-bold text-lg">{offer.code}</span>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(offer.code);
                            alert('Coupon code copied!');
                          }}
                          className="ml-2 p-1 hover:bg-white/20 rounded transition-colors cursor-pointer"
                        >
                          <Copy size={14} />
                        </div>
                      </div>
                    </div>

                    {/* Redeem Button */}
                    <button className="mt-auto w-full py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                      <span>Redeem Now</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Tag className="text-gray-300 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Offers Available</h3>
            <p className="text-gray-900">Check back later for exciting deals!</p>
          </div>
        )}
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(tab) => {
          setIsSidebarOpen(false);
          if (tab === 'home') router.push('/');
        }}
        userRole="customer"
      />

      {selectedOffer && (
        <OfferDetailModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </div>
  );
}
