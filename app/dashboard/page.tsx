'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import {
    User, MapPin, Phone, Mail, ShoppingBag, Heart, Tag, Star,
    ChevronRight, Settings, Edit3, LogOut, TrendingUp, Package
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    status: string;
    createdAt: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const raw = localStorage.getItem('localmarket_user');
        if (!raw) {
            router.replace('/login');
            return;
        }
        const session = JSON.parse(raw);

        // Refresh profile from DB
        fetch(`/api/auth/profile?id=${session.id}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                    // Update session with fresh data
                    localStorage.setItem('localmarket_user', JSON.stringify(data.user));
                } else {
                    setUser(session);
                }
            })
            .catch(() => setUser(session))
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('localmarket_user');
        window.dispatchEvent(new Event('authchange'));
        router.push('/');
    };

    const getInitials = (name: string) =>
        name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

    const profileCompletion = (() => {
        if (!user) return 0;
        const fields = [user.name, user.email, user.phone, user.city, user.state];
        return Math.round((fields.filter(Boolean).length / fields.length) * 100);
    })();

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
        : 'Recently';

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-200 rounded-full animate-spin" style={{ borderTopColor: 'var(--primary)' }} />
                    <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Welcome Banner */}
                <div className="relative bg-gradient-primary rounded-2xl p-6 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />
                    <div className="relative z-10 flex items-center gap-5">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{getInitials(user.name)}</span>
                        </div>
                        <div>
                            <p className="text-white/70 text-sm font-medium">Welcome back,</p>
                            <h1 className="text-2xl font-black">{user.name}</h1>
                            <p className="text-white/80 text-sm mt-0.5">Member since {memberSince}</p>
                        </div>
                    </div>
                    <div className="relative z-10 mt-5">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-white/80 text-xs font-semibold">Profile Completion</span>
                            <span className="text-white font-bold text-sm">{profileCompletion}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                                className="bg-white rounded-full h-2 transition-all duration-700"
                                style={{ width: `${profileCompletion}%` }}
                            />
                        </div>
                        {profileCompletion < 100 && (
                            <p className="text-white/70 text-xs mt-1.5">
                                Complete your profile for a better experience.
                                <Link href="/dashboard/profile" className="text-white font-semibold ml-1 hover:underline">Edit Profile →</Link>
                            </p>
                        )}
                    </div>
                </div>

                {/* Quick Stats (Hidden as per request) */}
                {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { icon: Heart, label: 'Saved', value: '—', color: 'text-red-500' },
                        { icon: ShoppingBag, label: 'Orders', value: '—', color: 'text-primary' },
                        { icon: Tag, label: 'Offers Used', value: '—', color: 'text-green-600' },
                        { icon: Star, label: 'Reviews', value: '—', color: 'text-amber-500' },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col items-center gap-2">
                            <Icon size={22} className={color} style={color === 'text-primary' ? { color: 'var(--primary)' } : undefined} />
                            <span className="text-2xl font-black text-slate-800">{value}</span>
                            <span className="text-xs text-slate-500 font-medium">{label}</span>
                        </div>
                    ))}
                </div> */}

                {/* Profile Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-colors"
                            style={{ color: 'var(--primary)' }}
                        >
                            <Edit3 size={14} />
                            Edit
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {[
                            { icon: User, label: 'Full Name', value: user.name || '—' },
                            { icon: Phone, label: 'Mobile', value: user.phone ? `+91 ${user.phone}` : '—' },
                            { icon: Mail, label: 'Email', value: user.email || '—' },
                            { icon: MapPin, label: 'Location', value: [user.city, user.state].filter(Boolean).join(', ') || '—' },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-4 px-5 py-3.5">
                                <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon size={16} className="text-slate-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                                    <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <h2 className="text-base font-bold text-slate-900 px-5 py-4 border-b border-slate-100">Quick Actions</h2>
                    <div className="divide-y divide-slate-50">
                        {[
                            { icon: ShoppingBag, label: 'Browse Businesses', href: '/', desc: 'Find local businesses near you' },
                            { icon: Tag, label: 'Current Offers', href: '/offers', desc: 'View deals from local vendors' },
                            { icon: Heart, label: 'Saved Items', href: '/saved', desc: 'Your bookmarked businesses' },
                            { icon: Settings, label: 'Settings', href: '/settings', desc: 'App preferences and notifications' },
                        ].map(({ icon: Icon, label, href, desc }) => (
                            <Link
                                key={label}
                                href={href}
                                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                            >
                                <div className="w-9 h-9 bg-slate-50 group-hover:bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-colors">
                                    <Icon size={16} className="text-slate-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                                    <p className="text-xs text-slate-400 truncate">{desc}</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Sign Out */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors shadow-sm"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>

            </div>
        </div>
    );
}
