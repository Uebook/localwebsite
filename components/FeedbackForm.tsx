'use client';

import { useState } from 'react';
import { MessageCircle, Star, Send, X } from 'lucide-react';

interface FeedbackFormProps {
  onBack?: () => void;
  userRole?: 'user' | 'vendor';
  onSubmit?: (data: any) => void;
}

export default function FeedbackForm({ onBack, userRole = 'user', onSubmit }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    category: '',
    rating: 0,
    comment: '',
    type: userRole
  });

  const categories = [
    'Product Quality',
    'Platform Features',
    'Delivery',
    'Pricing',
    'Customer Service',
    'User Experience',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    if (formData.rating === 0) {
      alert('Please provide a rating');
      return;
    }
    if (!formData.comment.trim()) {
      alert('Please provide your feedback');
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    } else {
      alert('Thank you for your feedback! We appreciate your input.');
      if (onBack) onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900 flex-1 text-center">Give Feedback</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Badge */}
          <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg w-fit">
            <MessageCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-600">
              {userRole === 'vendor' ? 'Vendor Feedback' : 'User Feedback'}
            </span>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFormData({ ...formData, category })}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    formData.category === category
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-2 hover:scale-110 transition"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {formData.rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={6}
              placeholder="Share your thoughts, suggestions, or concerns..."
            />
            <p className="text-right text-xs text-gray-500 mt-1">
              {formData.comment.length}/500
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.category || formData.rating === 0 || !formData.comment.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Submit Feedback</span>
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
