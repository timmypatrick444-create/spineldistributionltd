import React from 'react';

export interface QuadItem {
  title: string;
  subCategory: string;
  image: string;
}

interface QuadCardProps {
  title: string;
  items: QuadItem[];
  category: string;
  onExplore: (category: string, subCategory?: string) => void;
}

export const QuadCard: React.FC<QuadCardProps> = ({ title, items, category, onExplore }) => {
  return (
    <div className="bg-white p-5 rounded-xs shadow-xs border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-bold text-lg text-gray-900 leading-tight mb-3">{title}</h3>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onExplore(category, item.subCategory)}
              className="cursor-pointer group flex flex-col"
            >
              <div className="w-full h-24 sm:h-28 bg-gray-100 rounded-xs overflow-hidden flex items-center justify-center p-1 border border-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <span className="text-[11px] text-gray-700 font-medium mt-1 leading-snug line-clamp-2 group-hover:text-[#c45500]">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onExplore(category)}
        className="mt-4 text-xs font-semibold text-[#007185] hover:text-[#c45500] hover:underline text-left block"
      >
        See more in {category}
      </button>
    </div>
  );
};
