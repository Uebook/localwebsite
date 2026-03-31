'use client';

import { useRouter } from 'next/navigation';
import VendorDashboardLayout, { useVendor } from '@/components/VendorDashboardLayout';
import { Activity, Package, MessageSquare, Star, CheckCircle, XCircle, AlertCircle, ArrowRight, Download } from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const { vendor, profile, products, enquiries, reviews } = useVendor();

  const displayVendor = profile || vendor;
  if (!displayVendor) return null;

  // Profile completion score
  const fields = [
    displayVendor.name, displayVendor.category, displayVendor.phone,
    displayVendor.email, displayVendor.address, displayVendor.city,
    displayVendor.about, displayVendor.imageUrl,
  ];
  const filled = fields.filter(Boolean).length;
  const profileCompletion = Math.round((filled / fields.length) * 100);

  const kycStatus = displayVendor.kycStatus ?? 'Pending';
  const activationStatus = displayVendor.status ?? 'Pending';

  return (
    <div className="p-4 sm:p-6 space-y-5">

      {/* Profile Completion */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-900">Profile Completion</h3>
            <p className="text-xs text-slate-400 mt-0.5">Complete your profile to get more visibility</p>
          </div>
          <span className="text-2xl font-black" style={{ color: profileCompletion >= 80 ? 'var(--primary)' : '#f59e0b' }}>
            {profileCompletion}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion}%`, background: 'var(--primary)' }}
          />
        </div>
        {profileCompletion < 100 && (
          <button
            onClick={() => router.push('/vendor/dashboard/profile')}
            className="mt-3 text-xs font-bold flex items-center gap-1 hover:opacity-80 transition-colors"
            style={{ color: 'var(--primary)' }}
          >
            Complete Profile <ArrowRight size={12} />
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Products', value: products.length, color: 'bg-blue-50 text-blue-600', href: '/vendor/dashboard/catalog' },
          { icon: MessageSquare, label: 'Enquiries', value: enquiries.length, color: 'bg-purple-50 text-purple-600', href: '/vendor/dashboard/enquiries' },
          { icon: Star, label: 'Reviews', value: reviews.length, color: 'bg-amber-50 text-amber-600', href: '/vendor/dashboard/reviews' },
          { icon: Activity, label: 'Rating', value: `${displayVendor.rating || 0}★`, color: 'bg-green-50 text-green-600', href: '/vendor/dashboard/analytics' },
        ].map(({ icon: Icon, label, value, color, href }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-xl font-black text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Account Status</h3>
          {displayVendor.id && (
            <span className="text-xs font-bold text-slate-400">
              ID: {String(displayVendor.id).slice(0, 8).toUpperCase()}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: 'KYC Status',
              value: kycStatus,
              isGreen: kycStatus === 'Approved',
              isRed: kycStatus === 'Rejected',
            },
            {
              label: 'Activation',
              value: activationStatus,
              isGreen: activationStatus === 'Active',
            },
            {
              label: 'Plan',
              value: 'Free Listing',
              isGreen: true,
            },
          ].map(({ label, value, isGreen, isRed }) => (
            <div key={label}>
              <p className="text-xs text-slate-400 font-medium mb-1.5">{label}</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${isRed ? 'bg-red-50 text-red-700' : isGreen ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                }`}>
                {isRed ? <XCircle size={12} /> : isGreen ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Enquiries */}
      {enquiries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Recent Enquiries</h3>
            <button
              onClick={() => router.push('/vendor/dashboard/enquiries')}
              className="text-xs font-bold hover:opacity-70 transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {enquiries.slice(0, 3).map((enq: any) => (
              <div key={enq.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={14} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {enq.customer_name || enq.name || 'Customer Enquiry'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{enq.message || enq.service || ''}</p>
                </div>
                <span className="text-xs text-slate-300 flex-shrink-0">
                  {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Add Product', icon: Package, href: '/vendor/dashboard/catalog', color: 'text-blue-500' },
            { label: 'Bulk Update', icon: Download, href: '/vendor/dashboard/bulk-update', color: 'text-orange-500' },
            { label: 'View Enquiries', icon: MessageSquare, href: '/vendor/dashboard/enquiries', color: 'text-purple-500' },
            { label: 'Edit Profile', icon: Activity, href: '/vendor/dashboard/profile', color: 'text-green-500' },
          ].map(({ label, icon: Icon, href, color }) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Icon className={color} size={22} />
              <span className="text-xs font-semibold text-slate-700">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VendorDashboardPage() {
  return (
    <VendorDashboardLayout>
      <DashboardContent />
    </VendorDashboardLayout>
  );
}
