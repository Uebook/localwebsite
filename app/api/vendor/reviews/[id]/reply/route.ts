import { NextResponse } from 'next/server';
import { supabaseRestPatch } from '@/lib/supabaseAdminFetch';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { reply } = body;

        if (!id || !reply) {
            return NextResponse.json(
                { error: 'Review ID and reply text are required.' },
                { status: 400 }
            );
        }

        // Update the review with the reply
        const result = await supabaseRestPatch(`/rest/v1/reviews?id=eq.${id}`, {
            reply: reply,
        });

        if (result === null) {
            throw new Error('Failed to save reply');
        }

        return NextResponse.json({ success: true, message: 'Reply saved successfully.' }, { status: 200 });
    } catch (error: any) {
        console.error('Error saving review reply:', error);
        return NextResponse.json(
            { error: error?.message || 'Internal server error while saving reply.' },
            { status: 500 }
        );
    }
}
