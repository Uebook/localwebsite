'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Briefcase, CheckCircle, Upload, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { INDIAN_STATES, STATE_CITIES } from '@/lib/locationData';
import WelcomeAnimation from '@/components/WelcomeAnimation';

export default function ServiceProviderRegisterPage() {
       const [step, setStep] = useState(1);
       const [isLoading, setIsLoading] = useState(false);
       const [error, setError] = useState('');
       const [success, setSuccess] = useState('');
       const [showWelcome, setShowWelcome] = useState(false);
       const router = useRouter();

       const [formData, setFormData] = useState({
              fullName: '',
              serviceType: '',
              experience: '',
              mobile: '',
              email: '',
              address: '',
              state: '',
              city: '',
              pincode: '',
              basePrice: '',
       });

       const SERVICE_TYPES = [
              'Carpenter', 'Plumber', 'Electrician', 'Painter', 'AC Repair', 'Cleaning',
              'Pest Control', 'Gardening', 'Mechanic', 'CCTV Technician'
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
                                   businessName: `${formData.fullName} - ${formData.serviceType}`,
                                   ownerName: formData.fullName,
                                   category: 'Services',
                                   subCategory: formData.serviceType,
                                   mobile: formData.mobile,
                                   email: formData.email,
                                   address: formData.address,
                                   state: formData.state,
                                   city: formData.city,
                                   pincode: formData.pincode,
                                   isServiceProvider: true,
                                   basePrice: formData.basePrice
                            }),
                     });

                     const data = await res.json();
                     if (!res.ok) throw new Error(data.error || 'Registration failed');

                     setSuccess('Registration successful! 🎉');
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
              <div className="min-h-screen bg-white">
                     <div className="max-w-4xl mx-auto px-4 py-8">
                            <Link href="/login" className="inline-flex items-center gap-2 text-gray-900 mb-6 font-medium hover:opacity-70">
                                   <ArrowLeft size={20} />
                                   <span>Back to Login</span>
                            </Link>

                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                                   <div className="bg-gradient-primary p-8 text-white text-center">
                                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                                 <User size={32} style={{ color: 'var(--primary)' }} />
                                          </div>
                                          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Service Provider Registration</h1>
                                          <p className="text-white/90">Reach thousands of customers in your local area</p>
                                   </div>

                                   <div className="p-8">
                                          <div className="flex items-center justify-between mb-8">
                                                 {[1, 2, 3].map((s) => (
                                                        <div key={s} className="flex items-center flex-1">
                                                               <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step >= s ? 'text-white' : 'border-gray-300 text-gray-400'}`}
                                                                      style={step >= s ? { background: 'var(--primary)', borderColor: 'var(--primary)' } : {}}>
                                                                      {step > s ? <CheckCircle size={20} /> : s}
                                                               </div>
                                                               {s < 3 && <div className="flex-1 h-1 mx-2 rounded-full" style={{ background: step > s ? 'var(--primary)' : '#e5e7eb' }} />}
                                                        </div>
                                                 ))}
                                          </div>

                                          <form onSubmit={handleSubmit} className="space-y-6">
                                                 {step === 1 && (
                                                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                                               <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
                                                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                      <div>
                                                                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                                                             <input type="text" required value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)}
                                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" />
                                                                      </div>
                                                                      <div>
                                                                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Type</label>
                                                                             <select required value={formData.serviceType} onChange={(e) => handleChange('serviceType', e.target.value)}
                                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white">
                                                                                    <option value="">Select Service</option>
                                                                                    {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                                                             </select>
                                                                      </div>
                                                               </div>
                                                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                      <div>
                                                                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                                                                             <input type="tel" required value={formData.mobile} onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                                                    placeholder="10-digit number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                                                      </div>
                                                                      <div>
                                                                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (Years)</label>
                                                                             <input type="number" required value={formData.experience} onChange={(e) => handleChange('experience', e.target.value)}
                                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                                                      </div>
                                                               </div>
                                                               <button type="button" onClick={() => setStep(2)} className="w-full py-4 bg-gradient-primary text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-all">
                                                                      Next Step
                                                               </button>
                                                        </div>
                                                 )}

                                                 {step === 2 && (
                                                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                                               <h2 className="text-xl font-bold text-gray-900 mb-4">Location Details</h2>
                                                               <div>
                                                                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address</label>
                                                                      <textarea required value={formData.address} onChange={(e) => handleChange('address', e.target.value)} rows={3}
                                                                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none" />
                                                               </div>
                                                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                      <div>
                                                                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">State</label>
                                                                             <select required value={formData.state} onChange={(e) => handleChange('state', e.target.value)}
                                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white">
                                                                                    <option value="">Select State</option>
                                                                                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                                                             </select>
                                                                      </div>
                                                                      <div>
                                                                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                                                                             <select required value={formData.city} onChange={(e) => handleChange('city', e.target.value)} disabled={!formData.state}
                                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary bg-white disabled:bg-gray-50">
                                                                                    <option value="">Select City</option>
                                                                                    {formData.state && STATE_CITIES[formData.state]?.map(c => <option key={c} value={c}>{c}</option>)}
                                                                             </select>
                                                                      </div>
                                                                      <div>
                                                                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pincode</label>
                                                                             <input type="text" required value={formData.pincode} onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                                                                      </div>
                                                               </div>
                                                               <div className="flex gap-4">
                                                                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">Back</button>
                                                                      <button type="button" onClick={() => setStep(3)} className="flex-1 py-4 bg-gradient-primary text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-all">Next Step</button>
                                                               </div>
                                                        </div>
                                                 )}

                                                 {step === 3 && (
                                                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                                               <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing & Verification</h2>
                                                               <div>
                                                                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base Visiting Charge (₹)</label>
                                                                      <input type="number" required value={formData.basePrice} onChange={(e) => handleChange('basePrice', e.target.value)}
                                                                             placeholder="e.g. 299" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                                                               </div>
                                                               <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                                                      <p className="text-sm text-orange-800">By completing registration, you agree to our Service Partner guidelines. We may contact you for document verification.</p>
                                                               </div>
                                                               {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                                                               {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
                                                               <div className="flex gap-4">
                                                                      <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">Back</button>
                                                                      <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-gradient-primary text-white rounded-xl font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50">
                                                                             {isLoading ? 'Processing...' : 'Complete Registration'}
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
