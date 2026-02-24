import React from 'react';
import { DAILY_KNOWLEDGE } from '../data/mockData';
import { Lightbulb, Tag } from 'lucide-react';

export const Knowledge: React.FC = () => {
  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold mb-2">每日便签</h1>
      <p className="text-gray-500 mb-6">每天1分钟，重塑金钱观</p>

      <div className="space-y-6">
        {DAILY_KNOWLEDGE.map((card, idx) => (
          <div key={card.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lightbulb size={100} />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">
                DAY {idx + 1}
              </span>
              <span className="text-sm font-medium text-gray-400">{card.concept}</span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">{card.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              {card.content}
            </p>

            {card.action && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-sm font-bold text-green-800 mb-1">💡 行动建议</p>
                <p className="text-sm text-green-700">{card.action}</p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {card.tags.map(tag => (
                <span key={tag} className="flex items-center text-xs text-gray-400">
                  <Tag size={12} className="mr-1" /> {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
