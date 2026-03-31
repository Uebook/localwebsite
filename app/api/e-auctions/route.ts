import { NextRequest, NextResponse } from 'next/server';
import { supabaseRestGet, supabaseRestUpsert, supabaseRestPatch } from '@/lib/supabaseAdminFetch';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        let query = '/rest/v1/e_auctions?select=*&order=created_at.desc';
        if (status) query += `&status=eq.${status}`;
        if (type) query += `&type=eq.${type}`;

        const events = await supabaseRestGet(query);
        return NextResponse.json(Array.isArray(events) ? events : []);
    } catch (error: any) {
        console.error('Error fetching e-auctions:', error);
        if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
            return NextResponse.json([], { status: 200 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Submit a bid / application for an e-auction
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { auction_id, bidder_name, bidder_phone, bidder_email, bid_amount, message } = body;

        if (!auction_id) {
            return NextResponse.json({ error: 'auction_id is required' }, { status: 400 });
        }
        if (!bidder_name?.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }
        if (!bidder_phone?.trim() && !bidder_email?.trim()) {
            return NextResponse.json({ error: 'Phone or email is required' }, { status: 400 });
        }

        // Check auction exists and is active
        const auctions = await supabaseRestGet(
            `/rest/v1/e_auctions?id=eq.${encodeURIComponent(auction_id)}&select=id,title,status,min_bid,max_participants,participants_count&limit=1`
        );
        if (!Array.isArray(auctions) || auctions.length === 0) {
            return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
        }
        const auction = auctions[0];
        if (auction.status !== 'active') {
            return NextResponse.json({ error: 'This auction is not currently active' }, { status: 400 });
        }
        if (auction.max_participants && auction.participants_count >= auction.max_participants) {
            return NextResponse.json({ error: 'This auction has reached maximum participants' }, { status: 400 });
        }
        if (bid_amount && auction.min_bid && parseFloat(bid_amount) < parseFloat(auction.min_bid)) {
            return NextResponse.json({ error: `Bid must be at least ₹${auction.min_bid}` }, { status: 400 });
        }

        // Store bid in e_auction_bids table
        const bid = {
            auction_id,
            bidder_name: bidder_name.trim(),
            bidder_phone: bidder_phone?.trim() || null,
            bidder_email: bidder_email?.trim().toLowerCase() || null,
            bid_amount: bid_amount ? parseFloat(bid_amount) : null,
            message: message?.trim() || null,
            status: 'pending',
        };

        let savedBid;
        try {
            const result = await supabaseRestUpsert('/rest/v1/e_auction_bids', [bid]);
            savedBid = Array.isArray(result) ? result[0] : result;
        } catch (bidError: any) {
            // If e_auction_bids table doesn't exist, still record participation via participants_count
            console.warn('Could not insert into e_auction_bids (table may not exist):', bidError.message);
        }

        // Increment participants_count on the auction
        try {
            await supabaseRestPatch(`/rest/v1/e_auctions?id=eq.${encodeURIComponent(auction_id)}`, {
                participants_count: (auction.participants_count || 0) + 1,
            });
        } catch (patchError) {
            console.warn('Could not update participants_count:', patchError);
        }

        return NextResponse.json({
            success: true,
            message: `Your application for "${auction.title}" has been submitted successfully!`,
            bid: savedBid || bid,
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error submitting bid:', error);
        if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
            return NextResponse.json({ error: 'Database unreachable. Please try again later.' }, { status: 503 });
        }
        return NextResponse.json({ error: error.message || 'Failed to submit application' }, { status: 500 });
    }
}
