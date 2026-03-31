'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Bell, Loader2, Info, CheckCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Helper to format timestamps to relative time
  const formatTime = (dateString: string) => {
    if (!dateString) return 'Just now';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return past.toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'success': return <CheckCircle className="text-emerald-500" size={18} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={18} />;
      case 'error': return <AlertCircle className="text-red-500" size={18} />;
      default: return <Info className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header
        onMenuClick={() => setIsSidebarOpen(true)}
        onProfileClick={() => router.push('/settings')}
        onNotificationClick={() => router.push('/notifications')}
      />

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-orange-50">
              <Bell size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
              <p className="text-slate-500 text-sm font-medium">Alerts and updates from the market</p>
            </div>
          </div>
          {notifications.length > 0 && !loading && (
             <span className="px-3 py-1 bg-slate-200 text-slate-700 text-[10px] font-black uppercase rounded-full tracking-widest leading-none">
              {notifications.length} Total
             </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-orange-500" size={40} />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Fetching alerts...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="text-slate-200" size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No notifications yet</h2>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">We'll let you know when there's an update about your orders or local market deals.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {notifications.map((notification, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={notification.id}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 shrink-0 p-2 bg-slate-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <h3 className="text-base font-black text-slate-900 leading-tight truncate">{notification.title}</h3>
                        <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 bg-slate-50 rounded-lg group-hover:bg-orange-50 transition-all border border-transparent group-hover:border-orange-100">
                          <Clock size={10} className="text-slate-400 group-hover:text-orange-500" />
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-orange-600 whitespace-nowrap">
                            {formatTime(notification.sent_at || notification.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium mb-3">
                        {notification.message}
                      </p>
                      
                      {notification.topic && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                          #{notification.topic}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Decorative element for unread or important notifications can be added here */}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={(tab) => {
          setIsSidebarOpen(false);
          if (tab === 'home') router.push('/');
        }}
        userRole="customer"
      />
    </div>
  );
}

