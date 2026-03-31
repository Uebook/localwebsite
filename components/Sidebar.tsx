'use client';

import { X, Home, Grid, Bookmark, Briefcase, HelpCircle, Settings, LogOut, User, ChevronDown, ChevronUp, Gavel, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  userRole?: 'customer' | 'vendor';
  userName?: string;
  userLocation?: string;
}

export default function Sidebar({ isOpen, onClose, onNavigate, userRole = 'customer', userName = 'Guest User', userLocation = 'Delhi, India' }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'app-menu': true,
    'partners-menu': true,
    'business-menu': userRole === 'vendor',
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Profile */}
          <div className="mb-6 p-4 bg-gradient-primary rounded-lg text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{userName}</p>
                <p className="text-sm text-white/80">{userLocation}</p>
              </div>
            </div>
            <button
              onClick={() => { onNavigate('settings'); onClose(); }}
              className="w-full py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              View Profile
            </button>
          </div>

          {/* Menu Content */}
          <div className="space-y-4">
            {userRole !== 'vendor' && (
              <>
                {/* App Menu */}
                <div>
                  <button
                    onClick={() => toggleSection('app-menu')}
                    className="w-full flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="font-semibold">App Menu</span>
                    {expandedSections['app-menu'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedSections['app-menu'] && (
                    <div className="ml-4 mt-2 space-y-1">
                      <button onClick={() => { onNavigate('home'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-orange-50 rounded-lg">
                        <Home size={20} />
                        <span>Home</span>
                      </button>
                      <button onClick={() => { onNavigate('categories'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-primary/10 rounded-lg">
                        <Grid size={20} />
                        <span>Categories</span>
                      </button>
                      <button onClick={() => { onNavigate('saved'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-primary/10 rounded-lg">
                        <Bookmark size={20} />
                        <span>Saved Items</span>
                      </button>
                      {/* <button onClick={() => { onNavigate('eauction'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-primary/10 rounded-lg">
                        <Gavel size={20} />
                        <span>E-Auction</span>
                      </button>
                      <button onClick={() => { onNavigate('draws'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-primary/10 rounded-lg">
                        <Ticket size={20} />
                        <span>Online Draws</span>
                      </button> */}
                    </div>
                  )}
                </div>

                <div className="h-px bg-gray-200" />

                {/* Partners */}
                <div>
                  <button
                    onClick={() => toggleSection('partners-menu')}
                    className="w-full flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="font-semibold">Partners</span>
                    {expandedSections['partners-menu'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedSections['partners-menu'] && (
                    <div className="ml-4 mt-2 space-y-1">
                      <button
                        onClick={() => {
                          onNavigate('register-business');
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 p-2 text-primary hover:bg-primary/10 rounded-lg font-medium"
                      >
                        <Briefcase size={20} />
                        <span>Partner with us</span>
                      </button>
                      <button onClick={() => { onNavigate('help'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-gray-50 rounded-lg">
                        <HelpCircle size={20} />
                        <span>Help & Support</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {userRole === 'vendor' && (
              <>
                <div>
                  <button
                    onClick={() => toggleSection('business-menu')}
                    className="w-full flex items-center justify-between p-3 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span className="font-semibold">Business</span>
                    {expandedSections['business-menu'] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedSections['business-menu'] && (
                    <div className="ml-4 mt-2 space-y-1">
                      <button onClick={() => { onNavigate('business-analytics'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-gray-50 rounded-lg">
                        <span>Analytics</span>
                      </button>
                      <button onClick={() => { onNavigate('business-products'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-gray-50 rounded-lg">
                        <span>Products</span>
                      </button>
                      <button onClick={() => { onNavigate('business-enquiries'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-gray-50 rounded-lg">
                        <span>Enquiries</span>
                      </button>
                      <button onClick={() => { onNavigate('business-offers'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-gray-50 rounded-lg">
                        <span>Offer & Sale</span>
                      </button>
                      <button onClick={() => { onNavigate('business-details'); onClose(); }} className="w-full flex items-center gap-3 p-2 text-gray-900 hover:bg-gray-50 rounded-lg">
                        <span>Details</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="h-px bg-gray-200" />

            {/* Settings & Logout */}
            <button onClick={() => { onNavigate('settings'); onClose(); }} className="w-full flex items-center gap-3 p-3 text-gray-900 hover:bg-gray-50 rounded-lg">
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button onClick={() => { onNavigate('logout'); onClose(); }} className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

