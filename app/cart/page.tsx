'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import { getCart, removeFromCart, updateQuantity, clearCart, CartItem } from '@/lib/cart';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Phone, MessageCircle, MapPin, ExternalLink, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [vendorDetails, setVendorDetails] = useState<Record<string, any>>({});
  const [loadingVendors, setLoadingVendors] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const refreshCart = () => {
      setItems(getCart());
    };
    refreshCart();
    window.addEventListener('cartchange', refreshCart);
    return () => window.removeEventListener('cartchange', refreshCart);
  }, []);

  // Fetch vendor details for all unique vendors in cart
  useEffect(() => {
    if (items.length === 0) return;

    const uniqueVendorIds = Array.from(new Set(items.map(item => item.vendorId)));
    
    // Only fetch if we don't have all details yet
    const missingIds = uniqueVendorIds.filter(id => !vendorDetails[id]);
    if (missingIds.length === 0) return;

    const fetchDetails = async () => {
      setLoadingVendors(true);
      try {
        const details: Record<string, any> = { ...vendorDetails };
        await Promise.all(missingIds.map(async (id) => {
          try {
            const res = await fetch(`/api/vendor/profile?id=${id}`);
            const data = await res.json();
            if (!data.error) {
              details[id] = data.vendor;
            }
          } catch (err) {
            console.error(`Failed to fetch vendor ${id}:`, err);
          }
        }));
        setVendorDetails(details);
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchDetails();
  }, [items]);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Group items by vendor
  const groupedItems = useMemo(() => {
    const groups: Record<string, { vendorName: string, vendorId: string, items: CartItem[] }> = {};
    items.forEach(item => {
      if (!groups[item.vendorId]) {
        groups[item.vendorId] = {
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          items: []
        };
      }
      groups[item.vendorId].items.push(item);
    });
    return Object.values(groups);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="text-slate-300" size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">Your basket is empty</h1>
          <p className="text-slate-500 font-bold mb-10">Start adding items from your local vendors to build your basket!</p>
          <button
            onClick={() => router.push('/')}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl"
          >
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  const getWhatsappLink = (vendor: any) => {
    let phone = vendor?.whatsappNumber || vendor?.phone || vendor?.contactNumber;
    if (!phone) return '#';
    let cleanPhone = phone.toString().replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    return `https://wa.me/${cleanPhone}`;
  };

  const getCallLink = (vendor: any) => {
    const phone = vendor?.phone || vendor?.contactNumber;
    if (!phone) return '#';
    return `tel:${phone.toString().replace(/\D/g, '')}`;
  };

  const getDirectionLink = (vendor: any) => {
    const query = encodeURIComponent(`${vendor?.name} ${vendor?.address || ''} ${vendor?.city || ''}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12 pb-32 lg:pb-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="text-center">
             <h1 className="text-2xl font-black text-slate-900">Your Basket</h1>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct Vendor Connect</p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-black text-red-500 uppercase tracking-widest hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {groupedItems.map((group) => {
              const vendor = vendorDetails[group.vendorId];
              return (
                <div key={group.vendorId} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  {/* Vendor Header */}
                  <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                        <ShoppingBag size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">{group.vendorName}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {vendor?.city || 'Local Vendor'}
                        </p>
                      </div>
                    </div>
                    <Link href={`/vendor/${group.vendorId}`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                      View Store →
                    </Link>
                  </div>

                  {/* Items list */}
                  <div className="divide-y divide-slate-50">
                    {group.items.map((item) => (
                      <div key={item.id} className="p-5 flex gap-5 items-center group">
                        {item.image && (
                          <div className="w-20 h-20 rounded-2xl overflow-hidden relative shrink-0 border border-slate-100">
                            <img src={item.image} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" alt="" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-slate-900 truncate mb-1">{item.name}</h3>
                          <p className="text-lg font-black text-primary">₹{item.price}</p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-xl border border-slate-100">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-white rounded-lg transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-black text-slate-900 min-w-[20px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-white rounded-lg transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] font-black text-slate-300 hover:text-red-500 uppercase tracking-widest transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vendor Actions */}
                  <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex flex-wrap gap-3">
                    <a
                      href={getWhatsappLink(vendor)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-green-100"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <a
                      href={getCallLink(vendor)}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-md shadow-slate-200"
                    >
                      <Phone size={14} /> Call Now
                    </a>
                    <a
                      href={getDirectionLink(vendor)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                    >
                      <MapPin size={14} /> Get Shop Direction
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar / Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                Order Value
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-auto">{items.length} Items</span>
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>Items Total</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>Visit & Pickup</span>
                  <span className="text-green-600 font-black">LOCAL PRICE</span>
                </div>
                <div className="h-px bg-slate-100 my-4" />
                <div className="flex justify-between text-2xl font-black text-slate-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 mb-6">
                 <div className="flex gap-3">
                   <Info className="text-orange-500 shrink-0" size={18} />
                   <p className="text-[11px] font-bold text-orange-800 leading-relaxed">
                     LOKALL doesn't handle payments. Contact the vendors above directly to confirm availability and pick up your items.
                   </p>
                 </div>
              </div>

              <button
                onClick={() => router.push('/')}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl active:scale-95"
              >
                Add More Items
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar - Simplified */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-8 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</p>
            <p className="text-xl font-black text-slate-900">₹{total}</p>
          </div>
          <button
            onClick={() => {
              const el = document.querySelector('.lg\\:col-span-8');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95"
          >
            Contact Vendors
          </button>
        </div>
      </div>
    </div>
  );
}
