'use client';

import { MapPin, Store, TrendingUp, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  type?: 'product' | 'vendor' | 'category';
  price: number;
  mrp?: number;
  image?: string;
  vendor_id?: string;
  vendor: {
    id: string;
    name: string;
    city: string;
    distance?: string;
  };
}

interface SearchSuggestionsProps {
  suggestions: Product[];
  isLoading: boolean;
  onSelect: (product: Product) => void;
  isVisible: boolean;
}

export default function SearchSuggestions({ suggestions, isLoading, onSelect, isVisible }: SearchSuggestionsProps) {
  if (!isVisible || (!isLoading && suggestions.length === 0)) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[450px] flex flex-col">
      <div className="p-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {isLoading ? 'Searching...' : `${suggestions.length} Results Found`}
        </span>
        {!isLoading && suggestions.length > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-lg border border-emerald-100 animate-pulse">
             <TrendingUp size={10} className="text-emerald-500" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Low Price First</span>
          </div>
        )}
      </div>

      <div className="overflow-y-auto flex-1 custom-scrollbar">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center gap-3">
             <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
             <p className="text-xs font-bold text-slate-400">Finding the best local prices...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {suggestions.map((product, index) => (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                key={product.id}
                onClick={() => onSelect(product)}
                className="w-full flex items-center gap-4 p-4 hover:bg-orange-50/50 transition-all group text-left"
              >
                {/* Product Image */}
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100 group-hover:border-orange-200 transition-colors">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Store size={20} />
                    </div>
                  )}
                </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {product.type === 'vendor' && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[9px] font-black uppercase rounded-md flex-shrink-0">Vendor</span>
                          )}
                          {product.type === 'category' && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[9px] font-black uppercase rounded-md flex-shrink-0">Category</span>
                          )}
                          <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-orange-600 transition-all">
                            {product.name || 'Unnamed Item'}
                          </h4>
                        </div>
                        
                        {product.type === 'product' && (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-slate-500 overflow-hidden">
                              <Store size={12} className="text-orange-400 flex-shrink-0" />
                              <span className="text-[11px] font-semibold truncate uppercase tracking-tight">
                                {product.vendor?.name || 'Local Store'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
                              <MapPin size={10} />
                              <span className="text-[10px] font-bold">
                                {product.vendor?.distance || 'Local'}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {(product.type === 'vendor' || product.type === 'category') && (
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                            Click to explore {product.type === 'vendor' ? 'store' : 'category'}
                          </p>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        {product.price > 0 && (
                          <div className="px-2 py-1 bg-slate-900 rounded-lg shadow-sm group-hover:bg-orange-500 transition-colors">
                            <p className="text-sm font-black text-white leading-none">
                              ₹{product.price}
                            </p>
                          </div>
                        )}
                        {product.mrp && product.mrp > product.price && (
                          <p className="text-[9px] font-bold text-slate-400 line-through mt-1 text-right w-full">
                            ₹{product.mrp}
                          </p>
                        )}
                        {product.type === 'vendor' && (
                          <div className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                             ENTER
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                 <div className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    <ChevronRight size={16} className="text-orange-400" />
                 </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             Press Enter to see all results
           </p>
        </div>
      )}
    </div>
  );
}
