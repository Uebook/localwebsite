'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VendorDashboardLayout, { useVendor } from '@/components/VendorDashboardLayout';
import {
  Activity, Package, MessageSquare, Star, TrendingUp, TrendingDown,
  Users, Eye, ShoppingCart, DollarSign, BarChart3, Target, AlertCircle,
  CheckCircle, ArrowUpRight, ArrowDownRight, Clock, Search
} from 'lucide-react';

function AnalyticsContent() {
  const router = useRouter();
  const { vendor, profile, products, enquiries, reviews } = useVendor();
  const [trendingData, setTrendingData] = useState<any[]>([]);
  const [dynamicRecommendations, setDynamicRecommendations] = useState<any[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  const displayVendor = profile || vendor;

  useEffect(() => {
    async function fetchAnalytics() {
      if (!displayVendor?.city) return;
      try {
        const category = displayVendor.category || displayVendor.service || '';
        const res = await fetch(`/api/vendor/analytics/trending?city=${encodeURIComponent(displayVendor.city)}&category=${encodeURIComponent(category)}`);
        const data = await res.json();
        setTrendingData(data.trending || []);
        setDynamicRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setIsLoadingAnalytics(false);
      }
    }
    fetchAnalytics();
  }, [displayVendor?.city, displayVendor?.category]);

  if (!displayVendor) return null;

  const quickStats = [
    {
      label: 'Total Items',
      value: products.length,
      icon: Package,
      trend: '+5%',
      trendUp: true,
      color: 'bg-blue-500'
    },
    {
      label: 'Enquiries',
      value: enquiries.length,
      icon: MessageSquare,
      trend: '+12%',
      trendUp: true,
      color: 'bg-green-500'
    },
    {
      label: 'Reviews',
      value: reviews.length,
      icon: Star,
      trend: '+8%',
      trendUp: true,
      color: 'bg-yellow-500'
    },
    {
      label: 'Rating',
      value: displayVendor.rating ?? 0,
      icon: Star,
      trend: '+0.2',
      trendUp: true,
      color: 'bg-orange-500'
    },
  ];

  const performanceMetrics = [
    {
      title: 'User Engagement',
      description: 'Views and interactions',
      value: '0%',
      trend: 'none',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Page Views',
      description: 'Total profile views',
      value: (displayVendor.profileViews ?? 0).toLocaleString(),
      trend: (displayVendor.profileViews ?? 0) > 0 ? 'up' : 'none',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Conversion Rate',
      description: 'Enquiries to sales',
      value: '0%',
      trend: 'none',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenue Potential',
      description: 'Estimated monthly',
      value: '₹0',
      trend: 'none',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ];

  const competitionData: any[] = [];

  // Helper to map icon names to Lucide icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Package': return Package;
      case 'MessageSquare': return MessageSquare;
      case 'DollarSign': return DollarSign;
      case 'Clock': return Clock;
      case 'Target': return Target;
      default: return AlertCircle;
    }
  };

  const monthlyData: any[] = [];

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-6">

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{stat.trend}</span>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-gray-900 text-sm font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Performance Insights</h2>
          <button 
            onClick={() => {
              const element = document.getElementById('performance-trend');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-orange-500 text-sm font-medium hover:text-orange-600"
          >
            View Report →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.title} className={`${metric.bgColor} rounded-lg p-4`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon className={metric.color} size={24} />
                    <div>
                      <p className="font-semibold text-gray-900">{metric.title}</p>
                      <p className="text-sm text-gray-900">{metric.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
                  {metric.trend === 'up' && (
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <TrendingUp size={16} />
                      <span>Trending Up</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivation Graph */}
      <div id="performance-trend" className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Performance Trend</h2>
        <div className="space-y-4">
          {monthlyData.length > 0 ? (
            <div className="flex items-end justify-between h-48 gap-2">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${(data.value / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{data.month}</span>
                  <span className="text-xs text-gray-900 font-semibold">{data.value}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400 font-medium italic">No performance trend data available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Competition Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Competition Analysis</h2>
        <div className="overflow-x-auto">
          {competitionData.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Item</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Searches</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Market Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Lowest Nearby</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Your Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {competitionData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.item}</td>
                    <td className="py-3 px-4 text-gray-900">{item.searches}</td>
                    <td className="py-3 px-4 text-gray-900">{item.marketPrice}</td>
                    <td className="py-3 px-4 text-gray-900">{item.lowestNearby}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{item.yourPrice}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'competitive'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                        }`}>
                        {item.status === 'competitive' ? 'Competitive' : 'Higher'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
              <p className="text-sm text-gray-400 font-medium italic">Competition analysis will appear once your products gain visibility.</p>
            </div>
          )}
        </div>
      </div>

      <TrendingNearlySection 
        city={displayVendor.city || 'Noida'} 
        trending={trendingData} 
        loading={isLoadingAnalytics} 
      />

      {/* Auto Recommendations */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Auto Recommendations</h2>
          <span className="text-sm text-gray-900 font-medium">{dynamicRecommendations.length} suggestions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dynamicRecommendations.map((rec, index) => {
            const Icon = getIcon(rec.icon);
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${rec.priority === 'high'
                  ? 'border-orange-200 bg-orange-50'
                  : rec.priority === 'medium'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`${rec.priority === 'high' ? 'text-orange-600' : rec.priority === 'medium' ? 'text-blue-600' : 'text-gray-900'
                    }`} size={24} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-semibold ${rec.priority === 'high' ? 'text-orange-900' : rec.priority === 'medium' ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                        {rec.title}
                      </p>
                      {rec.priority === 'high' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                          High Priority
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${rec.priority === 'high' ? 'text-orange-700' : rec.priority === 'medium' ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                      {rec.description}
                    </p>
                    <button 
                      onClick={() => router.push('/vendor/dashboard/catalog')}
                      className={`mt-3 text-sm font-medium ${rec.priority === 'high' ? 'text-orange-600 hover:text-orange-700' :
                      rec.priority === 'medium' ? 'text-blue-600 hover:text-blue-700' :
                        'text-gray-900 hover:text-gray-700'
                      }`}
                    >
                      Take Action →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface TrendingItem {
  query: string;
  count: number;
}

function TrendingNearlySection({ 
  city, 
  trending, 
  loading 
}: { 
  city: string, 
  trending: TrendingItem[], 
  loading: boolean 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Trending nearly in your area</h2>
          <p className="text-sm text-gray-500 font-medium">What customers are searching for in {city}</p>
        </div>
        <TrendingUp className="text-orange-500" size={24} />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : trending.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {trending.map((item, index) => (
            <button
              key={index}
              onClick={() => window.open(`/search?q=${encodeURIComponent(item.query)}&city=${encodeURIComponent(city)}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl hover:border-orange-200 hover:bg-orange-50 transition-all cursor-pointer group"
            >
              <Search size={14} className="text-slate-400 group-hover:text-orange-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{item.query}</span>
              <span className="text-xs font-black text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-md">
                {item.count}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-500 font-medium italic">No trending data available for this area yet.</p>
        </div>
      )}
    </div>
  );
}


export default function VendorAnalyticsPage() {
  return (
    <VendorDashboardLayout>
      <AnalyticsContent />
    </VendorDashboardLayout>
  );
}
