'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader2, RotateCcw, User, Bot, ChevronRight, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
    id: number;
    text: string;
    sender: 'ai' | 'user';
}

interface Option {
    label: string;
    value: string;
}

export default function AIChatWidget() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState('init');
    const [context, setContext] = useState<any>({});
    const [options, setOptions] = useState<Option[]>([]);
    const [results, setResults] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            startAISession();
        }
    }, [isOpen]);

    const addMessage = (text: string, sender: 'ai' | 'user') => {
        setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
    };

    const resetChat = () => {
        setMessages([]);
        setContext({});
        setResults(null);
        setOptions([]);
        setCurrentStep('init');
        startAISession();
    };

    const startAISession = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/ai/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'web_user' })
            });

            const data = await response.json();
            addMessage(data.message, 'ai');
            setCurrentStep(data.nextStep);
            setOptions(data.options || []);
            if (data.updatedContext) {
                setContext(data.updatedContext);
            }

            if (data.question) {
                setTimeout(() => addMessage(data.question, 'ai'), 500);
            }
        } catch (error) {
            console.error('AI Start Error:', error);
            addMessage("Sorry, I'm having trouble connecting. Please try again.", 'ai');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserResponse = async (answer: string, value?: string) => {
        const answerText = value || answer;
        addMessage(answer, 'user');
        setOptions([]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/process-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ step: currentStep, answer: answerText, context })
            });

            const data = await response.json();

            if (data.error === 'invalid_query') {
                addMessage(data.message, 'ai');
                setCurrentStep(data.nextStep || 'intent');
                setOptions(data.options || []);
                if (data.question) {
                    setTimeout(() => addMessage(data.question, 'ai'), 500);
                }
                setIsLoading(false);
                return;
            }

            if (data.updatedContext) {
                setContext(data.updatedContext);
            }

            if (data.nextStep === 'results') {
                addMessage(data.message, 'ai');
                setCurrentStep('results');
                fetchRecommendations(data.updatedContext);
            } else {
                setCurrentStep(data.nextStep);
                setOptions(data.options || []);
                if (data.question) {
                    addMessage(data.question, 'ai');
                }
            }
        } catch (error) {
            console.error('Processing Error:', error);
            addMessage("Something went wrong. Let's try again.", 'ai');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRecommendations = async (finalContext: any) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/ai/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context: finalContext })
            });

            const data = await response.json();
            setResults(data.vendors);
        } catch (err) {
            console.error('Recommendation Error:', err);
            addMessage("I couldn't find any matches right now.", 'ai');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Premium Floating Button */}
            {isVisible && !isOpen && (
                <div className="fixed bottom-8 right-8 z-50 group">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-slate-900 rounded-[2rem] shadow-2xl hover:shadow-primary/20 transition-all duration-500 flex items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Sparkles className="relative w-7 h-7 text-white group-hover:scale-110 transition-transform duration-500" strokeWidth={2.5} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white animate-pulse" />
                </button>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-75 hover:scale-100"
                  title="Hide Assistant"
                >
                  <X size={12} strokeWidth={3} />
                </button>
                </div>
            )}

            {/* Chat Widget Glass Concept */}
            {isOpen && (
                <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-[calc(100vw-32px)] sm:w-[400px] h-full max-h-[calc(100vh-32px)] sm:max-h-[700px] bg-white rounded-[2rem] sm:rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col z-[100] border border-slate-100 overflow-hidden reveal">
                    {/* Elegant Header */}
                    <div className="bg-slate-900 px-8 py-8 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent opacity-50" />
                        <div className="relative flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-xs uppercase tracking-widest">Local Assistant</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">AI Core Active</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex items-center gap-2">
                            <button
                                onClick={resetChat}
                                className="p-3 text-white/40 hover:text-white transition-all hover:bg-white/10 rounded-xl"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-3 text-white/40 hover:text-white transition-all hover:bg-white/10 rounded-xl"
                            >
                                <X className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Experience */}
                    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 bg-slate-50/30 scrollbar-hide">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} reveal`}
                            >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary' : 'bg-slate-900'
                                    }`}>
                                    {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
                                </div>
                                <div
                                    className={`max-w-[80%] px-6 py-4 rounded-[2rem] text-sm font-bold tracking-tight leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-white text-slate-900 rounded-tr-sm shadow-xl shadow-slate-200/50 border border-slate-50'
                                        : 'bg-slate-900 text-white rounded-tl-sm shadow-2xl shadow-slate-900/10'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="bg-white px-6 py-4 rounded-[2rem] rounded-tl-sm shadow-xl shadow-slate-200/50 border border-slate-50">
                                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                </div>
                            </div>
                        )}

                        {/* Smart Matches Layout */}
                        {results && (
                            <div className="space-y-4 pt-4 reveal">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-px flex-1 bg-slate-100" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Handpicked Results</p>
                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>

                                <div className="space-y-4">
                                    {results.length > 0 ? results.map((vendor: any) => (
                                        <div
                                            key={vendor.id}
                                            onClick={() => router.push(`/vendor/${vendor.id}`)}
                                            className="group bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all cursor-pointer relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">{vendor.name}</h4>
                                                <span className="text-[10px] bg-slate-50 text-slate-900 px-3 py-1 rounded-full font-black border border-slate-100">
                                                    {vendor.rating || '4.5'} RATING
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{vendor.category || 'Professional'}</p>

                                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><ChevronRight size={10} className="text-primary" /> {vendor.distance || 'Close'}</span>
                                                <span className="flex items-center gap-1.5"><ChevronRight size={10} className="text-primary" /> {vendor.price || 'Verified Rate'}</span>
                                            </div>

                                            {vendor.isTopMatch && (
                                                <div className="absolute top-0 right-0">
                                                    <div className="bg-primary text-white text-[8px] font-black px-4 py-1.5 rounded-bl-[1.5rem] uppercase tracking-widest">
                                                        BEST MATCH
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="p-10 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Refining search parameters...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Interaction Area */}
                    <div className="p-8 border-t border-slate-50 bg-white">
                        {/* Contextual Options */}
                        {options.length > 0 && !isLoading && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleUserResponse(opt.label, opt.value)}
                                        className="px-2.5 py-1 text-[10px] font-bold rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-white hover:border-transparent transition-all active:scale-95 leading-none"
                                        style={{ ['--tw-bg-opacity' as any]: 1 }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = '')}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Premium Input */}
                        {!results ? (
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && inputValue.trim() && handleUserResponse(inputValue)}
                                    placeholder="Ask anything..."
                                    className="w-full pl-6 pr-20 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 shadow-inner transition-all text-sm font-bold text-slate-900 placeholder-slate-400"
                                />
                                <button
                                    onClick={() => inputValue.trim() && handleUserResponse(inputValue)}
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 top-2 bottom-2 px-6 text-white rounded-[1.5rem] flex items-center justify-center transition-all disabled:opacity-20 disabled:grayscale shadow-xl active:scale-95 bg-gradient-primary"
                                >
                                    <Send size={16} strokeWidth={3} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={resetChat}
                                className="w-full py-5 bg-gradient-primary text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:opacity-90 shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <RotateCcw size={14} strokeWidth={3} />
                                Start New Experience
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

