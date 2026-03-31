'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Briefcase, HelpCircle, ArrowRight, ArrowLeft, User, Phone, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLocation } from '@/lib/hooks';
import WelcomeAnimation from '@/components/WelcomeAnimation';

type Mode = 'login' | 'register';
type Method = 'mobile' | 'email';
type UserType = 'customer' | 'business';

export default function LoginPage() {
  const [userType, setUserType] = useState<UserType>('customer');
  const [mode, setMode] = useState<Mode>('login');
  const [method, setMethod] = useState<Method>('mobile');

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const { detectLocation } = useLocation();

  const router = useRouter();

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (mode === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (method === 'mobile' && phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (method === 'email' && !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Business users
    if (userType === 'business') {
      if (mode === 'register') {
        router.push('/vendor/register');
        return;
      }
      // Business login — call the real vendor auth API
      setIsLoading(true);
      try {
        const payload: any = {};
        if (method === 'mobile') payload.phone = phone.trim();
        if (method === 'email') payload.email = email.trim().toLowerCase();

        const res = await fetch('/api/vendor/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          if (data.needs_payment && data.vendorId) {
             router.push(`/vendor/payment?vid=${data.vendorId}`);
             return;
          }
          setError(data.error || 'Vendor login failed. Check your credentials or register first.');
          return;
        }
        localStorage.setItem('localmarket_vendor', JSON.stringify(data.vendor));
        window.dispatchEvent(new Event('authchange'));

        if (method === 'mobile' || userType === 'business') {
          setTimeout(() => setShowWelcome(true), 500);
        } else {
          setTimeout(() => router.push('/'), 1000);
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }


    setIsLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload: any = {};
      if (mode === 'register') payload.name = name.trim();
      if (method === 'mobile') payload.phone = phone.trim();
      if (method === 'email') payload.email = email.trim().toLowerCase();

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // Save session to localStorage
      const user = data.user;
      localStorage.setItem('localmarket_user', JSON.stringify(user));
      window.dispatchEvent(new Event('authchange'));

      // Auto-detect location on login
      detectLocation();

      setSuccess(mode === 'login' ? `Welcome back, ${user.name || 'there'}! 🎉` : `Account created! Welcome, ${user.name}! 🎉`);

      // Trigger animation for mobile login
      if (method === 'mobile') {
        setTimeout(() => setShowWelcome(true), 500);
      } else {
        setTimeout(() => router.push('/'), 1000);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = () => {
    if (mode === 'register' && !name.trim()) return false;
    if (method === 'mobile' && phone.length < 10) return false;
    if (method === 'email' && !email.includes('@')) return false;
    return true;
  };

  if (showWelcome) {
    const destination = userType === 'business' ? '/vendor/dashboard/analytics' : '/';
    return <WelcomeAnimation onComplete={() => router.push(destination)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header Banner */}
        <div className="relative bg-gradient-primary p-6 sm:p-8 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              {userType === 'business' ? (
                <Briefcase style={{ color: 'var(--primary)' }} size={40} />
              ) : (
                <ShoppingBag style={{ color: 'var(--primary)' }} size={40} />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-md" style={{ background: 'var(--primary)' }}>
              <CheckCircle className="text-white" size={14} />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            {userType === 'business' ? 'Local+ Business' : 'Local Market'}
          </h1>
          <p className="text-white/80 text-xs sm:text-sm">
            {mode === 'login' ? 'Sign in to your account' : 'Create your free account'}
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="p-3 bg-gray-50 flex gap-2 border-b border-gray-100">
          {(['customer', 'business'] as UserType[]).map((type) => (
            <button
              key={type}
              onClick={() => { setUserType(type); resetForm(); setMode('login'); }}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm capitalize transition-all ${userType === type ? 'bg-gradient-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              {type === 'customer' ? 'Customer' : 'Business'}
            </button>
          ))}
        </div>

        {/* Login / Register Mode Toggle (only for customers) */}
        {userType === 'customer' && (
          <div className="px-5 pt-4 flex gap-1 border-b border-gray-100 pb-0">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); resetForm(); }}
                className={`flex-1 py-2 text-sm font-bold capitalize transition-all border-b-2 ${mode === m ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                style={{ borderColor: mode === m ? 'var(--primary)' : undefined, color: mode === m ? 'var(--primary)' : undefined }}
              >
                {m === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>
        )}

        {/* Form */}
        <div className="p-5 sm:p-6 space-y-4">

          {/* Name field - register only */}
          {mode === 'register' && userType === 'customer' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 text-base"
                />
              </div>
            </div>
          )}

          {/* Method toggle */}
          <div>
            <div className="flex gap-2 mb-3 bg-gray-100 rounded-lg p-1">
              {(['mobile', 'email'] as Method[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${method === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {m === 'mobile' ? 'Mobile' : 'Email'}
                </button>
              ))}
            </div>

            {/* Input */}
            {method === 'mobile' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="px-3 py-3 bg-gray-50 border border-gray-300 rounded-lg font-semibold text-gray-700 text-sm flex items-center gap-1">
                    <Phone size={14} className="text-gray-400" />
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 text-base"
                    maxLength={10}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 text-base"
                  />
                </div>
              </div>
            )}
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

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !canSubmit()}
            className="w-full py-3.5 bg-gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md text-base"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Login' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Business register link */}
          {userType === 'business' && (
            <div className="text-center space-y-3">
              <Link
                href="/vendor/register"
                style={{ color: 'var(--primary)' }}
                className="block text-sm font-semibold hover:opacity-80 transition-colors"
              >
                Retail Business? Register Here →
              </Link>
              <div className="flex items-center gap-2 justify-center py-1">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Other Partners</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/service-provider/register"
                  className="px-4 py-2 bg-slate-50 rounded-xl text-[11px] font-black text-slate-600 hover:bg-primary/5 hover:text-primary transition-all border border-slate-100"
                >
                  Service Provider
                </Link>
                <Link
                  href="/food-plaza/register"
                  className="px-4 py-2 bg-slate-50 rounded-xl text-[11px] font-black text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all border border-slate-100"
                >
                  Food Plaza
                </Link>
              </div>
            </div>
          )}

          {/* Help */}
          <div className="pt-2 border-t border-gray-100 flex justify-center">
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
              <HelpCircle size={16} />
              Need Help?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
