import React from 'react';
import { Quote, Tag } from 'lucide-react';

export default function QuoteCard({ quote }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
      <div className="absolute top-6 left-6 opacity-10">
        <Quote size={48} className="text-indigo-600" />
      </div>

      <div className="relative z-10 pl-4 border-l-2 border-indigo-200 ml-4 mt-2">
        <p className="text-gray-800 text-lg font-serif italic leading-relaxed mb-6">
          "{quote.text}"
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 flex-wrap">
          <Tag size={14} className="text-gray-400" />
          {quote.tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
              {tag}
            </span>
          ))}
        </div>
        {quote.page && (
          <span className="text-xs font-semibold text-gray-400">
            p. {quote.page}
          </span>
        )}
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button className="text-gray-400 hover:text-indigo-600 text-sm font-medium">Edit</button>
      </div>
    </div>
  );
}
