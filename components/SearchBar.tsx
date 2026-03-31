'use client';

import { Search, Mic, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
}

export default function SearchBar({ onSearch, initialValue = '', placeholder }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [pIndex, setPIndex] = useState(0);
  const placeholders = [
    "What is on your mind today?",
    "How you want to shell out?",
    "How you want to see your local market?",
    placeholder || "Search for services, products..."
  ];

  useState(() => {
    const interval = setInterval(() => {
      setPIndex(prev => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full group">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 group-focus-within:text-primary transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholders[pIndex]}
          className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 shadow-sm transition-all text-sm font-bold text-slate-900 placeholder-slate-400"
        />
        <div className="absolute right-3 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-50 rounded-xl"
          >
            <Mic size={20} />
          </button>
        </div>
      </div>
    </form>
  );
}

