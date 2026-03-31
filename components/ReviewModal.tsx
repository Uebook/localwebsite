'use client';

import { useState } from 'react';
import { X, Star, Send, ShieldCheck, Loader2 } from 'lucide-react';

interface ReviewModalProps {
       isOpen: boolean;
       onClose: () => void;
       vendorId: string;
       vendorName: string;
       onSuccess?: () => void;
}

export default function ReviewModal({
       isOpen,
       onClose,
       vendorId,
       vendorName,
       onSuccess
}: ReviewModalProps) {
       const [rating, setRating] = useState(0);
       const [hover, setHover] = useState(0);
       const [comment, setComment] = useState('');
       const [loading, setLoading] = useState(false);
       const [error, setError] = useState<string | null>(null);

       if (!isOpen) return null;

       const handleSubmit = async () => {
              if (rating === 0) {
                     setError('Please select a star rating.');
                     return;
              }

              const userData = localStorage.getItem('localmarket_user');
              if (!userData) {
                     setError('Please login to leave a review.');
                     return;
              }

              const user = JSON.parse(userData);

              setLoading(true);
              setError(null);

              try {
                     const res = await fetch('/api/reviews', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                   vendor_id: vendorId,
                                   user_id: user.id || user.uid,
                                   user_name: user.name || 'Anonymous',
                                   rating,
                                   comment
                            }),
                     });

                     const data = await res.json();
                     if (!res.ok) throw new Error(data.error || 'Failed to submit review');

                     onSuccess?.();
                     onClose();
              } catch (err: any) {
                     setError(err.message);
              } finally {
                     setLoading(false);
              }
       };

       return (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                     {/* Backdrop */}
                     <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                            onClick={onClose}
                     />

                     {/* Modal Content */}
                     <div className="relative z-10 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                            <div className="px-8 py-8">
                                   <div className="flex items-center justify-between mb-8">
                                          <div>
                                                 <h2 className="text-2xl font-black text-slate-900 leading-tight">Rate Your Experience</h2>
                                                 <p className="text-slate-500 font-bold text-sm mt-1">at {vendorName}</p>
                                          </div>
                                          <button
                                                 onClick={onClose}
                                                 className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all active:scale-95"
                                          >
                                                 <X size={20} />
                                          </button>
                                   </div>

                                   {error && (
                                          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                                                 <p className="text-red-600 text-xs font-bold text-center">{error}</p>
                                          </div>
                                   )}

                                   {/* Star Rating */}
                                   <div className="flex flex-col items-center mb-8">
                                          <div className="flex items-center gap-2">
                                                 {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                               key={star}
                                                               onMouseEnter={() => setHover(star)}
                                                               onMouseLeave={() => setHover(0)}
                                                               onClick={() => setRating(star)}
                                                               className="p-1.5 focus:outline-none transition-transform active:scale-90"
                                                        >
                                                               <Star
                                                                      size={40}
                                                                      className={`${(hover || rating) >= star
                                                                                    ? 'fill-orange-400 text-orange-400'
                                                                                    : 'text-slate-200'
                                                                             } transition-colors duration-200`}
                                                               />
                                                        </button>
                                                 ))}
                                          </div>
                                          <p className="mt-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                                                 {rating === 1 ? 'Terrible' :
                                                        rating === 2 ? 'Poor' :
                                                               rating === 3 ? 'Average' :
                                                                      rating === 4 ? 'Great' :
                                                                             rating === 5 ? 'Excellent' : 'Select Rating'}
                                          </p>
                                   </div>

                                   {/* Comment */}
                                   <div className="space-y-2 mb-8">
                                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Write your review</label>
                                          <textarea
                                                 value={comment}
                                                 onChange={(e) => setComment(e.target.value)}
                                                 placeholder="Tell others about your experience, the prices, and the quality..."
                                                 className="w-full h-32 px-5 py-4 bg-slate-50 border border-transparent focus:border-orange-200 focus:bg-white rounded-2xl outline-none resize-none text-slate-700 font-medium transition-all placeholder:text-slate-300"
                                          />
                                   </div>

                                   {/* Guidelines */}
                                   <div className="flex items-center gap-3 px-5 py-4 bg-blue-50/50 rounded-2xl mb-8">
                                          <ShieldCheck className="text-blue-500 flex-shrink-0" size={20} />
                                          <p className="text-[10px] text-blue-800 font-bold leading-relaxed">
                                                 Your review is public and will help other shoppers make better decisions. Please be honest and avoid using offensive language.
                                          </p>
                                   </div>

                                   {/* Submit Button */}
                                   <button
                                          onClick={handleSubmit}
                                          disabled={loading}
                                          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-orange-500 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                   >
                                          {loading ? (
                                                 <Loader2 className="animate-spin" size={20} />
                                          ) : (
                                                 <Send size={18} />
                                          )}
                                          {loading ? 'Submitting...' : 'Post Review'}
                                   </button>
                            </div>
                     </div>
              </div>
       );
}
