'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Shield, Lock, Eye, CheckCircle, Mail } from 'lucide-react';
import Header from '@/components/Header';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 animate-in fade-in slide-in-from-left duration-500">
          <Link href="/" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 font-bold text-sm">
            <ChevronLeft size={16} /> Home
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-bold text-sm">Privacy Policy</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors duration-500" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 font-black text-2xl">
              <Shield size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
              Your privacy is our priority. This policy explains how we collect, use, and protect your personal data when you use LOKALL.
            </p>
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                <Lock size={14} /> Secure & Encrypted
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Effective Date: March 30, 2026</p>
            </div>
          </div>
        </div>

        {/* Highlight Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
                { icon: <Eye className="text-blue-500" />, title: "Transparency", desc: "We are open about what data we collect and why." },
                { icon: <CheckCircle className="text-emerald-500" />, title: "Control", desc: "You have full control over your personal information." },
                { icon: <Lock className="text-purple-500" />, title: "Security", desc: "We use industry-standard security to protect your data." },
            ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="font-black text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
          <div className="p-8 md:p-12 space-y-12">
            
            <section id="policy" className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                PRIVACY AND DATA PROTECTION
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-6 font-medium italic">
                <p>
                  "The Company collects, processes, and stores personal data of Users in accordance with applicable laws and for purposes including service delivery, improvement of user experience, analytics, and legal compliance. Such data may include personal identification information, device data, and usage patterns."
                </p>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 not-italic">
                    <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Key Data Protection Points</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                            <span>While we adopt reasonable security practices to safeguard data, the User acknowledges that no electronic transmission or storage system is completely secure.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                            <span>The Company shall not be liable for any unauthorized access beyond its control.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                            <span>The User retains the right to request access, correction, or deletion of personal data, subject to applicable legal requirements.</span>
                        </li>
                    </ul>
                </div>
              </div>
            </section>

            <section id="full-agreement" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-slate-900 rounded-full" />
                COMPLETE AGREEMENT CONTEXT
              </h2>
              <div className="text-slate-500 leading-relaxed text-sm space-y-4 font-medium opacity-80">
                <p>
                  For a full understanding of your rights and obligations, please refer to our <Link href="/terms" className="text-primary hover:underline font-bold">Full Terms of Use</Link>. As per our collective agreement, the following clauses also apply to your privacy and data usage:
                </p>
                <div className="space-y-4 border-l-2 border-slate-100 pl-6">
                    <p><strong>Nature of Services:</strong> VRK Enterprises operates as an intermediary under the Information Technology Act, 2000.</p>
                    <p><strong>User Obligations:</strong> Users are prohibited from introducing malicious code or attempting unauthorized access.</p>
                    <p><strong>Cyber Law Compliance:</strong> We comply with all provisions of the Information Technology Act, 2000 regarding data reporting and authorities.</p>
                </div>
              </div>
            </section>

            <section id="contact" className="space-y-4 pt-4 border-t border-slate-50">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" />
                CONTACT US
              </h2>
              <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
                <p className="font-bold flex items-center gap-2">
                  <span className="text-primary tracking-tighter">VRK Enterprises</span>
                </p>
                <div className="space-y-2 opacity-80 text-sm italic">
                  <p>4741/C, Guru Nanak Wara P.O. Khalsa College,</p>
                  <p>Amritsar, Punjab, India</p>
                </div>
                <div className="pt-4 flex items-center gap-3 text-sm font-black text-primary">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                        <Mail size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-slate-400 tracking-widest">Privacy Support</span>
                        <a href="mailto:lokallmarket01@gmail.com" className="hover:underline text-lg">lokallmarket01@gmail.com</a>
                    </div>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Support Message */}
        <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm font-bold">
                Want to request your data? <Link href="/contact" className="text-primary hover:underline">Submit a Privacy Request</Link>
            </p>
        </div>
      </div>
    </div>
  );
}
