import { NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

// GET /api/payment-fees/config - Get configuration
export async function GET() {
  try {
    const config = await supabaseRestGet('/rest/v1/payment_fees_config?id=eq.default&select=*');
    const configData = Array.isArray(config) ? config[0] : config;
    return NextResponse.json(configData || {
      monthly_fee: 50,
      six_monthly_fee: 299,
      yearly_fee: 599,
      grace_period_days: 7,
      auto_block_enabled: true,
      banner_enabled: true,
      banner_badge: '🚀 Registration Offer',
      banner_title: 'Activate Your Vendor Account',
      banner_subtitle: 'Choose a subscription plan to start selling on Local Market and reach thousands of customers in your area.',
      banner_image_url: '',
    });
  } catch (error: any) {
    console.error('Error fetching payment fees config:', error.message);
    const isOffline = error.message && (error.message.includes('fetch failed') || error.message.includes('ENOTFOUND'));
    // Return default config if table doesn't exist or offline
    return NextResponse.json({
      monthly_fee: 50,
      six_monthly_fee: 299,
      yearly_fee: 599,
      grace_period_days: 7,
      auto_block_enabled: true,
      banner_enabled: true,
      banner_badge: '🚀 Registration Offer',
      banner_title: 'Activate Your Vendor Account',
      banner_subtitle: 'Choose a subscription plan to start selling on Local Market and reach thousands of customers in your area.',
      banner_image_url: '',
      ...(isOffline && { warning: 'offline_mode' })
    });
  }
}
