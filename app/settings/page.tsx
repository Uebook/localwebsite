'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Settings, User, Bell, HelpCircle, LogOut, ShoppingBag, ChevronRight, CheckCircle, MessageCircle, Palette } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';
import { FESTIVAL_THEMES } from '@/lib/festivalThemes';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      description: 'Manage your personal information',
      href: '/settings/profile',
      color: 'text-blue-600',
      onClick: () => router.push('/settings/profile')
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Control notification preferences',
      href: '/settings/notifications',
      color: 'text-orange-600',
      onClick: () => router.push('/settings/notifications')
    },
    {
      icon: MessageCircle,
      label: 'Give Feedback',
      description: 'Share your thoughts and suggestions',
      href: '#',
      color: 'text-green-600',
      onClick: () => setShowFeedback(true)
    },
    {
      icon: Palette,
      label: 'Festival Themes',
      description: 'Choose your favorite festival theme',
      href: '#',
      color: 'text-purple-600',
      onClick: () => setShowThemes(true)
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support',
      href: '/help',
      color: 'text-purple-600',
      onClick: () => router.push('/help')
    },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      router.push('/login');
    }
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-900 text-sm sm:text-base">Manage your account settings and preferences</p>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 p-4 sm:p-6 hover:bg-orange-50 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0`}>
                  <Icon className={item.color} size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 text-base sm:text-lg mb-1">{item.label}</p>
                  <p className="text-gray-900 text-sm">{item.description}</p>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" size={20} />
              </button>
            );
          })}
        </div>

        {/* App Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShoppingBag className="text-white" size={32} />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle className="text-white" size={14} />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Local Market</h3>
          <p className="text-gray-900 text-sm sm:text-base mb-1">Your local business directory</p>
          <p className="text-gray-900 text-xs sm:text-sm font-medium">Version 1.0.0</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-md text-base sm:text-lg"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(tab) => {
          setIsSidebarOpen(false);
          if (tab === 'home') router.push('/');
          else if (tab === 'settings') router.push('/settings');
          else if (tab === 'categories') router.push('/categories');
          else if (tab === 'saved') router.push('/saved');
        }}
        userRole="customer"
      />

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Give Feedback</h2>
              <button
                onClick={() => setShowFeedback(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 rotate-90" />
              </button>
            </div>
            <FeedbackForm
              onBack={() => setShowFeedback(false)}
              userRole="user"
              onSubmit={(data) => {
                console.log('Feedback submitted:', data);
                setShowFeedback(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Themes Modal */}
      {showThemes && (
        <ThemeSelectorModal onClose={() => setShowThemes(false)} />
      )}
    </div>
  );
}

function ThemeSelectorModal({ onClose }: { onClose: () => void }) {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const loadTheme = async () => {
      // Try to get user ID from localStorage
      const userId = localStorage.getItem('userId');
      const userPhone = localStorage.getItem('userPhone');
      const userEmail = localStorage.getItem('userEmail');

      let themeToUse = localStorage.getItem('selectedFestivalTheme') || 'default';

      // If user is identified, try to fetch theme from database
      if (userId || userPhone || userEmail) {
        try {
          const params = new URLSearchParams();
          if (userId) params.set('userId', userId);
          else if (userPhone) params.set('phone', userPhone);
          else if (userEmail) params.set('email', userEmail);

          const res = await fetch(`/api/user/theme?${params.toString()}`);
          if (res.ok) {
            const data = await res.json();
            if (data.theme) {
              themeToUse = data.theme;
            }
          }
        } catch (error) {
          console.error('Error loading theme from database:', error);
        }
      }

      setSelectedTheme(themeToUse);
    };

    loadTheme();
  }, [setTheme]);

  const themes = [
    { id: 'default', name: 'Default', icon: '🎨', description: 'Red & Orange (Default)', colors: ['#E86A2C', '#4A6CF7'] },
    ...Object.values(FESTIVAL_THEMES).map((theme: any) => ({
      id: theme.id,
      name: theme.name,
      icon: theme.icon,
      description: theme.description,
      colors: [theme.colors.primary, theme.colors.secondary]
    }))
  ];

  const handleThemeSelect = async (themeId: string) => {
    setSelectedTheme(themeId);
    setLoading(true);
    try {
      await setTheme(themeId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Festival Themes</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 rotate-90" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme.id)}
              disabled={loading}
              className={`p-4 rounded-lg border-2 transition ${selectedTheme === theme.id
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}
                />
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">{theme.icon} {theme.name}</p>
                  <p className="text-xs text-gray-600">{theme.description}</p>
                </div>
                {selectedTheme === theme.id && (
                  <CheckCircle className="text-orange-500" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>
        {loading && (
          <div className="px-6 pb-6 text-center text-sm text-gray-500">
            Saving theme preference...
          </div>
        )}
      </div>
    </div>
  );
}
