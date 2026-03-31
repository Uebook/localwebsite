'use client';

import { Clock, X } from 'lucide-react';
import { RECENT_SEARCHES } from '@/lib/data';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecentSearches() {
  const [searches, setSearches] = useState(RECENT_SEARCHES);
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const removeSearch = (index: number) => {
    setSearches(prev => prev.filter((_, i) => i !== index));
  };

  if (searches.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-orange-500 rounded" />
          <h2 className="text-white text-xl font-bold">Recent Searches</h2>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20"
          >
            <button
              onClick={() => handleSearch(search)}
              className="flex items-center gap-2 text-white text-sm"
            >
              <Clock size={16} />
              <span>{search}</span>
            </button>
            <button
              onClick={() => removeSearch(index)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

