'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, CheckCircle, Upload, Image as ImageIcon, FileText, X, MapPin, Search, Loader2, Navigation, Check } from 'lucide-react';
import Link from 'next/link';
// Removed hardcoded INDIAN_STATES and STATE_CITIES imports

export default function VendorRegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    category: '',
    subCategory: '',
    mobile: '',
    email: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    area: '',
    circle: '',
    latitude: null as number | null,
    longitude: null as number | null,
    idProof: null as File | null,
    businessPhoto: null as File | null,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [feesConfig, setFeesConfig] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'six_monthly' | 'yearly'>('monthly');

  // Dynamic Location States
  const [dbStates, setDbStates] = useState<string[]>([]);
  const [dbCities, setDbCities] = useState<string[]>([]);
  const [dbTowns, setDbTowns] = useState<string[]>([]);
  const [dbMarkets, setDbMarkets] = useState<string[]>([]);

  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingTowns, setIsLoadingTowns] = useState(false);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (res.ok) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();

    const fetchFees = async () => {
      try {
        const res = await fetch('/api/payment-fees/config');
        if (res.ok) {
          const config = await res.json();
          setFeesConfig(config);
        }
      } catch (err) {
        console.error('Failed to fetch fees config:', err);
      }
    };
    fetchFees();

    // Fetch Initial States
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const res = await fetch('/api/locations');
        const data = await res.json();
        if (data.success) setDbStates(data.data);
      } catch (err) {
        console.error('Failed to fetch states:', err);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Cascading Fetch for Cities
  useEffect(() => {
    if (!formData.state) {
      setDbCities([]);
      return;
    }
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const res = await fetch(`/api/locations?parentType=state&parentValue=${encodeURIComponent(formData.state)}`);
        const data = await res.json();
        if (data.success) setDbCities(data.data);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      } finally {
        setIsLoadingCities(false);
      }
    };
    fetchCities();
  }, [formData.state]);

  // Cascading Fetch for Towns (Circle / Area)
  useEffect(() => {
    if (!formData.city) {
      setDbTowns([]);
      return;
    }
    const fetchTowns = async () => {
      setIsLoadingTowns(true);
      try {
        const res = await fetch(`/api/locations?parentType=city&parentValue=${encodeURIComponent(formData.city)}`);
        const data = await res.json();
        if (data.success) setDbTowns(data.data);
      } catch (err) {
        console.error('Failed to fetch towns:', err);
      } finally {
        setIsLoadingTowns(false);
      }
    };
    fetchTowns();
  }, [formData.city]);

  // Cascading Fetch for Markets (Specific Market)
  useEffect(() => {
    if (!formData.area) {
      setDbMarkets([]);
      return;
    }
    const fetchMarkets = async () => {
      setIsLoadingMarkets(true);
      try {
        const res = await fetch(`/api/locations?parentType=town&parentValue=${encodeURIComponent(formData.area)}`);
        const data = await res.json();
        if (data.success) setDbMarkets(data.data);
      } catch (err) {
        console.error('Failed to fetch markets:', err);
      } finally {
        setIsLoadingMarkets(false);
      }
    };
    fetchMarkets();
  }, [formData.area]);

  const uploadFile = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'vendor-documents');
    formData.append('folder', folder);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  const validateStep = (currentStep: number) => {
    setError('');
    if (currentStep === 1) {
      if (!formData.businessName.trim()) { setError('Business Name is required'); return false; }
      if (!formData.ownerName.trim()) { setError('Owner Name is required'); return false; }
      if (!formData.category) { setError('Please select a category'); return false; }
      if (formData.category === 'Services' && !formData.subCategory) { setError('Please select a specialization'); return false; }
    } else if (currentStep === 2) {
      if (!formData.mobile || formData.mobile.length < 10) { setError('Valid 10-digit mobile number is required'); return false; }
    } else if (currentStep === 3) {
      if (!formData.latitude || !formData.longitude) { setError('Please pin your business location on the map'); return false; }
      if (!formData.address.trim()) { setError('Full address is required'); return false; }
      if (!formData.state) { setError('State is required'); return false; }
      if (!formData.city) { setError('City is required'); return false; }
      if (!formData.area) { setError('Area / Circle is required'); return false; }
      if (!formData.circle) { setError('Specific Market is required'); return false; }
    } else if (currentStep === 4) {
      if (!formData.idProof) { setError('ID Proof is required'); return false; }
      if (!formData.businessPhoto) { setError('Business Photo is required'); return false; }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setError('');
    setIsLoading(true);

    try {
      let idProofUrl = '';
      let businessPhotoUrl = '';

      // Upload ID Proof
      if (formData.idProof) {
        idProofUrl = await uploadFile(formData.idProof, 'id-proofs');
      }

      // Upload Business Photo
      if (formData.businessPhoto) {
        businessPhotoUrl = await uploadFile(formData.businessPhoto, 'shop-photos');
      }

      // Sanitize payload: remove File objects before sending
      const { idProof, businessPhoto, ...restData } = formData;

      const res = await fetch('/api/vendor/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...restData,
          idProofUrl,
          businessPhotoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }
      // First month is FREE — activate vendor session immediately
      const activatedVendor = { ...data.vendor, status: 'Active' };
      localStorage.setItem('localmarket_vendor', JSON.stringify(activatedVendor));
      window.dispatchEvent(new Event('authchange'));
      setVendorId(data.vendor.id);
      setStep(5); // Move to Free Success Step
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handlePayment = async (vId?: string) => {
    const targetVendorId = vId || vendorId;
    if (!targetVendorId) return;
    setIsLoading(true);

    const amount = feesConfig ? 
        selectedPlan === 'yearly' ? feesConfig.yearly_fee : 
        selectedPlan === 'six_monthly' ? feesConfig.six_monthly_fee : 
        feesConfig.monthly_fee 
        : 999;

    try {
      // 1. Create Order
      const orderRes = await fetch('/api/vendor/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, vendorId: targetVendorId })
      });
      const order = await orderRes.json();

      if (!orderRes.ok) throw new Error(order.error || 'Failed to create payment order');

      // 2. Open Razorpay Checkout
      const options = {
        key: 'rzp_test_SXOB9nGQEZFczQ',
        amount: order.amount,
        currency: order.currency,
        name: "Local Market",
        description: "Vendor Registration Fee",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/vendor/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                vendorId: targetVendorId,
                amount,
                plan: selectedPlan
              })
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              setSuccess('Payment successful! Your account is now active.');
              // Re-fetch vendor data and update local storage
              const updatedVendor = { ...JSON.parse(localStorage.getItem('localmarket_vendor') || '{}'), status: 'Active' };
              localStorage.setItem('localmarket_vendor', JSON.stringify(updatedVendor));
              window.dispatchEvent(new Event('authchange'));
              
              setTimeout(() => {
                router.push('/vendor/dashboard/analytics');
              }, 1500);
            } else {
              setError(verifyData.message || 'Payment verification failed');
            }
          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: formData.ownerName,
          email: formData.email,
          contact: `+91${formData.mobile}`
        },
        theme: { color: "#f97316" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSearchPlaces = async (query: string) => {
    setSearchQuery(query);
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsSearching(true);
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Failed to search places:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (loc: any) => {
    setFormData(prev => ({
      ...prev,
      latitude: parseFloat(loc.lat),
      longitude: parseFloat(loc.lon),
      address: loc.display_name,
      state: loc.address.state || prev.state,
      city: loc.address.city || loc.address.town || loc.address.village || prev.city,
      pincode: loc.address.postcode || prev.pincode,
      area: loc.address.suburb || loc.address.neighbourhood || prev.area,
    }));
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handlePinLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsPinning(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            const addr = data.address;
            setFormData(prev => ({
              ...prev,
              latitude,
              longitude,
              address: data.display_name,
              state: addr.state || prev.state,
              city: addr.city || addr.town || addr.village || prev.city,
              pincode: addr.postcode || prev.pincode,
              area: addr.suburb || addr.neighbourhood || prev.area,
            }));
          } else {
            setFormData(prev => ({ ...prev, latitude, longitude }));
          }
        } catch (err) {
          console.error('Reverse geocode failed:', err);
          setFormData(prev => ({ ...prev, latitude, longitude }));
        } finally {
          setIsPinning(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Failed to get your location. Please ensure location permissions are granted.');
        setIsPinning(false);
      }
    );
  };

  const SERVICE_CATEGORIES = [
    'Carpenter', 'Plumber', 'Electrician', 'Painter', 'AC Repair', 'Cleaning', 'Pest Control', 'Gardening'
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-900 mb-6 transition-colors font-medium hover:opacity-70"
        >
          <ArrowLeft size={20} />
          <span>Back to Login</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-primary p-6 sm:p-8 text-white text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={32} style={{ color: 'var(--primary)' }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Register Your Business</h1>
            <p className="text-white/90">Join Local Market and grow your business</p>
          </div>

          {/* Progress Steps */}
          <div className="px-6 sm:px-8 pt-6">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${step >= s ? 'text-white' : 'border-gray-300 text-gray-900'}`}
                    style={step >= s ? { background: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
                  >
                    {step > s ? <CheckCircle size={20} /> : s}
                  </div>
                  {s < 5 && (
                    <div
                      className="flex-1 h-1 mx-2 transition-colors rounded-full"
                      style={{ background: step > s ? 'var(--primary)' : '#d1d5db' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          <div className="px-6 sm:px-8 mt-4">
            {error && step < 5 && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-8">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Business Information</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleChange('ownerName', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter owner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    required
                    disabled={isLoadingCategories}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white disabled:opacity-50"
                  >
                    <option value="" className="text-gray-400">
                      {isLoadingCategories ? 'Loading categories...' : 'Select category'}
                    </option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.category === 'Services' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Specialization <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subCategory}
                      onChange={(e) => handleChange('subCategory', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white"
                    >
                      <option value="" className="text-gray-400">Select specialization</option>
                      {SERVICE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => validateStep(1) && setStep(2)}
                  className="w-full py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-colors" style={{ background: 'var(--primary)' }}
                >
                  Next Step
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      required
                      maxLength={10}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => validateStep(2) && setStep(3)}
                    className="flex-1 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-colors" style={{ background: 'var(--primary)' }}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Address Information</h2>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Pin Your Business Location <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handlePinLocation}
                      disabled={isPinning}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-70 transition-opacity disabled:opacity-50"
                    >
                      {isPinning ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
                      {isPinning ? 'Detecting...' : 'Pin Current Location'}
                    </button>
                  </div>

                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Search size={18} />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchPlaces(e.target.value)}
                      onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400"
                      placeholder="Search for your shop address or area..."
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 size={16} className="text-primary animate-spin" />
                      </div>
                    )}

                    {/* Autocomplete Suggestions */}
                    {showSuggestions && searchQuery.length >= 2 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {suggestions.length > 0 ? (
                          suggestions.map((loc, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelectLocation(loc)}
                              className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-start gap-3 border-b border-gray-50 last:border-0 transition-colors"
                            >
                              <div className="mt-1 p-1 bg-slate-100 rounded text-slate-500">
                                <MapPin size={14} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 leading-tight mb-0.5">{loc.display_name.split(',')[0]}</p>
                                <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{loc.display_name.split(',').slice(1).join(',').trim()}</p>
                              </div>
                            </div>
                          ))
                        ) : !isSearching ? (
                          <div className="px-4 py-6 text-center text-gray-500">
                            <MapPin size={24} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm font-medium">No matches found for "{searchQuery}"</p>
                            <p className="text-[10px] mt-1">Try a different area or city name</p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.latitude ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                        <MapPin size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Latitude</p>
                        <p className="text-xs font-bold text-slate-900">{formData.latitude ? formData.latitude.toFixed(6) : 'Not Pinned'}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.longitude ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                        <MapPin size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Longitude</p>
                        <p className="text-xs font-bold text-slate-900">{formData.longitude ? formData.longitude.toFixed(6) : 'Not Pinned'}</p>
                      </div>
                    </div>
                  </div>

                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Address (Will be auto-filled from pin) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 placeholder:text-gray-400 resize-none"
                    placeholder="Enter full address"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => {
                        const newState = e.target.value;
                        setFormData(prev => ({ ...prev, state: newState, city: '', circle: '', area: '' }));
                      }}
                      required
                      disabled={isLoadingStates}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white"
                    >
                      <option value="">{isLoadingStates ? 'Loading states...' : 'Select state'}</option>
                      {dbStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        setFormData(prev => ({ ...prev, city: newCity, circle: '', area: '' }));
                      }}
                      required
                      disabled={!formData.state || isLoadingCities}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{isLoadingCities ? 'Loading cities...' : 'Select city'}</option>
                      {dbCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Circle / Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => {
                        const newArea = e.target.value;
                        setFormData(prev => ({ ...prev, area: newArea, circle: '' }));
                      }}
                      required
                      disabled={!formData.city || isLoadingTowns}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white disabled:opacity-50"
                    >
                      <option value="">{isLoadingTowns ? 'Loading...' : 'Select Circle / Area'}</option>
                      {dbTowns.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                      {!isLoadingTowns && formData.city && <option value="Other">Other / Not Listed</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Specific Market <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.circle}
                      onChange={(e) => handleChange('circle', e.target.value)}
                      required
                      disabled={!formData.area || isLoadingMarkets}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 bg-white disabled:opacity-50"
                    >
                      <option value="">{isLoadingMarkets ? 'Loading...' : 'Select Market'}</option>
                      {dbMarkets.map(market => (
                        <option key={market} value={market}>{market}</option>
                      ))}
                      {!isLoadingMarkets && formData.area && <option value="Other">Other / Not Listed</option>}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => validateStep(3) && setStep(4)}
                    className="flex-1 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-colors" style={{ background: 'var(--primary)' }}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Verification & Documents</h2>

                {/* ID Proof Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    ID Proof (Aadhar/PAN/Voter ID) <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${formData.idProof ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-primary'
                    }`}>
                    {formData.idProof ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500 text-white rounded-lg">
                            <FileText size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{formData.idProof.name}</p>
                            <p className="text-xs text-gray-500">{(formData.idProof.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button onClick={() => handleFileChange('idProof', null)} className="p-1 hover:bg-green-100 rounded-full text-green-600">
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="text-gray-400 mb-2" size={32} />
                        <span className="text-sm font-medium text-gray-900">Click to upload ID proof</span>
                        <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</span>
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange('idProof', e.target.files?.[0] || null)} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Business Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Business Photo / Self Photo <span className="text-red-500">*</span>
                  </label>
                  <div className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${formData.businessPhoto ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-primary'
                    }`}>
                    {formData.businessPhoto ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-500 text-white rounded-lg">
                            <ImageIcon size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{formData.businessPhoto.name}</p>
                            <p className="text-xs text-gray-500">{(formData.businessPhoto.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button onClick={() => handleFileChange('businessPhoto', null)} className="p-1 hover:bg-green-100 rounded-full text-green-600">
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer">
                        <ImageIcon className="text-gray-400 mb-2" size={32} />
                        <span className="text-sm font-medium text-gray-900">Click to upload business photo</span>
                        <span className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</span>
                        <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={(e) => handleFileChange('businessPhoto', e.target.files?.[0] || null)} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !formData.idProof || !formData.businessPhoto}
                    className="flex-1 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: 'var(--primary)' }}
                  >
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
                <div className="space-y-6 text-center py-8">
                    {/* Celebration Icon */}
                    <div className="relative w-24 h-24 mx-auto mb-2">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-200">
                            <Check size={44} className="text-white" strokeWidth={3} />
                        </div>
                        <span className="absolute -top-2 -right-2 text-2xl animate-bounce">🎉</span>
                    </div>

                    {/* Heading */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Registration Successful!</h2>
                        <p className="text-gray-500 mt-2 text-sm">Welcome to Local Market. Your shop is now live!</p>
                    </div>

                    {/* FREE Banner */}
                    <div className="mx-auto max-w-sm bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-5 shadow-lg shadow-orange-200 text-white">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-2xl">🎁</span>
                            <span className="text-xs font-black uppercase tracking-widest opacity-90">Special Offer</span>
                        </div>
                        <p className="text-3xl font-black mb-1">First Month FREE!</p>
                        <p className="text-sm font-semibold opacity-90">No payment required — your shop is active for 30 days on us.</p>
                        <div className="mt-3 bg-white/20 rounded-xl px-4 py-2 text-xs font-bold">
                            ✅ &nbsp;Your shop is now live and visible to customers
                        </div>
                    </div>

                    {/* Info Note */}
                    <p className="text-xs text-gray-400 max-w-xs mx-auto">
                        After your free month, you can choose a plan to continue. We'll notify you before the trial ends.
                    </p>

                    {/* Go to Dashboard Button */}
                    <button
                        onClick={() => router.push('/vendor/dashboard/analytics')}
                        className="w-full py-4 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-orange-200 active:scale-95"
                        style={{ background: 'var(--primary)' }}
                    >
                        Go to My Dashboard →
                    </button>
                </div>
            )}
          </form>
        </div>
      </div>
      
      {/* Razorpay Script Loading */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  );
}

