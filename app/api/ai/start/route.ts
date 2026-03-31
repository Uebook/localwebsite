import { NextResponse } from 'next/server';

// CORS headers helper
function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, location } = body;

        // In a real app, we might look up user preferences here

        return NextResponse.json({
            message: "Hi! 👋 I'll help you find the best service nearby. Just answer a few quick questions.",
            nextStep: 'intent',
            question: "What are you looking for today?",
            options: [
                { label: "🛒 Shopping & Groceries", value: "grocery" },
                { label: "🛠️ Home Services (Plumber, etc.)", value: "home_services" },
                { label: "📱 Electronics Repair", value: "electronics_repair" },
                { label: "🏥 Health & Wellness", value: "health" },
                { label: "🍕 Food & Dining", value: "food" },
                { label: "❓ Something else", value: "other" }
            ],
            inputMetadata: {
                type: 'selection_or_text',
                placeholder: 'e.g. Plumber, Laptop repair...'
            },
            updatedContext: { history: [], stepCount: 0 }
        }, { headers: corsHeaders() });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to start AI session' },
            { status: 500, headers: corsHeaders() }
        );
    }
}
