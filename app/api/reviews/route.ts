import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestInsert } from '@/lib/supabaseAdminFetch';

export async function POST(request: NextRequest) {
       try {
              const body = await request.json();
              const { vendor_id, user_id, user_name, rating, comment } = body;

              if (!vendor_id || !user_id || !rating) {
                     return NextResponse.json(
                            { error: 'Vendor ID, User ID, and Rating are required.' },
                            { status: 400 }
                     );
              }

              const reviewData = {
                     vendor_id,
                     user_id,
                     user_name: user_name || 'Anonymous',
                     rating: Number(rating),
                     comment: comment || '',
                     created_at: new Date().toISOString(),
              };

              const result = await supabaseRestInsert('/rest/v1/reviews', reviewData);

              return NextResponse.json({
                     success: true,
                     message: 'Review submitted successfully.',
                     review: Array.isArray(result) ? result[0] : result
              }, { status: 201 });

       } catch (error: any) {
              console.error('Error submitting review:', error);
              return NextResponse.json(
                     { error: error?.message || 'Internal server error while submitting review.' },
                     { status: 500 }
              );
       }
}
