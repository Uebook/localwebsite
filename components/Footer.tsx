'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, ArrowRight, Shield } from 'lucide-react';

const Footer = () => {
    const [settings, setSettings] = useState({
        support_phone: '+91 98765 43210',
        support_email: 'support@lokall.com',
        support_address: 'Hall Bazaar, Amritsar, Punjab, India',
        facebook_url: '',
        twitter_url: '',
        instagram_url: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/site-settings');
                const data = await res.json();
                if (data.success && data.settings) {
                    setSettings(prev => ({ ...prev, ...data.settings }));
                }
            } catch (error) {
                console.error('Error fetching footer settings:', error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="bg-[#0f172a] text-white pt-20 pb-10 border-t border-white/10 w-full relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/lokall-logo.svg"
                                alt="LOKALL Logo"
                                width={48}
                                height={48}
                                className="group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                LOKALL
                            </span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed max-w-xs">
                            India's first local price intelligence app. We empower users to find the cheapest nearby markets and products with live performance data.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href={settings.facebook_url || '#'} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href={settings.twitter_url || '#'} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href={settings.instagram_url || '#'} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-orange-500"></span>
                            Quick Links
                        </h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><Link href="/about" className="hover:text-orange-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> About Us</Link></li>
                            <li><Link href="/vendor" className="hover:text-orange-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> For Vendors</Link></li>
                            <li><Link href="/categories" className="hover:text-orange-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Categories</Link></li>
                            <li><Link href="/help" className="hover:text-orange-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Help Center</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Trust */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-blue-500"></span>
                            Legal & Support
                        </h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><Link href="/terms" className="hover:text-blue-400 transition-colors flex items-center gap-2 group"><Shield size={14} /> Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-400 transition-colors flex items-center gap-2 group"><Shield size={14} /> Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-orange-500"></span>
                            Contact Us
                        </h4>
                        <ul className="space-y-6">
                            <li className="group">
                                <div className="text-slate-500 text-xs mb-1 uppercase tracking-widest font-black">Support Hotline</div>
                                <a href={`tel:${settings.support_phone}`} className="flex items-center gap-3 text-slate-200 group-hover:text-orange-400 transition-colors text-lg font-bold">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20">
                                        <Phone size={18} />
                                    </div>
                                    {settings.support_phone}
                                </a>
                            </li>
                            <li className="group">
                                <div className="text-slate-500 text-xs mb-1 uppercase tracking-widest font-black">Email Address</div>
                                <a href={`mailto:${settings.support_email}`} className="flex items-center gap-3 text-slate-200 group-hover:text-orange-400 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20">
                                        <Mail size={18} />
                                    </div>
                                    {settings.support_email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-slate-400">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <span className="pt-2 text-sm italic">{settings.support_address}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} <span className="text-white font-bold">LOKALL</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-xs text-slate-500 font-bold uppercase tracking-widest">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
