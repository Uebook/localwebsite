'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Info, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined
    const hasConsented = localStorage.getItem('lokall_cookie_consent');
    if (!hasConsented) {
      // Delay showing the popup for a smoother experience
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('lokall_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('lokall_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-[9999] max-w-sm w-[calc(100vw-3rem)]"
        >
          <div className="relative overflow-hidden bg-slate-900/98 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl p-7 shadow-black/60">
            {/* Decorative background element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 bg-orange-500/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/5">
                  <ShieldCheck className="text-orange-500" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-widest">Privacy First</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">Choice & Control</p>
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="ml-auto p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!showDetails ? (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <p className="text-slate-300 text-sm leading-relaxed mb-8 font-medium">
                      We use cookies to personalize your experience, remember your location, and keep you secure.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 space-y-4"
                  >
                    {[
                      { title: 'Essential', desc: 'Secure login and basic session storage.' },
                      { title: 'Preferences', desc: 'Saves your selected city and markets.' },
                      { title: 'Analytics', desc: 'Helps us improve search speed for your area.' }
                    ].map((item) => (
                      <div key={item.title} className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                        <h4 className="text-orange-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.title}</h4>
                        <p className="text-slate-400 text-xs font-semibold leading-snug">{item.desc}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAccept}
                  className="group relative w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-[0.98]"
                >
                  Accept All Cookies
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleDecline}
                    className="flex-1 py-3.5 border border-white/10 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/5 hover:text-slate-300 transition-all"
                  >
                    Essential Only
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={`flex-1 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      showDetails ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    <Info size={14} />
                    {showDetails ? 'Summary' : 'Details'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
