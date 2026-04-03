'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, AlertCircle, Info } from 'lucide-react';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vendorId = searchParams.get('vid');

    const [feesConfig, setFeesConfig] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'six_monthly' | 'yearly'>('monthly');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!vendorId) {
            router.push('/login');
            return;
        }
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
    }, [vendorId, router]);

    const handlePayment = async () => {
        if (!vendorId) return;
        setIsLoading(true);
        setError('');

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
                body: JSON.stringify({ amount, vendorId })
            });
            const order = await orderRes.json();
            
            if (!orderRes.ok) throw new Error(order.error || 'Failed to create payment order');

            // 2. Initialize Razorpay
            const options = {
                key: 'rzp_test_SXOB9nGQEZFczQ',
                amount: order.amount,
                currency: order.currency,
                name: 'Local Market',
                description: 'Vendor Subscription Activation',
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch('/api/vendor/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                ...response,
                                vendorId,
                                amount,
                                plan: selectedPlan
                            })
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.success) {
                            setSuccess('Payment successful! Your account is now active.');
                            setTimeout(() => {
                                router.push('/login');
                            }, 3000);
                        } else {
                            setError('Payment verification failed. Please contact support.');
                        }
                    } catch (err) {
                        setError('Payment verification failed.');
                    }
                },
                prefill: {
                    contact: '',
                },
                theme: {
                    color: '#f97316' // Tailwind orange-500
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setError(`Payment failed: ${response.error.description}`);
            });
            rzp.open();
        } catch (err: any) {
            setError(err.message || 'Payment initiation failed.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!vendorId) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'var(--background)' }}>
             <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Admin-Controlled Subscription Banner */}
                {feesConfig?.banner_enabled && (
                    <div
                        className="w-full rounded-2xl mb-6 shadow-lg overflow-hidden"
                        style={{ border: '1.5px solid #fdba74' }}
                    >
                        {/* Optional Banner Image */}
                        {feesConfig?.banner_image_url && (
                            <img
                                src={feesConfig.banner_image_url}
                                alt="Subscription Banner"
                                className="w-full h-40 object-cover"
                            />
                        )}
                        <div
                            className="p-6"
                            style={{
                                background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 60%, #ffedd5 100%)',
                            }}
                        >
                            <span
                                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                                style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)', color: '#fff', letterSpacing: '0.03em' }}
                            >
                                {feesConfig.banner_badge || 'PREMIUM'}
                            </span>
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                                {feesConfig.banner_title || 'Unlock Your Potential'}
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {feesConfig.banner_subtitle || 'Upgrade your subscription to access premium features and reach more customers.'}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Check size={12} className="text-orange-600" />
                                    </span>
                                    Instant account activation
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Check size={12} className="text-orange-600" />
                                    </span>
                                    Reach local customers
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Check size={12} className="text-orange-600" />
                                    </span>
                                    Flexible plans
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                 <div className="text-center space-y-4 mb-8">
                     <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                         <AlertCircle size={32} className="text-orange-500" />
                     </div>
                     <h1 className="text-3xl font-bold text-gray-900">Subscription Required</h1>
                     <p className="text-gray-500">Your account is currently inactive or your subscription has expired. Please select a plan to continue accessing your dashboard.</p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
                        <div 
                           onClick={() => setSelectedPlan('monthly')}
                           className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'monthly' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'}`}
                        >
                            <h3 className="font-bold text-gray-900 mb-1">Monthly</h3>
                            <div className="text-2xl font-black text-orange-600 mb-2">₹{feesConfig?.monthly_fee || 50}</div>
                            <p className="text-xs text-gray-500">Validity: 30 Days</p>
                        </div>
                        <div 
                           onClick={() => setSelectedPlan('six_monthly')}
                           className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'six_monthly' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'}`}
                        >
                            <h3 className="font-bold text-gray-900 mb-1">6 Months</h3>
                            <div className="text-2xl font-black text-orange-600 mb-2">₹{feesConfig?.six_monthly_fee || 299}</div>
                            <p className="text-xs text-gray-500">Validity: 180 Days</p>
                        </div>
                        <div 
                           onClick={() => setSelectedPlan('yearly')}
                           className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPlan === 'yearly' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-300'}`}
                        >
                            <h3 className="font-bold text-gray-900 mb-1">Yearly</h3>
                            <div className="text-2xl font-black text-orange-600 mb-2">₹{feesConfig?.yearly_fee || 599}</div>
                            <p className="text-xs text-gray-500">Validity: 365 Days</p>
                        </div>
                 </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold mb-6">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-semibold mb-6">
                        {success}
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={isLoading || !!success}
                    className="w-full py-4 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'var(--primary)' }}
                >
                    {isLoading ? 'Processing Payment...' : 'Pay with Razorpay'}
                </button>
             </div>
        </div>
    );
}

export default function VendorPaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4">Loading payment details...</div>}>
            <PaymentContent />
        </Suspense>
    );
}
