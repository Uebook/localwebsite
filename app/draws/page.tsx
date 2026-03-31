'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Ticket, Sparkles, MapPin, Users, Loader2, ArrowRight, Gift, X, CheckCircle, User, Phone, Mail, Send } from 'lucide-react';
import Image from 'next/image';

interface Draw {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    circle: string;
    participants_count: number;
}

interface EntryForm {
    name: string;
    phone: string;
    email: string;
    message: string;
}

function ApplyModal({ draw, onClose }: { draw: Draw; onClose: () => void }) {
    const [form, setForm] = useState<EntryForm>({ name: '', phone: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const rawUser = localStorage.getItem('localmarket_user');
        const rawVendor = localStorage.getItem('localmarket_vendor');
        const raw = rawUser || rawVendor;
        if (raw) {
            try {
                const u = JSON.parse(raw);
                setForm(f => ({ ...f, name: u.name || f.name, phone: u.phone || f.phone, email: u.email || f.email }));
            } catch { /* ignore */ }
        }
    }, []);

    const handleSubmit = async () => {
        setError('');
        if (!form.name.trim()) { setError('Please enter your name.'); return; }
        if (!form.phone.trim() && !form.email.trim()) { setError('Please enter your phone or email.'); return; }

        setLoading(true);
        try {
            const res = await fetch('/api/e-auctions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auction_id: draw.id,
                    bidder_name: form.name,
                    bidder_phone: form.phone,
                    bidder_email: form.email,
                    message: form.message,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Entry failed. Please try again.'); return; }
            setSuccess(data.message || 'Successfully entered the lucky draw!');
        } catch {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Enter Lucky Draw</p>
                            <h2 className="text-lg font-black leading-tight line-clamp-2">{draw.title}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {success ? (
                    <div className="p-8 text-center text-slate-800">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-green-600" />
                        </div>
                        <h3 className="text-lg font-black mb-2">You're in!</h3>
                        <p className="text-slate-500 text-sm mb-6">{success}</p>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition-all"
                        >
                            Back to Draws
                        </button>
                    </div>
                ) : (
                    <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="text-slate-800">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>
                        </div>

                        <div className="text-slate-800">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>
                        </div>

                        <div className="text-slate-800">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3.5 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Enter Lucky Draw</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function OnlineDrawsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [draws, setDraws] = useState<Draw[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchDraws() {
            try {
                setIsLoading(true);
                const res = await fetch('/api/e-auctions?type=online-draw&status=active');
                if (res.ok) {
                    const data = await res.json();
                    setDraws(data);
                } else {
                    setDraws([]);
                }
            } catch (error) {
                console.error('Error fetching draws:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchDraws();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header
                onMenuClick={() => setIsSidebarOpen(true)}
                onProfileClick={() => router.push('/settings')}
                onNotificationClick={() => router.push('/notifications')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Hero Section */}
                <div className="relative rounded-[3rem] overflow-hidden mb-12 h-64 sm:h-80 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-100">
                    <div className="absolute inset-0 opacity-20">
                        <Image
                            src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200q=80"
                            alt="Celebration Background"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative h-full flex flex-col justify-center px-8 sm:px-12 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
                                <Ticket size={32} />
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Online Draws</h1>
                        </div>
                        <p className="text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
                            Feeling lucky? Participate in our exclusive lucky draws and win amazing prizes from local vendors. It's time to win big!
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-purple-500 rounded-full" />
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Live Opportunities</h2>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                            <p className="text-slate-500 font-bold">Checking for live draws...</p>
                        </div>
                    ) : draws.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {draws.map((draw) => (
                                <div key={draw.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500" />
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="px-3.5 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                                                Active Now
                                            </span>
                                            <div className="flex items-center gap-1.5 text-indigo-500 font-black">
                                                <Sparkles size={14} />
                                                <span className="text-[10px] uppercase tracking-widest text-indigo-400">Featured</span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight group-hover:text-purple-600 transition-colors">{draw.title}</h3>
                                        <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">{draw.description}</p>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                                                    <MapPin size={16} />
                                                </div>
                                                <span>{draw.circle || 'All Circles'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                                                    <Users size={16} />
                                                </div>
                                                <span>{draw.participants_count || 0} participants</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100/50">
                                                <span className="text-purple-600 text-xs font-black flex items-center gap-2 uppercase tracking-widest">
                                                    <Gift size={16} />
                                                    Prize Pool
                                                </span>
                                                <span className="text-lg font-black text-slate-900">Win Big!</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedDraw(draw)}
                                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-purple-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <span>Enter Draw</span>
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-20 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Ticket size={48} className="text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">No Active Draws</h3>
                            <p className="text-slate-500 max-w-md mx-auto font-medium">
                                We're preparing new lucky draws for you. Stay tuned and check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {selectedDraw && (
                <ApplyModal
                    draw={selectedDraw}
                    onClose={() => setSelectedDraw(null)}
                />
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNavigate={(tab) => {
                    setIsSidebarOpen(false);
                    if (tab === 'home') router.push('/');
                    else if (tab === 'eauction') router.push('/eauction');
                    else if (tab === 'draws') router.push('/draws');
                    else if (tab === 'categories') router.push('/categories');
                    else if (tab === 'saved') router.push('/saved');
                    else if (tab === 'settings') router.push('/settings');
                    else if (tab === 'help') router.push('/help');
                    else if (tab === 'logout') router.push('/login');
                }}
                userRole={typeof window !== 'undefined' && localStorage.getItem('localmarket_vendor') ? 'vendor' : 'customer'}
            />
        </div>
    );
}
