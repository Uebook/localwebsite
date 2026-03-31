'use client';

import { X, Tag, Copy, Calendar, ShieldCheck, MapPin, ExternalLink, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface OfferDetailModalProps {
       offer: any;
       onClose: () => void;
}

export default function OfferDetailModal({ offer, onClose }: OfferDetailModalProps) {
       const [copied, setCopied] = useState(false);

       const handleCopy = () => {
              navigator.clipboard.writeText(offer.code || 'LOKALL');
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
       };

       if (!offer) return null;

       return (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                     {/* Backdrop */}
                     <div
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                            onClick={onClose}
                     />

                     {/* Modal Container */}
                     <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                            {/* Header Color Strip */}
                            <div className={`h-4 w-full bg-gradient-to-r ${offer.color || 'from-orange-500 to-rose-500'}`} />

                            <button
                                   onClick={onClose}
                                   className="absolute top-8 right-6 z-50 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-all active:scale-90"
                            >
                                   <X size={20} />
                            </button>

                            <div className="p-8 sm:p-10">
                                   {/* Logo & Category */}
                                   <div className="flex items-center gap-3 mb-6">
                                          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                                 <Tag size={24} />
                                          </div>
                                          <div>
                                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{offer.circle || 'All India Offer'}</span>
                                                 <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter">{offer.title}</h2>
                                          </div>
                                   </div>

                                   {/* Description */}
                                   <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-8">
                                          <p className="text-slate-600 leading-relaxed font-medium">
                                                 {offer.description || 'Enjoy this exclusive local deal. Limited time offer available at participating vendors.'}
                                          </p>
                                   </div>

                                   {/* Details Grid */}
                                   <div className="grid grid-cols-2 gap-4 mb-8">
                                          <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                                 <div className="flex items-center gap-2 mb-1">
                                                        <Calendar size={14} className="text-blue-500" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valid Until</span>
                                                 </div>
                                                 <p className="text-sm font-bold text-slate-700">{offer.validUntil || 'Dec 31, 2026'}</p>
                                          </div>
                                          <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                                 <div className="flex items-center gap-2 mb-1">
                                                        <ShieldCheck size={14} className="text-emerald-500" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified by</span>
                                                 </div>
                                                 <p className="text-sm font-bold text-slate-700">LOKALL Team</p>
                                          </div>
                                   </div>

                                   {/* Coupon Code Section */}
                                   <div className="bg-slate-900 rounded-3xl p-8 mb-8 relative overflow-hidden group">
                                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                 <Tag size={80} className="text-white rotate-12" />
                                          </div>
                                          <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-3">Copy Promo Code</p>
                                          <div className="flex items-center justify-between gap-4">
                                                 <span className="text-3xl font-black text-white tracking-widest font-mono">{offer.code || 'FESTIVE'}</span>
                                                 <button
                                                        onClick={handleCopy}
                                                        className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${copied ? 'bg-green-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'}`}
                                                 >
                                                        {copied ? 'Copied!' : 'Copy'}
                                                 </button>
                                          </div>
                                   </div>

                                   {/* Action Buttons */}
                                   <div className="flex flex-col sm:flex-row gap-4">
                                          <button
                                                 onClick={onClose}
                                                 className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-sm transition-all"
                                          >
                                                 Remind Me Later
                                          </button>
                                          <button
                                                 onClick={() => {
                                                        if (offer.business?.id) window.location.href = `/vendor/${offer.business.id}`;
                                                        else onClose();
                                                 }}
                                                 className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-primary text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-orange-200 active:scale-95"
                                          >
                                                 Visit Vendor Store
                                          </button>
                                   </div>
                            </div>

                            {/* Support Link */}
                            <div className="px-10 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                   <p className="text-xs text-slate-400 font-bold">Have an issue with this deal?</p>
                                   <button className="flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-orange-500 transition-colors">
                                          <MessageCircle size={14} /> Contact Support
                                   </button>
                            </div>
                     </div>
              </div>
       );
}
