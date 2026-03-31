import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseRestPatch, supabaseRestInsert, supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function POST(request: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      vendorId,
      amount,
      plan
    } = await request.json();

    const secret = '5zrCupExMlJAvl5fhQHvEWoL';
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment Verified
      console.log('✅ Payment Verified for vendor:', vendorId);

      try {
        // 1. Update Vendor Status to Active
        console.log('Updating vendor status to Active...');
        await supabaseRestPatch(`/rest/v1/vendors?id=eq.${vendorId}`, {
          status: 'Active',
          kyc_status: 'Approved' 
        });

        // 2. Create/Update Billing Record
        console.log('Fetching existing billing record...');
        const existingBilling = await supabaseRestGet(`/rest/v1/vendor_billing?vendor_id=eq.${vendorId}&select=id&limit=1`);
        
        // Calculate dynamic due date based on the plan
        const calculateNextDueDate = (currentDate: Date, planName: string) => {
           const date = new Date(currentDate);
           if (planName === 'monthly') date.setMonth(date.getMonth() + 1);
           else if (planName === 'six_monthly') date.setMonth(date.getMonth() + 6);
           else if (planName === 'yearly') date.setFullYear(date.getFullYear() + 1);
           else date.setDate(date.getDate() + 30); // fallback
           return date.toISOString().split('T')[0];
        };

        const billingData = {
          vendor_id: vendorId,
          amount: amount || 999,
          status: 'paid',
          plan: plan || 'monthly',
          paid_at: new Date().toISOString(),
          due_date: calculateNextDueDate(new Date(), plan || 'monthly'),
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id
        };

        if (Array.isArray(existingBilling) && existingBilling.length > 0) {
          console.log('Updating existing billing record:', existingBilling[0].id);
          await supabaseRestPatch(`/rest/v1/vendor_billing?id=eq.${existingBilling[0].id}`, billingData);
        } else {
          console.log('Creating new billing record...');
          await supabaseRestInsert('/rest/v1/vendor_billing', billingData);
        }

        console.log('✅ Billing record successfully updated/created');
        return NextResponse.json({ success: true, message: "Payment verified successfully" });
      } catch (dbError: any) {
        console.error('❌ Database Operation Error during Verification:', dbError);
        return NextResponse.json({ 
          success: true, // Verification succeeded, but DB update failed
          message: "Payment verified but database update failed",
          warning: dbError.message 
        }, { status: 200 }); // Still return 200 so UI doesn't show hard error after successful payment? 
        // Actually it might be better to return error if critical, but if payment is done user should know.
      }
    } else {
      console.warn('⚠️ Invalid Razorpay signature received');
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
