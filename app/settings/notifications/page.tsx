'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, Bell, Mail, MessageSquare, ShoppingBag, Tag } from 'lucide-react';

export default function NotificationSettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    enquiries: true,
    reviews: true,
    offers: true,
    promotions: false,
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const notificationSettings = [
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      key: 'push',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Mail,
      title: 'Email Notifications',
      description: 'Receive updates via email',
      key: 'email',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: MessageSquare,
      title: 'SMS Notifications',
      description: 'Receive text message updates',
      key: 'sms',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: MessageSquare,
      title: 'New Enquiries',
      description: 'Get notified about new customer enquiries',
      key: 'enquiries',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Bell,
      title: 'New Reviews',
      description: 'Get notified when customers leave reviews',
      key: 'reviews',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Tag,
      title: 'Offers & Deals',
      description: 'Get notified about new offers and deals',
      key: 'offers',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: ShoppingBag,
      title: 'Promotions',
      description: 'Receive promotional messages and updates',
      key: 'promotions',
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => router.push('/settings')}
        onNotificationClick={() => router.push('/notifications')}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/settings')}
          className="flex items-center gap-2 text-gray-900 hover:text-orange-500 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Settings</span>
        </button>

        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Notification Settings</h1>
          <p className="text-gray-900 text-sm sm:text-base">Manage how you receive notifications</p>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
          {notificationSettings.map((setting) => {
            const Icon = setting.icon;
            const isEnabled = notifications[setting.key as keyof typeof notifications];
            return (
              <div
                key={setting.key}
                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg ${setting.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">{setting.title}</h3>
                      <p className="text-gray-900 text-sm">{setting.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => toggleNotification(setting.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(tab) => {
          setIsSidebarOpen(false);
          if (tab === 'home') router.push('/');
          else if (tab === 'settings') router.push('/settings');
        }}
        userRole="customer"
      />
    </div>
  );
}

