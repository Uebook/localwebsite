'use client';

import { X, ZoomIn, ShoppingCart, MessageCircle, Phone, Tag, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProductDetailModalProps {
       product: any;
       vendorName: string;
       onClose: () => void;
       onWhatsApp: () => void;
       onCall: () => void;
       onEnquiry: () => void;
}

export default function ProductDetailModal({
       product,
       vendorName,
       onClose,
       onWhatsApp,
       onCall,
       onEnquiry
}: ProductDetailModalProps) {
       const [isZoomed, setIsZoomed] = useState(false);

       if (!product) return null;

       return (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
                     {/* Backdrop */}
                     <div
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                            onClick={onClose}
                     />

                     {/* Modal Container */}
                     <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">

                            {/* Close Button */}
                            <button
                                   onClick={onClose}
                                   className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-900 shadow-md transition-all active:scale-90"
                            >
                                   <X size={24} />
                            </button>

                            {/* Left: Image Section */}
                            <div className="md:w-1/2 relative bg-slate-50 flex flex-col">
                                   <div className={`relative flex-1 min-h-[300px] overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                                          onClick={() => setIsZoomed(!isZoomed)}>
                                          {product.image_url ? (
                                                 <Image
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        fill
                                                        className={`object-contain transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                                 />
                                          ) : (
                                                 <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                                        <span>No Image Available</span>
                                                 </div>
                                          )}

                                          {!isZoomed && (
                                                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 pointer-events-none">
                                                        <ZoomIn size={14} />
                                                        Click to Zoom
                                                 </div>
                                          )}
                                   </div>

                                   {/* Thumbnails / Extra Info */}
                                   <div className="p-4 flex gap-2 overflow-x-auto border-t border-slate-100 bg-white">
                                          <div className="w-16 h-16 rounded-lg border-2 border-primary overflow-hidden relative group shrink-0">
                                                 <Image src={product.image_url || ''} alt="main" fill className="object-cover" />
                                          </div>
                                          {/* Dynamic thumbnails could go here */}
                                   </div>
                            </div>

                            {/* Right: Content Section */}
                            <div className="md:w-1/2 p-8 md:p-10 overflow-y-auto bg-white flex flex-col">
                                   <div className="mb-6">
                                          <div className="flex items-center gap-2 mb-2">
                                                 <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                        {product.category_name || 'Product'}
                                                 </span>
                                                 {product.online_price && product.online_price > product.price && (
                                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                               Save ₹{product.online_price - product.price} vs Online
                                                        </span>
                                                 )}
                                          </div>
                                          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{product.name}</h2>
                                          <p className="text-sm font-bold text-slate-400">Offered by <span className="text-primary">{vendorName}</span></p>
                                   </div>

                                   <div className="flex items-center gap-6 mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                          <div className="space-y-1">
                                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Lokall Price</p>
                                                 <p className="text-4xl font-black text-slate-900">₹{product.price}</p>
                                          </div>
                                          {(product.online_price || product.mrp) && (
                                                 <div className="h-12 w-px bg-slate-200" />
                                          )}
                                          {product.online_price && (
                                                 <div className="space-y-1">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Online Price</p>
                                                        <p className="text-xl font-bold text-slate-300 line-through">₹{product.online_price}</p>
                                                 </div>
                                          )}
                                          {product.mrp && product.mrp > (product.online_price || product.price) && (
                                                 <div className="space-y-1 ml-auto text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">MRP</p>
                                                        <p className="text-sm font-bold text-slate-200 line-through">₹{product.mrp}</p>
                                                 </div>
                                          )}
                                   </div>

                                   <div className="space-y-6 flex-1">
                                          <div>
                                                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                        <Tag size={16} className="text-primary" />
                                                        Product Details
                                                 </h3>
                                                 <p className="text-slate-500 text-sm leading-relaxed">
                                                        {product.description || 'No detailed description provided by the vendor. Please contact them for more information regarding specifications, quality, and availability.'}
                                                 </p>
                                          </div>

                                          <div className="grid grid-cols-2 gap-4">
                                                 <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-3">
                                                        <ShieldCheck className="text-blue-500 shrink-0" size={20} />
                                                        <div>
                                                               <p className="text-[10px] font-bold text-blue-600 uppercase">Authentic</p>
                                                               <p className="text-xs font-bold text-slate-700">Genuine Product</p>
                                                        </div>
                                                 </div>
                                                 <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex items-start gap-3">
                                                        <Tag className="text-orange-500 shrink-0" size={20} />
                                                        <div>
                                                               <p className="text-[10px] font-bold text-orange-600 uppercase">Best Deal</p>
                                                               <p className="text-xs font-bold text-slate-700">Cheaper than Online</p>
                                                        </div>
                                                 </div>
                                          </div>
                                   </div>

                                   {/* CTAs */}
                                   <div className="mt-10 space-y-3">
                                          <div className="grid grid-cols-2 gap-3">
                                                 <a
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); onWhatsApp(); }}
                                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-green-200 active:scale-95"
                                                 >
                                                        <MessageCircle size={18} />
                                                        WhatsApp
                                                 </a>
                                                 <a
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); onCall(); }}
                                                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-slate-200 active:scale-95"
                                                 >
                                                        <Phone size={18} />
                                                        Call Now
                                                 </a>
                                          </div>
                                          <button
                                                 onClick={onEnquiry}
                                                 className="w-full py-4 bg-gradient-to-r from-orange-500 to-primary text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-200 active:scale-95"
                                          >
                                                 Direct Enquiry to Vendor
                                          </button>
                                   </div>
                            </div>
                     </div>
              </div>
       );
}
