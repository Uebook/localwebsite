import { NextResponse } from 'next/server';
import { supabaseRestGet } from '@/lib/supabaseAdminFetch';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentType = searchParams.get('parentType'); // 'state' | 'city' | 'town' | 'tehsil'
    const parentValue = searchParams.get('parentValue');

    let query = '';
    let transform = (data: any[]) => data;

    if (!parentType) {
      // Get all states
      query = '/rest/v1/locations?select=state';
      transform = (data: any[]) => Array.from(new Set(data.map(item => item.state))).sort();
    } else if (parentType === 'state') {
      // Get cities for a state
      query = `/rest/v1/locations?state=eq.${encodeURIComponent(parentValue!)}&select=city`;
      transform = (data: any[]) => Array.from(new Set(data.map(item => item.city))).sort();
    } else if (parentType === 'city') {
      // Get towns for a city
      query = `/rest/v1/locations?city=eq.${encodeURIComponent(parentValue!)}&select=town`;
      transform = (data: any[]) => Array.from(new Set(data.map(item => item.town))).sort();
    } else if (parentType === 'town') {
      // Get tehsils for a town
      query = `/rest/v1/locations?town=eq.${encodeURIComponent(parentValue!)}&select=tehsil`;
      transform = (data: any[]) => Array.from(new Set(data.map(item => item.tehsil))).sort();
    } else if (parentType === 'tehsil') {
      // Get sub-tehsils for a tehsil
      query = `/rest/v1/locations?tehsil=eq.${encodeURIComponent(parentValue!)}&select=sub_tehsil`;
      transform = (data: any[]) => Array.from(new Set(data.map(item => item.sub_tehsil))).sort();
    }

    const data = await supabaseRestGet(query);
    const result = transform(data);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching dynamic locations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch locations' }, { status: 500 });
  }
}
