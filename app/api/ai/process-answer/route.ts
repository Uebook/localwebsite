import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const body = await request.json();
    const { step, answer, context } = body;
    const history = context?.history || [];
    const stepCount = (context?.stepCount || 0) + 1;
    const updatedHistory = [...history, { role: 'user', content: answer }];

    try {
        // context stores previous answers: { intent: '...', details: '...', urgency: '...' }
        const newContext = { ...context, [step]: answer };

        let response = {};

        const apiKey = process.env.GEMINI_API_KEY || '';
        if (!apiKey) {
            console.error('CRITICAL: GEMINI_API_KEY is missing from environment');
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // System prompt for strict scope and guided flow
        const systemPrompt = `
You are the "LOKALL" AI Assistant. Your ONLY purpose is to help users find local shops, vendors, and markets for products or services (e.g., food, electronics repair, groceries, plumbing).

STRICT RULES:
1. If the user asks anything UNRELATED to local shopping/services (e.g. general knowledge, jokes, unrelated help), politely but firmly redirect them: "I'm your Local Market assistant. I can only help you find shops and services nearby. What are you looking for today?"
2. This is step ${stepCount} of 4. Your goal is to narrow down the user's intent to provide precise results.
3. DO NOT ASK about budget, prices, or payment. We only show shops/vendors, we are not selling directly.
4. Focus on product/service specifics (e.g., brand preference, distance, urgency, specific features, material type).
5. If stepCount < 4: Ask a short, helpful clarifying question to narrow down the search. Provide 3 concise button options.
6. If stepCount >= 4: Inform the user you are finding the best matches.

Return ONLY JSON:
{
  "isOffTopic": boolean,
  "question": "Your next question or redirect message",
  "options": [{"label": "Text", "value": "val1"}, ...], 
  "isComplete": boolean (true if stepCount >= 4)
}
`;

        const chat = model.startChat({
            history: history.length > 0 ? history.map((m: any) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })) : [],
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await chat.sendMessage(answer + "\n\n" + systemPrompt);
        const aiResponse = JSON.parse(result.response.text());

        if (aiResponse.isOffTopic) {
            return NextResponse.json({
                error: 'invalid_query',
                message: aiResponse.question,
                nextStep: 'intent',
                question: "What would you like to find today?",
                options: [
                    { label: "🛒 Shopping", value: "grocery" },
                    { label: "🛠️ Home Services", value: "home_services" },
                    { label: "🍕 Food & Dining", value: "food" }
                ],
                updatedContext: { ...context, history: [], stepCount: 0 }
            }, { headers: corsHeaders() });
        }

        if (aiResponse.isComplete) {
            return NextResponse.json({
                nextStep: 'results',
                message: "Finding the best matches for you...",
                ready: true,
                updatedContext: { ...context, history: [...updatedHistory, { role: 'model', content: aiResponse.question }], stepCount }
            }, { headers: corsHeaders() });
        }

        response = {
            nextStep: 'details',
            question: aiResponse.question,
            options: aiResponse.options || [],
            inputMetadata: { type: 'selection_or_text' }
        };

        const finalHistory = [...updatedHistory, { role: 'model', content: aiResponse.question }];
        return NextResponse.json({ ...response, updatedContext: { ...context, history: finalHistory, stepCount } }, { headers: corsHeaders() });

    } catch (error: any) {
        console.error('Gemini failed, using fallback logic:', error.message);
        
        let fallbackQuestion = "Could you tell me more about what you need? (e.g. specific brand, location preference, or type)";
        let fallbackOptions = [
            { label: "Specific Brand", value: "brand" },
            { label: "Urgent Service", value: "urgent" },
            { label: "Nearby Only", value: "nearby" }
        ];

        // Assuming stepCount, updatedHistory, and context are available from the try block scope
        // If not, they would need to be initialized or passed differently.
        // For this change, we assume they are in scope.
        const history = context?.history || []; // Re-declare or ensure scope if needed
        const stepCount = (context?.stepCount || 0) + 1; // Re-declare or ensure scope if needed
        const updatedHistory = [...history, { role: 'user', content: answer }]; // Re-declare or ensure scope if needed

        if (stepCount >= 4) {
            return NextResponse.json({
                nextStep: 'results',
                message: "I've gathered enough details. Finding the best matches for you...",
                ready: true,
                updatedContext: { ...context, history: [...updatedHistory, { role: 'model', content: "finding results..." }], stepCount }
            }, { headers: corsHeaders() });
        }

        return NextResponse.json({
            nextStep: 'details',
            question: fallbackQuestion,
            options: fallbackOptions,
            updatedContext: { ...context, history: [...updatedHistory, { role: 'model', content: fallbackQuestion }], stepCount }
        }, { headers: corsHeaders() });
    }
}
