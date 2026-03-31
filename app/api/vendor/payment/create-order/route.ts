import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_SXOB9nGQEZFczQ',
  key_secret: '5zrCupExMlJAvl5fhQHvEWoL',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, vendorId } = await request.json();

    if (!amount || !vendorId) {
      return NextResponse.json({ error: 'Amount and Vendor ID are required' }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `reg_${vendorId.toString().slice(-30)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Razorpay Order creation failed:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
