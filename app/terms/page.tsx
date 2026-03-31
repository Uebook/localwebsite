'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Shield, FileText, Scale, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';

export default function TermsPage() {
  const sections = [
    { id: 'intro', title: '1. INTRODUCTORY DECLARATION', icon: <FileText size={18} /> },
    { id: 'nature', title: '2. NATURE OF SERVICES AND LEGAL STATUS', icon: <Scale size={18} /> },
    { id: 'eligibility', title: '3. ELIGIBILITY AND CAPACITY TO CONTRACT', icon: <HelpCircle size={18} /> },
    { id: 'registration', title: '4. USER REGISTRATION AND RESPONSIBILITY', icon: <Shield size={18} /> },
    // ... add more as needed for sidebar
  ];

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
          <span className="text-slate-600 font-bold text-sm">Terms of Use</span>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Scale size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Terms of Use</h1>
            <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
              These terms govern your access to and use of LOKALL. By using our platform, you agree to follow our rules and policies.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                    S
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Effective Date: March 30, 2026</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
          <div className="p-8 md:p-12 space-y-12">
            
            <section id="intro" className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" />
                1. INTRODUCTORY DECLARATION
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  This Terms of Use, Privacy Policy, Refund Policy, and Disclaimer (collectively referred to as the “Agreement”) governs the access, use, and interaction of users (“User”, “You”, “Your”) with the mobile application, website, and all digital services (collectively referred to as the “Platform”) operated by VRK Enterprises, a proprietorship/firm having its principal place of business at 4741/C Guru Nanak Wara. P.O. Khalsa College, Amritsar, Punjab, India (hereinafter referred to as “Company”, “We”, “Us”, or “Our”).
                </p>
                <p>
                  By accessing, downloading, registering, or using the Platform in any manner whatsoever, the User expressly acknowledges that they have read, understood, and agreed to be bound by the terms and conditions set forth herein, which constitute a legally binding agreement under the provisions of the Indian Contract Act, 1872.
                </p>
              </div>
            </section>

            <section id="nature" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-500 rounded-full" />
                2. NATURE OF SERVICES AND LEGAL STATUS
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The Platform is operated as a technology-based interface and intermediary platform, facilitating access to certain digital services, functionalities, or interactions, and does not, unless explicitly stated, assume the role of a principal service provider. The Company functions strictly within the legal framework of an intermediary as defined under the Information Technology Act, 2000 and shall not be held liable for third-party actions, omissions, representations, or conduct.
                </p>
                <p>
                  The Company reserves the absolute right, at its sole discretion, to modify, suspend, withdraw, or discontinue any part of the Platform or services at any time without prior notice and without incurring any liability.
                </p>
              </div>
            </section>

            <section id="eligibility" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-orange-500 rounded-full" />
                3. ELIGIBILITY AND CAPACITY TO CONTRACT
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The use of the Platform is strictly limited to individuals who are legally competent to enter into binding contracts under applicable laws of India. By using the Platform, the User represents and warrants that they are at least 18 years of age and are not disqualified from contracting under any applicable law.
                </p>
                <p>
                  Any use of the Platform by a person who does not meet the eligibility criteria shall be deemed unauthorized, and the Company reserves the right to terminate such access without notice.
                </p>
              </div>
            </section>

            <section id="registration" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" />
                4. USER REGISTRATION AND ACCOUNT RESPONSIBILITY
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  In order to access certain features of the Platform, Users may be required to register and create an account by providing accurate, current, and complete information. The User shall be solely responsible for maintaining the confidentiality of login credentials and for all activities conducted under their account.
                </p>
                <p>
                  The Company shall not be liable for any unauthorized access, misuse, or loss arising from failure of the User to safeguard account credentials. The User agrees to immediately notify the Company of any suspected unauthorized use.
                </p>
              </div>
            </section>

            <section id="obligations" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-red-500 rounded-full" />
                5. USER OBLIGATIONS AND PROHIBITED CONDUCT
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The User undertakes to use the Platform strictly in compliance with applicable laws and shall not engage in any activity that is unlawful, fraudulent, abusive, defamatory, obscene, or otherwise objectionable. The User shall not attempt to gain unauthorized access to the Platform, interfere with its functioning, introduce malicious code, or engage in reverse engineering, data mining, or any activity that may compromise system integrity.
                </p>
                <p>
                  Any violation of this clause shall entitle the Company to take immediate action, including suspension or termination of access and initiation of appropriate legal proceedings under applicable statutes.
                </p>
              </div>
            </section>

            <section id="payments" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-500 rounded-full" />
                6. PAYMENTS, PRICING, AND TRANSACTIONS
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  Wherever applicable, the Platform may facilitate payments through third-party payment gateways. The User acknowledges that such payment services are governed by their respective terms and policies, and the Company shall not be liable for any transaction failures, delays, or unauthorized transactions.
                </p>
                <p>
                  All prices displayed on the Platform are subject to change without prior notice. The Company reserves the right to correct any pricing errors and to cancel or refuse any transaction at its discretion.
                </p>
              </div>
            </section>

            <section id="refund" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                7. REFUND AND CANCELLATION POLICY
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  All payments made through the Platform shall be treated as final and non-refundable, except in cases where a refund is expressly permitted at the sole discretion of the Company. Refunds may be considered only in cases involving duplicate transactions, technical errors attributable to the Platform, or failure of service delivery due to system malfunction.
                </p>
                <p>
                  Refund requests, if any, must be raised within a reasonable period, and approved refunds shall be processed within a reasonable timeframe, typically ranging between 7 to 15 working days. Under no circumstances shall refunds be granted for reasons such as change of mind, partial usage of services, or user negligence.
                </p>
              </div>
            </section>

            <section id="taxation" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-violet-500 rounded-full" />
                8. TAXATION AND GST COMPLIANCE
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  All applicable taxes, including Goods and Services Tax (GST), shall be levied in accordance with the provisions of the Central Goods and Services Tax Act, 2017. Users are required to provide accurate billing details for invoicing purposes. The Company shall not be responsible for any incorrect tax information arising due to inaccurate details provided by the User.
                </p>
              </div>
            </section>

            <section id="ip" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" />
                9. INTELLECTUAL PROPERTY RIGHTS
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  All intellectual property rights associated with the Platform, including but not limited to trademarks, logos, software, content, design, and databases, are the exclusive property of VRK Enterprises and are protected under applicable laws, including the Copyright Act, 1957.
                </p>
                <p>
                  Any unauthorized reproduction, distribution, modification, or use of such intellectual property shall constitute a violation of law and may result in civil and criminal liability.
                </p>
              </div>
            </section>

            <section id="privacy" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                10. PRIVACY AND DATA PROTECTION
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The Company collects, processes, and stores personal data of Users in accordance with applicable laws and for purposes including service delivery, improvement of user experience, analytics, and legal compliance. Such data may include personal identification information, device data, and usage patterns.
                </p>
                <p>
                  While the Company adopts reasonable security practices to safeguard data, the User acknowledges that no electronic transmission or storage system is completely secure, and the Company shall not be liable for any unauthorized access beyond its control.
                </p>
              </div>
            </section>

            <section id="disclaimer" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-orange-400 rounded-full" />
                11. DISCLAIMER OF WARRANTIES
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The Platform and all services are provided on an “AS IS” and “AS AVAILABLE” basis without any warranties, express or implied. The Company does not warrant that the Platform will be uninterrupted, error-free, secure, or free from viruses or harmful components.
                </p>
                <p>
                  Any reliance placed by the User on the Platform or its content is strictly at the User’s own risk.
                </p>
              </div>
            </section>

            <section id="liability" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-slate-900 rounded-full" />
                12. LIMITATION OF LIABILITY
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  To the maximum extent permitted by law, VRK Enterprises shall not be liable for any direct, indirect, incidental, consequential, or punitive damages, including loss of profits, data, goodwill, or business opportunities arising out of or in connection with the use or inability to use the Platform.
                </p>
              </div>
            </section>

            <section id="indemnification" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-amber-500 rounded-full" />
                13. INDEMNIFICATION
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The User agrees to indemnify, defend, and hold harmless VRK Enterprises, its proprietors, employees, and affiliates from and against any claims, liabilities, damages, losses, or expenses arising out of the User’s violation of this Agreement, misuse of the Platform, or infringement of any rights.
                </p>
              </div>
            </section>

            <section id="intermediary" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-sky-500 rounded-full" />
                14. INTERMEDIARY LIABILITY PROTECTION
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The Company operates in compliance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and shall be entitled to safe harbour protection for third-party content, provided due diligence requirements are fulfilled.
                </p>
              </div>
            </section>

            <section id="termination" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-rose-500 rounded-full" />
                15. TERMINATION AND SUSPENSION
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The Company reserves the right to suspend, restrict, or terminate User access at its sole discretion, without prior notice, in cases of violation of this Agreement or any applicable law. Upon termination, all rights granted to the User shall cease immediately.
                </p>
              </div>
            </section>

            <section id="force" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-slate-400 rounded-full" />
                16. FORCE MAJEURE
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The Company shall not be held liable for any failure or delay in performance arising out of events beyond its reasonable control, including but not limited to natural disasters, acts of government, cyber-attacks, power failures, or network disruptions.
                </p>
              </div>
            </section>

            <section id="dispute" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" />
                17. DISPUTE RESOLUTION AND ARBITRATION
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  Any dispute arising out of or relating to this Agreement shall be resolved through arbitration in accordance with the provisions of the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted by a sole arbitrator appointed by the Company, and the seat and venue of arbitration shall be Amritsar, Punjab. The proceedings shall be conducted in English.
                </p>
                <p>
                  Subject to arbitration, the courts at Amritsar shall have exclusive jurisdiction.
                </p>
              </div>
            </section>

            <section id="compliance" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-cyan-500 rounded-full" />
                18. APP STORE AND THIRD-PARTY PLATFORM COMPLIANCE
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The Platform complies with the policies of Google Play and Apple App Store. However, these platforms shall not be responsible for the content, operation, or services provided by VRK Enterprises, and any claims shall be directed solely against the Company.
                </p>
              </div>
            </section>

            <section id="cyber" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" />
                19. CYBER LAW COMPLIANCE
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  Users shall comply with all applicable cyber laws, including provisions of the Information Technology Act, 2000, and any violation may result in reporting to appropriate authorities and initiation of legal proceedings.
                </p>
              </div>
            </section>

            <section id="modifications" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" />
                20. MODIFICATIONS TO AGREEMENT
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-4 font-medium">
                <p>
                  The Company reserves the right to modify, amend, or update this Agreement at any time. Continued use of the Platform after such changes shall constitute acceptance of the revised terms.
                </p>
              </div>
            </section>

            <section id="contact" className="space-y-4 pt-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" />
                21. CONTACT INFORMATION
              </h2>
              <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
                <p className="font-bold flex items-center gap-2">
                  <span className="text-primary tracking-tighter">VRK Enterprises</span>
                </p>
                <div className="space-y-2 opacity-80 text-sm italic">
                  <p>4741/C, Guru Nanak Wara P.O. Khalsa College,</p>
                  <p>Amritsar, Punjab, India</p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-sm font-black text-primary">
                  <span>Email:</span>
                  <a href="mailto:lokallmarket01@gmail.com" className="hover:underline">lokallmarket01@gmail.com</a>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer Support Message */}
        <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm font-bold">
                Questions about our terms? <Link href="/contact" className="text-primary hover:underline">Contact Support</Link>
            </p>
        </div>
      </div>
    </div>
  );
}
