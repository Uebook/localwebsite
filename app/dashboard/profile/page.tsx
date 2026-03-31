'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { User, Phone, Mail, MapPin, Save, ArrowLeft, CheckCircle, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { INDIAN_STATES, STATE_CITIES } from '@/lib/locationData';

export default function ProfileEditPage() {
    const [form, setForm] = useState({ name: '', phone: '', email: '', state: '', city: '' });
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        const raw = localStorage.getItem('localmarket_user');
        if (!raw) { router.replace('/login'); return; }
        const session = JSON.parse(raw);
        setUserId(session.id);

        fetch(`/api/auth/profile?id=${session.id}`)
            .then((r) => r.json())
            .then((data) => {
                const u = data.user || session;
                setForm({ name: u.name || '', phone: u.phone || '', email: u.email || '', state: u.state || '', city: u.city || '' });
            })
            .catch(() => setForm({ name: session.name || '', phone: session.phone || '', email: session.email || '', state: session.state || '', city: session.city || '' }))
            .finally(() => setLoading(false));
    }, [router]);

    const handleSave = async () => {
        setError('');
        setSuccess('');
        if (!form.name.trim()) { setError('Name is required.'); return; }
        setSaving(true);
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, ...form }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Failed to save.'); return; }

            // Update localStorage session
            const updated = data.user || { ...form, id: userId };
            localStorage.setItem('localmarket_user', JSON.stringify(updated));
            window.dispatchEvent(new Event('authchange'));
            setSuccess('Profile updated successfully!');
            setTimeout(() => router.push('/dashboard'), 1200);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--background)' }}>
            <Header />

            <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
                {/* Back */}
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-primary px-6 py-4">
                        <h1 className="text-lg font-bold text-white">Edit Profile</h1>
                        <p className="text-white/70 text-sm">Update your personal details</p>
                    </div>

                    <div className="p-5 sm:p-6 space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Your full name"
                                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                            <div className="flex gap-2">
                                <div className="px-3 py-3 bg-gray-50 border border-gray-300 rounded-lg font-semibold text-gray-700 text-sm flex items-center gap-1">
                                    <Phone size={14} className="text-gray-400" />
                                    +91
                                </div>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    placeholder="10-digit mobile number"
                                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400"
                                    maxLength={10}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="Your email address"
                                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">State</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={form.state}
                                    onChange={(e) => setForm({ ...form, state: e.target.value, city: '' })}
                                    className="w-full pl-9 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 appearance-none bg-white"
                                >
                                    <option value="">Select state...</option>
                                    {INDIAN_STATES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                            <div className="relative">
                                <select
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    disabled={!form.state}
                                    className="w-full px-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 appearance-none bg-white disabled:bg-gray-50"
                                >
                                    <option value="">Select city...</option>
                                    {form.state && STATE_CITIES[form.state]?.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Error / Success */}
                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                                <p className="text-sm text-green-700">{success}</p>
                            </div>
                        )}

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full py-3.5 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                        >
                            {saving ? <Loader2 size={20} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
