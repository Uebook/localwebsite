import React from 'react';
import Header from '@/components/Header';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Header />
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-5xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
                    About LOKALL
                </h1>
                <div className="bg-white rounded-3xl p-10 shadow-xl shadow-orange-500/5 space-y-6 text-slate-600 leading-relaxed border border-orange-100">
                    <p className="text-xl font-medium text-slate-800">
                        LOKALL is India's first real-time local price intelligence platform. 
                    </p>
                    <p>
                        We believe that transparency in local markets empowers both consumers and honest vendors. Our mission is to bridge the information gap between traditional brick-and-mortar shops and modern consumers who want the best value for their money.
                    </p>
                    
                    <h2 className="text-2xl font-bold text-slate-900 pt-6">How It Works</h2>
                    <p>
                        Our platform aggregates price and availability data from thousands of local shops and markets. By comparing these in real-time, we provide users with "Price Insights"—showing you which markets are currently offering the lowest prices for the products you need.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 pt-6">Our Vision</h2>
                    <p>
                        To digitize the local shopping experience while preserving the trust and community feel of neighborhood markets. We want to ensure that "Vocal for Local" is backed by the best possible data and value.
                    </p>
                </div>
            </div>
        </main>
    );
}
