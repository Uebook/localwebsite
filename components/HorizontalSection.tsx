'use client';

import Image from 'next/image';

interface HorizontalSectionProps {
  title: string;
  items: Array<{ id: string; name: string; imageUrl: string }>;
  onItemClick: (itemName: string) => void;
  isCircular?: boolean;
}

export default function HorizontalSection({ title, items, onItemClick, isCircular = false }: HorizontalSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-orange-500 rounded" />
        <h2 className="text-white text-xl font-bold">{title}</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.name)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className={`relative ${isCircular ? 'w-20 h-20 rounded-full' : 'w-24 h-24 rounded-xl'} overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform`}>
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-white text-sm font-medium">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

