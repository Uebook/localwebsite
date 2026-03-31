'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, User, Mail, Phone, MapPin, Save, Edit } from 'lucide-react';
import Image from 'next/image';
import { INDIAN_STATES, STATE_CITIES } from '@/lib/locationData';

export default function ProfileSettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    address: '123 Main Street',
    state: 'Delhi',
    city: 'Delhi',
    pincode: '110001',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  });

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, save to backend
    alert('Profile updated successfully!');
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-900 text-sm sm:text-base">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-orange-500 flex-shrink-0">
              <Image
                src={profileData.imageUrl}
                alt={profileData.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="text-2xl sm:text-3xl font-bold mb-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                />
              ) : (
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
              )}
              <p className="text-gray-900 text-sm sm:text-base">Member since 2024</p>
              <p className="text-orange-600 text-xs sm:text-sm font-bold mt-1">ID: USER-884291-LM</p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${isEditing
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
            >
              {isEditing ? <Save size={20} /> : <Edit size={20} />}
              <span>{isEditing ? 'Save' : 'Edit'}</span>
            </button>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="text-blue-600" size={24} />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900 py-3">{profileData.name}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-green-600" size={24} />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900 py-3">{profileData.email}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="text-orange-600" size={24} />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900 py-3">{profileData.phone}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="text-purple-600" size={24} />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      placeholder="Street Address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value, city: '' })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <select
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        disabled={!profileData.state}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white disabled:bg-gray-50"
                      >
                        <option value="">Select City</option>
                        {profileData.state && STATE_CITIES[profileData.state]?.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      value={profileData.pincode}
                      onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                      placeholder="Pincode"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 py-3">
                    {profileData.address}, {profileData.city}, {profileData.state} - {profileData.pincode}
                  </p>
                )}
              </div>
            </div>
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

