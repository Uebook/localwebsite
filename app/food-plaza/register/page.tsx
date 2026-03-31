'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Utensils, CheckCircle, Store, Phone, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { INDIAN_STATES, STATE_CITIES } from '@/lib/locationData';
import WelcomeAnimation from '@/components/WelcomeAnimation';

export default function FoodPlazaRegisterPage() {
       const [step, setStep] = useState(1);
       const [isLoading, setIsLoading] = useState(false);
       const [error, setError] = useState('');
       const [success, setSuccess] = useState('');
       const [showWelcome, setShowWelcome] = useState(false);
       const router = useRouter();

       const [formData, setFormData] = useState({
              outletName: '',
              cuisineType: '',
              managerName: '',
              mobile: '',
              email: '',
              address: '',
              state: '',
              city: '',
              pincode: '',
              openingTime: '09:00',
              closingTime: '22:00',
       });

       const CUISINE_TYPES = [
              'North Indian', 'South Indian', 'Chinese', 'Fast Food', 'Bakery', 'Street Food', 'Continental', 'Sweets'
       ];

       const handleChange = (field: string, value: string) => {
              setFormData(prev => ({ ...prev, [field]: value }));
       };

       const handleSubmit = async (e: React.FormEvent) => {
              e.preventDefault();
              setError('');
              setIsLoading(true);

              try {
                     const res = await fetch('/api/vendor/auth/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                   businessName: formData.outletName,
                                   ownerName: formData.managerName,
                                   category: 'Food Plaza / Restaurant',
                                   subCategory: formData.cuisineType,
                                   mobile: formData.mobile,
                                   email: formData.email,
                                   address: formData.address,
                                   state: formData.state,
                                   city: formData.city,
                                   pincode: formData.pincode,
                                   isFoodPlaza: true,
                                   timings: `${formData.openingTime} - ${formData.closingTime}`
                            }),
                     });

                     const data = await res.json();
                     if (!res.ok) throw new Error(data.error || 'Registration failed');

                     setSuccess('Restaurant registered successfully! 🎉');
                     localStorage.setItem('localmarket_vendor', JSON.stringify(data.vendor));
                     window.dispatchEvent(new Event('authchange'));
                     setTimeout(() => setShowWelcome(true), 1000);
              } catch (err: any) {
                     setError(err.message);
                     setIsLoading(false);
              }
       };

       if (showWelcome) {
              return <WelcomeAnimation onComplete={() => router.push('/')} />;
       }

       return (
              <div className="min-h-screen bg-slate-50">
                     <div className="max-w-4xl mx-auto px-4 py-8">
                            <Link href="/login" className="inline-flex items-center gap-2 text-slate-600 mb-6 font-medium hover:text-slate-900 transition-colors">
                                   <ArrowLeft size={20} />
                                   <span>Back to Login</span>
                            </Link>

                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                                   <div className="bg-orange-500 p-8 text-white text-center">
                                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
                                                 <Utensils size={32} className="text-orange-500" />
                                          </div>
                                          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Food Plaza Partner</h1>
                                          <p className="text-orange-50/90 font-medium">Join our growing ecosystem of local food outlets</p>
                                   </div>

                                   <div className="p-8">
                                          <div className="flex items-center justify-between mb-8 px-4">
                                                 {[1, 2, 3].map((s) => (
                                                        <div key={s} className="flex items-center flex-1">
                                                               <div className={`flex items-center justify-center w-12 h-12 rounded-2xl font-black transition-all ${step >= s ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                                                                      {step > s ? <CheckCircle size={24} /> : s}
                                                               </div>
                                                               {s < 3 && <div className="flex-1 h-1.5 mx-2 rounded-full" style={{ background: step > s ? '#f97316' : '#f1f5f9' }} />}
                                                        </div>
                                                 ))}
                                          </div>

                                          <form onSubmit={handleSubmit} className="space-y-8">
                                                 {step === 1 && (
                                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                               <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                                                      <Store className="text-orange-500" /> Outlet Details
                                                               </h2>
                                                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                      <div>
                                                                             <label className="block text-sm font-black text-slate-700 mb-2">Outlet Name</label>
                                                                             <input type="text" required value={formData.outletName} onChange={(e) => handleChange('outletName', e.target.value)}
                                                                                    placeholder="e.g. Royal Spice Restaurant" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium" />
                                                                      </div>
                                                                      <div>
                                                                             <label className="block text-sm font-black text-slate-700 mb-2">Primary Cuisine</label>
                                                                             <select required value={formData.cuisineType} onChange={(e) => handleChange('cuisineType', e.target.value)}
                                                                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium appearance-none">
                                                                                    <option value="">Select Cuisine</option>
                                                                                    {CUISINE_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                                                                             </select>
                                                                      </div>
                                                               </div>
                                                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                      <div>
                                                                             <label className="block text-sm font-black text-slate-700 mb-2 font-medium flex items-center gap-2"><Clock size={14} /> Opening Time</label>
                                                                             <input type="time" value={formData.openingTime} onChange={(e) => handleChange('openingTime', e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium" />
                                                                      </div>
                                                                      <div>
                                                                             <label className="block text-sm font-black text-slate-700 mb-2 font-medium flex items-center gap-2"><Clock size={14} /> Closing Time</label>
                                                                             <input type="time" value={formData.closingTime} onChange={(e) => handleChange('closingTime', e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium" />
                                                                      </div>
                                                               </div>
                                                               <button type="button" onClick={() => setStep(2)} className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 active:scale-95 transition-all text-lg tracking-tight">
                                                                      Next: Contact Details
                                                               </button>
                                                        </div>
                                                 )}

                                                 {step === 2 && (
                                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                               <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                                                      <Phone className="text-orange-500" /> Contact Info
                                                               </h2>
                                                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                      <div>
                                                                             <label className="block text-sm font-black text-slate-700 mb-2">Manager Name</label>
                                                                             <input type="text" required value={formData.managerName} onChange={(e) => handleChange('managerName', e.target.value)}
                                                                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium" />
                                                                      </div>
                                                                      <div>
                                                                             <label className="block text-sm font-black text-slate-700 mb-2">Mobile Number</label>
                                                                             <input type="tel" required value={formData.mobile} onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium" />
                                                                      </div>
                                                               </div>
                                                               <div className="flex gap-4">
                                                                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">Back</button>
                                                                      <button type="button" onClick={() => setStep(3)} className="flex-1 py-5 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all">Next: Location</button>
                                                               </div>
                                                        </div>
                                                 )}

                                                 {step === 3 && (
                                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                               <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                                                      <MapPin className="text-orange-500" /> Location
                                                               </h2>
                                                               <div>
                                                                      <label className="block text-sm font-black text-slate-700 mb-2">Full Address</label>
                                                                      <textarea required value={formData.address} onChange={(e) => handleChange('address', e.target.value)} rows={3}
                                                                             className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none resize-none font-medium" />
                                                               </div>
                                                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                      <select value={formData.state} onChange={(e) => handleChange('state', e.target.value)} className="px-5 py-4 bg-slate-50 rounded-2xl font-medium outline-none">
                                                                             <option value="">State</option>
                                                                             {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                                                      </select>
                                                                      <select value={formData.city} onChange={(e) => handleChange('city', e.target.value)} disabled={!formData.state} className="px-5 py-4 bg-slate-50 rounded-2xl font-medium outline-none disabled:opacity-50">
                                                                             <option value="">City</option>
                                                                             {formData.state && STATE_CITIES[formData.state]?.map(c => <option key={c} value={c}>{c}</option>)}
                                                                      </select>
                                                                      <input type="text" value={formData.pincode} onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                                             placeholder="Pincode" className="px-5 py-4 bg-slate-50 rounded-2xl font-medium outline-none" />
                                                               </div>
                                                               {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold flex items-center gap-2 text-sm">
                                                                      <CheckCircle className="rotate-180" size={18} /> {error}
                                                               </div>}
                                                               {success && <div className="p-4 bg-green-50 text-green-600 rounded-xl font-bold flex items-center gap-2 text-sm">
                                                                      <CheckCircle size={18} /> {success}
                                                               </div>}
                                                               <div className="flex gap-4">
                                                                      <button type="button" onClick={() => setStep(2)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all">Back</button>
                                                                      <button type="submit" disabled={isLoading} className="flex-1 py-5 bg-orange-500 text-white rounded-2xl font-black shadow-xl hover:bg-orange-600 transition-all disabled:opacity-50">
                                                                             {isLoading ? 'Processing...' : 'Start My Food Plaza'}
                                                                      </button>
                                                               </div>
                                                        </div>
                                                 )}
                                          </form>
                                   </div>
                            </div>
                     </div>
              </div>
       );
}
