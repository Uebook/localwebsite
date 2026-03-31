'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import {
    Gavel, Clock, MapPin, Users, Loader2, ArrowRight, X,
    CheckCircle, AlertCircle, Phone, Mail, User, IndianRupee, Send, Trophy, Zap
} from 'lucide-react';
import Image from 'next/image';

interface Auction {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    circle: string;
    min_bid: number | null;
    max_participants: number | null;
    participants_count: number;
    start_date: string;
    end_date: string;
}

interface BidForm {
    name: string;
    phone: string;
    email: string;
    bid_amount: string;
    message: string;
}

function ApplyModal({ auction, onClose }: { auction: Auction; onClose: () => void }) {
    const [form, setForm] = useState<BidForm>({ name: '', phone: '', email: '', bid_amount: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Pre-fill from session
    useEffect(() => {
        const rawUser = localStorage.getItem('localmarket_user');
        const rawVendor = localStorage.getItem('localmarket_vendor');
        const raw = rawUser || rawVendor;
        if (raw) {
            const u = JSON.parse(raw);
            setForm(f => ({ ...f, name: u.name || '', phone: u.phone || '', email: u.email || '' }));
        }
    }, []);

    const handleSubmit = async () => {
        setError('');
        if (!form.name.trim()) { setError('Please enter your name.'); return; }
        if (!form.phone.trim() && !form.email.trim()) { setError('Please enter your phone or email.'); return; }
        if (auction.type === 'e-auction' && !form.bid_amount) { setError('Please enter your bid amount.'); return; }

        setLoading(true);
        try {
            const res = await fetch('/api/e-auctions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auction_id: auction.id,
                    bidder_name: form.name,
                    bidder_phone: form.phone,
                    bidder_email: form.email,
                    bid_amount: form.bid_amount || null,
                    message: form.message,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Submission failed. Please try again.'); return; }
            setSuccess(data.message || 'Application submitted successfully!');
        } catch {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const isEAuction = auction.type === 'e-auction';

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full sm:max-w-md bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-primary p-5 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-4">
                            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
                                {isEAuction ? 'Place a Bid' : 'Apply for Draw'}
                            </p>
                            <h2 className="text-lg font-black leading-tight line-clamp-2">{auction.title}</h2>
                            {auction.min_bid && (
                                <p className="text-white/80 text-sm mt-1">Minimum bid: ₹{auction.min_bid.toLocaleString()}</p>
                            )}
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors flex-shrink-0">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {success ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-green-600" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">Application Submitted!</h3>
                        <p className="text-slate-500 text-sm mb-6">{success}</p>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gradient-primary text-white rounded-2xl font-bold hover:opacity-90 transition-all"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name *</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your full name"
                                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                            <div className="relative">
                                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    placeholder="10-digit mobile"
                                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 placeholder:text-slate-400"
                                    maxLength={10}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="your@email.com"
                                    className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Bid amount - only for e-auctions */}
                        {isEAuction && (
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                    Your Bid (₹) {auction.min_bid ? `— Min ₹${auction.min_bid}` : ''} *
                                </label>
                                <div className="relative">
                                    <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="number"
                                        value={form.bid_amount}
                                        onChange={e => setForm({ ...form, bid_amount: e.target.value })}
                                        placeholder={`Enter amount${auction.min_bid ? ` (min ₹${auction.min_bid})` : ''}`}
                                        min={auction.min_bid || 0}
                                        className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Message */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Message (optional)</label>
                            <textarea
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                placeholder="Any additional information..."
                                rows={3}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 placeholder:text-slate-400 resize-none"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-primary text-white rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> {isEAuction ? 'Submit Bid' : 'Apply Now'}</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function AuctionCard({ auction, onApply }: { auction: Auction; onApply: (a: Auction) => void }) {
    const isEAuction = auction.type === 'e-auction';
    const endDate = auction.end_date ? new Date(auction.end_date) : null;
    const timeLeft = endDate ? Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

    return (
        <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
            {/* Card top accent */}
            <div className={`h-1.5 w-full ${isEAuction ? 'bg-gradient-primary' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`} />

            <div className="p-5 flex-1 flex flex-col">
                {/* Badges */}
                <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isEAuction ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                        {isEAuction ? <Gavel size={11} /> : <Trophy size={11} />}
                        {isEAuction ? 'E-Auction' : 'Online Draw'}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Live
                    </span>
                </div>

                {/* Title & description */}
                <h3 className="text-base font-black text-slate-900 mb-2 leading-tight line-clamp-2 group-hover:text-primary transition-colors"
                    style={{ '--tw-text-opacity': 1 } as any}
                >{auction.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{auction.description}</p>

                {/* Info */}
                <div className="space-y-2 mb-4">
                    {auction.circle && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <MapPin size={13} />
                            <span>{auction.circle}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Users size={13} />
                        <span>{auction.participants_count || 0} participants
                            {auction.max_participants ? ` / ${auction.max_participants} max` : ''}
                        </span>
                    </div>
                    {timeLeft !== null && (
                        <div className="flex items-center gap-2 text-xs text-orange-500 font-bold">
                            <Clock size={13} />
                            <span>{timeLeft === 0 ? 'Ends today!' : `${timeLeft} day${timeLeft !== 1 ? 's' : ''} left`}</span>
                        </div>
                    )}
                </div>

                {/* Min bid */}
                {auction.min_bid && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Starting Bid</span>
                        <span className="text-base font-black text-slate-900">₹{Number(auction.min_bid).toLocaleString()}</span>
                    </div>
                )}

                {/* CTA */}
                <button
                    onClick={() => onApply(auction)}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${isEAuction
                        ? 'bg-gradient-primary text-white hover:opacity-90 shadow-md'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                >
                    {isEAuction ? <><Gavel size={15} /> Place a Bid</> : <><Trophy size={15} /> Apply for Draw</>}
                    <ArrowRight size={15} />
                </button>
            </div>
        </div>
    );
}

export default function EAuctionPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'e-auction' | 'online-draw'>('all');
    const router = useRouter();

    useEffect(() => {
        async function fetchAuctions() {
            try {
                setIsLoading(true);
                setError('');
                const res = await fetch('/api/e-auctions?status=active');
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Failed to load auctions.');
                    setAuctions([]);
                } else {
                    setAuctions(Array.isArray(data) ? data : []);
                }
            } catch {
                setError('Could not connect to server. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchAuctions();
    }, []);

    const filtered = auctions.filter(a => activeFilter === 'all' || a.type === activeFilter);
    const eAuctionCount = auctions.filter(a => a.type === 'e-auction').length;
    const drawCount = auctions.filter(a => a.type === 'online-draw').length;

    return (
        <div className="min-h-screen bg-slate-50">
            <Header
                onMenuClick={() => setIsSidebarOpen(true)}
                onProfileClick={() => router.push('/settings')}
                onNotificationClick={() => router.push('/notifications')}
            />

            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-primary">
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=80"
                        alt="Auction"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <Gavel size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white">E-Auctions & Draws</h1>
                            <p className="text-white/70 text-sm font-medium mt-0.5">Bid on exclusive deals from local vendors</p>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-3 mt-6">
                        {[
                            { icon: Zap, label: 'Live Now', value: auctions.length },
                            { icon: Gavel, label: 'E-Auctions', value: eAuctionCount },
                            { icon: Trophy, label: 'Online Draws', value: drawCount },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm px-4 py-2.5 rounded-2xl text-white">
                                <Icon size={16} />
                                <span className="text-sm font-bold">{value} {label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter tabs */}
                <div className="flex gap-2 mb-8 bg-white border border-slate-100 rounded-2xl p-1.5 w-fit shadow-sm">
                    {([['all', 'All'], ['e-auction', 'E-Auctions'], ['online-draw', 'Online Draws']] as const).map(([val, label]) => (
                        <button
                            key={val}
                            onClick={() => setActiveFilter(val)}
                            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeFilter === val
                                ? 'bg-gradient-primary text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 size={40} className="animate-spin mb-4" style={{ color: 'var(--primary)' }} />
                        <p className="text-slate-400 font-semibold">Loading live auctions...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <AlertCircle size={40} className="text-red-400 mb-4" />
                        <p className="text-slate-700 font-bold mb-2">Failed to Load</p>
                        <p className="text-slate-400 text-sm mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map(auction => (
                            <AuctionCard key={auction.id} auction={auction} onApply={setSelectedAuction} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                            <Gavel size={36} className="text-slate-200" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-2">No Active Auctions</h3>
                        <p className="text-slate-400 text-sm max-w-sm">
                            There are no {activeFilter !== 'all' ? (activeFilter === 'e-auction' ? 'e-auctions' : 'online draws') : 'auctions'} running right now. Check back soon!
                        </p>
                    </div>
                )}
            </div>

            {/* Apply Modal */}
            {selectedAuction && (
                <ApplyModal auction={selectedAuction} onClose={() => setSelectedAuction(null)} />
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
