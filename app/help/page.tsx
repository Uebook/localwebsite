'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';

export default function HelpPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [settings, setSettings] = useState({
    support_phone: '+91 98765 43210',
    support_email: 'support@lokall.com'
  });
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      } catch (error) {
        console.error('Error fetching help settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const faqs = [
    {
      id: '1',
      question: 'How do I search for businesses?',
      answer: 'You can use the search bar on the home page or browse categories to find businesses in your area. Simply type what you\'re looking for and browse the results.',
    },
    {
      id: '2',
      question: 'How do I save a business?',
      answer: 'Click on the heart icon when viewing a business to save it to your favorites. You can access all saved businesses from the "Saved" tab in the navigation.',
    },
    {
      id: '3',
      question: 'How do I contact a business?',
      answer: 'You can send an enquiry through the business profile page or call them directly using the contact button. Some businesses also have WhatsApp integration for quick communication.',
    },
    {
      id: '4',
      question: 'How do I register my business?',
      answer: 'Click on "Partner with us" in the menu or go to the vendor registration page. Fill out the required information and submit your application for review.',
    },
    {
      id: '5',
      question: 'How do I update my business information?',
      answer: 'Log in to your vendor dashboard and go to the Profile section. Click "Edit Profile" to update your business details, hours, and other information.',
    },
    {
      id: '6',
      question: 'How do I manage my products?',
      answer: 'In your vendor dashboard, go to the Catalog tab. From there, you can add new products, edit existing ones, or remove items from your catalog.',
    },
  ];

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => router.push('/settings')}
        onNotificationClick={() => router.push('/notifications')}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-lg flex items-center justify-center">
            <HelpCircle className="text-orange-500" size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-900 text-sm sm:text-base mt-1">Find answers to common questions</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200 mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-semibold text-gray-900 text-base sm:text-lg pr-4">{faq.question}</span>
                {expandedItems[faq.id] ? (
                  <ChevronUp className="text-gray-400 flex-shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                )}
              </button>
              {expandedItems[faq.id] && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-gray-900 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl shadow-lg p-6 sm:p-8 text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Still need help?</h3>
          <p className="text-white/90 mb-6 text-sm sm:text-base">Contact our support team for assistance</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href={`mailto:${settings.support_email}`}
              className="flex flex-col items-center gap-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              <Mail size={24} />
              <span className="font-medium text-sm">Email Support</span>
            </a>
            <a 
              href={`tel:${settings.support_phone}`}
              className="flex flex-col items-center gap-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
            >
              <Phone size={24} />
              <span className="font-medium text-sm">Call Support</span>
            </a>
          </div>
        </div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(tab) => {
          setIsSidebarOpen(false);
          if (tab === 'home') router.push('/');
          else if (tab === 'help') router.push('/help');
          else if (tab === 'settings') router.push('/settings');
        }}
        userRole="customer"
      />
    </div>
  );
}
