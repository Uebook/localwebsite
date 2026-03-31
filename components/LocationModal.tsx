'use client';

import { X } from 'lucide-react';
import LocationSelector from './LocationSelector';

interface LocationModalProps {
       isOpen: boolean;
       onClose: () => void;
       onSelect: (location: any) => void;
       initialLocation?: any;
}

export default function LocationModal({
       isOpen,
       onClose,
       onSelect,
       initialLocation
}: LocationModalProps) {
       if (!isOpen) return null;

       return (
              <div className="fixed inset-0 z-[100] flex items-center justify-center">
                     {/* Backdrop */}
                     <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                            onClick={onClose}
                     />

                     {/* Modal Content */}
                     <div className="relative z-10 w-full max-w-2xl bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                            {/* Header (Custom) */}
                            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                                   <h2 className="text-2xl font-black text-slate-900">Change Market</h2>
                                   <button
                                          onClick={onClose}
                                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all active:scale-95"
                                   >
                                          <X size={20} />
                                   </button>
                            </div>

                            {/* The Selector */}
                            <div className="flex-1 overflow-y-auto">
                                   <LocationSelector
                                          onSelect={(loc) => {
                                                 onSelect(loc);
                                                 onClose();
                                          }}
                                          initialLocation={initialLocation}
                                   />
                            </div>
                     </div>
              </div>
       );
}
