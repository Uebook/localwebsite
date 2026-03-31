'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, Shield, Lock, Eye, Trash2, Key } from 'lucide-react';

export default function PrivacySettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    dataSharing: true,
  });

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested. Please contact support for assistance.');
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Privacy & Security</h1>
          <p className="text-gray-900 text-sm sm:text-base">Manage your privacy and security settings</p>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">Profile Visibility</h3>
                <p className="text-gray-900 text-sm">Control who can see your profile</p>
              </div>
            </div>
            <div className="space-y-2">
              {['public', 'friends', 'private'].map((option) => (
                <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value={option}
                    checked={privacySettings.profileVisibility === option}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-900 capitalize font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Lock className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">Contact Information</h3>
                <p className="text-gray-900 text-sm">Control visibility of your contact details</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Show Email Address</p>
                  <p className="text-sm text-gray-900">Allow others to see your email</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.showEmail}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, showEmail: e.target.checked })}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Show Phone Number</p>
                  <p className="text-sm text-gray-900">Allow others to see your phone number</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.showPhone}
                  onChange={(e) => setPrivacySettings({ ...privacySettings, showPhone: e.target.checked })}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
              </label>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">Data & Privacy</h3>
                <p className="text-gray-900 text-sm">Manage your data sharing preferences</p>
              </div>
            </div>
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Data Sharing</p>
                <p className="text-sm text-gray-900">Allow data sharing for improved services</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.dataSharing}
                onChange={(e) => setPrivacySettings({ ...privacySettings, dataSharing: e.target.checked })}
                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
              />
            </label>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Key className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">Change Password</h3>
                <p className="text-gray-900 text-sm">Update your account password</p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              Change Password
            </button>
          </div>

          {/* Delete Account */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 text-lg mb-1">Delete Account</h3>
                <p className="text-gray-900 text-sm">Permanently delete your account and all data</p>
              </div>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Delete Account
            </button>
          </div>
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

