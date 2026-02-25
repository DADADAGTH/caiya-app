import React, { useState, useEffect } from 'react';
import { DAILY_KNOWLEDGE } from '../data/mockData';
import { Lightbulb, Tag, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const Knowledge: React.FC = () => {
  const { aiKnowledgeCards, readCardIds, markCardAsRead } = useStore();

  const handleRead = (id: string) => {
    markCardAsRead(id);
  };

  const totalCards = DAILY_KNOWLEDGE.length + aiKnowledgeCards.length;
  const learnedCards = readCardIds.length + aiKnowledgeCards.length; // AI cards are usually considered "read" once generated or viewed, but let's track them too if needed. Actually, ai cards are just added. Let's assume ai cards don't need "mark as read" button or are auto-read.
  // Wait, for simplicity, let's just use readCardIds length for progress if we track everything.
  // But static cards are in DAILY_KNOWLEDGE.
  // Let's refine learnedCards count.
  const learnedCount = readCardIds.length;

  return (
    <div className="p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">每日财商课</h1>
        <p className="text-gray-500">每天 1 分钟，重塑金钱观。已学习 {learnedCount}/{totalCards} 课。</p>
        <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${Math.min((learnedCount / totalCards) * 100, 100)}%` }}
            />
        </div>
      </header>

      <div className="grid gap-6">
        {/* AI Generated Cards Section */}
        {aiKnowledgeCards.length > 0 && (
            <div className="mb-4">
                <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">AI 专属建议</h2>
                <div className="space-y-4">
                    {aiKnowledgeCards.map((card, idx) => (
                        <motion.div 
                          key={card.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-indigo-100 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500">
                                <Sparkles size={80} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded flex items-center gap-1">
                                        <Sparkles size={10} /> AI 分析
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {card.date ? format(new Date(card.date), 'MM月dd日', { locale: zhCN }) : '刚刚'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{card.content}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        )}

        {/* Static Daily Cards */}
        <h2 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">每日必修</h2>
        {DAILY_KNOWLEDGE.map((card, idx) => {
          const isRead = readCardIds.includes(card.id);
          
          return (
            <motion.div 
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-2xl p-6 shadow-sm border relative overflow-hidden transition-all ${
                  isRead ? 'bg-gray-50 border-gray-100 opacity-80' : 'bg-white border-gray-100 hover:shadow-md'
              }`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Lightbulb size={120} />
              </div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${isRead ? 'bg-gray-200 text-gray-500' : 'bg-yellow-100 text-yellow-700'}`}>
                        DAY {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-400">{card.concept}</span>
                </div>
                {isRead && <CheckCircle2 className="text-green-500" size={24} />}
              </div>

              <h3 className={`text-xl font-bold mb-3 relative z-10 ${isRead ? 'text-gray-500' : 'text-gray-800'}`}>
                  {card.title}
              </h3>
              
              <p className={`leading-relaxed mb-6 relative z-10 ${isRead ? 'text-gray-400' : 'text-gray-600'}`}>
                {card.content}
              </p>

              {card.action && !isRead && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-4 relative z-10">
                  <p className="text-sm font-bold text-green-800 mb-1">💡 行动建议</p>
                  <p className="text-sm text-green-700">{card.action}</p>
                </div>
              )}

              <div className="flex justify-between items-center mt-4 relative z-10">
                <div className="flex gap-2">
                    {card.tags.map(tag => (
                        <span key={tag} className="flex items-center text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        <Tag size={10} className="mr-1" /> {tag}
                        </span>
                    ))}
                </div>
                
                {!isRead && (
                    <button 
                        onClick={() => handleRead(card.id)}
                        className="btn btn-sm btn-outline text-primary border-primary hover:bg-primary hover:text-white"
                    >
                        标记已读
                    </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
