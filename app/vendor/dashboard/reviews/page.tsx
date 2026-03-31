'use client';

import { useState } from 'react';
import VendorDashboardLayout, { useVendor } from '@/components/VendorDashboardLayout';
import { Star, MessageSquare, TrendingUp, TrendingDown, Loader2, Send, X, Reply } from 'lucide-react';

function ReviewsContent() {
  const { reviews, profile, loading } = useVendor();
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredReviews = reviews.filter((r: any) => {
    const name = r.reviewer_name ?? r.customer_name ?? r.user_name ?? r.userName ?? '';
    const comment = r.comment ?? r.review ?? r.text ?? '';
    const ratingVal = r.rating ?? r.stars ?? 0;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || String(Math.round(ratingVal)) === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s: number, r: any) => s + (r.rating ?? 0), 0) / reviews.length).toFixed(1)
    : (profile?.rating ?? 0).toFixed(1);

  const countByStar = (star: number) => reviews.filter((r: any) => Math.round(r.rating ?? 0) === star).length;

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !selectedReview) return;
    setSaving(true);
    try {
      await fetch(`/api/vendor/reviews/${selectedReview.id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replyText.trim() }),
      });
    } catch { }
    setSaving(false);
    setSelectedReview(null);
    setReplyText('');
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin" size={24} style={{ color: 'var(--primary)' }} /></div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Reviews & Ratings</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage customer feedback</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
          <Star className="text-amber-400 fill-amber-400" size={20} />
          <span className="text-xl font-black text-slate-900">{avgRating}</span>
          <span className="text-slate-400 text-sm">({reviews.length})</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: '5 Star', count: countByStar(5), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: '4 Star', count: countByStar(4), icon: Star, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Replied', count: reviews.filter((r: any) => r.reply).length, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Pending', count: reviews.filter((r: any) => !r.reply).length, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${bg}`}>
              <Icon size={16} className={color} />
            </div>
            <p className="text-xl font-black text-slate-900">{count}</p>
            <p className="text-xs text-slate-400 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary"
          style={{ '--tw-ring-color': 'var(--primary)' } as any}
        />
        <select
          value={ratingFilter}
          onChange={e => setRatingFilter(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none bg-white"
        >
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={String(n)}>{n} Stars</option>)}
        </select>
      </div>

      {/* Review List */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-3">
          {filteredReviews.map((review: any) => {
            const name = review.reviewer_name ?? review.customer_name ?? review.user_name ?? review.userName ?? 'Customer';
            const comment = review.comment ?? review.review ?? review.text ?? '';
            const rating = review.rating ?? review.stars ?? 0;
            const date = review.created_at
              ? new Date(review.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
              : review.date ?? '';

            return (
              <div key={review.id} className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-900">{name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${rating >= 4 ? 'bg-green-50 text-green-700' : rating >= 3 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                        }`}>{Math.round(rating)}★</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={14} className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-slate-300 flex-shrink-0">{date}</span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-3">{comment}</p>

                {review.reply ? (
                  <div className="pl-3 border-l-2 bg-slate-50 rounded-r-xl p-3 text-sm" style={{ borderColor: 'var(--primary)' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: 'var(--primary)' }}>Your Reply</p>
                    <p className="text-slate-700">{review.reply}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => { setSelectedReview(review); setReplyText(''); }}
                    className="flex items-center gap-1.5 text-xs font-bold hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--primary)' }}
                  >
                    <Reply size={13} /> Reply to Review
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <Star className="text-slate-200 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-900 mb-1">{searchQuery || ratingFilter !== 'all' ? 'No Reviews Found' : 'No Reviews Yet'}</h3>
          <p className="text-slate-400 text-sm">Customer reviews will appear here</p>
        </div>
      )}

      {/* Reply Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Reply to Review</h2>
              <button onClick={() => setSelectedReview(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 leading-relaxed">
                {selectedReview.comment ?? selectedReview.review ?? selectedReview.text}
              </p>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none resize-none"
                rows={4}
                placeholder="Write your reply..."
              />
              <div className="flex gap-3">
                <button onClick={() => setSelectedReview(null)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim() || saving}
                  className="flex-1 py-3 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: 'var(--primary)' }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorReviewsPage() {
  return (
    <VendorDashboardLayout>
      <ReviewsContent />
    </VendorDashboardLayout>
  );
}
