import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { WealthBucket, LedgerEntry } from '../types';
import { Wallet, TrendingUp, ShieldAlert, Coffee, Trash2, ArrowRight, X, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { DAILY_KNOWLEDGE } from '../data/mockData';

const BUCKETS: { id: WealthBucket; label: string; icon: any; color: string }[] = [
  { id: 'daily', label: '日常开销', icon: Coffee, color: 'bg-blue-100 text-blue-600' },
  { id: 'emergency', label: '备用金', icon: ShieldAlert, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'investment', label: '增值金', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
  { id: 'growth', label: '成长金', icon: Wallet, color: 'bg-green-100 text-green-600' },
];

export const DailyLedger: React.FC = () => {
  const { ledger, addLedgerEntry, fetchLedger, deleteLedgerEntry, addAiKnowledgeCard } = useStore();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [bucket, setBucket] = useState<WealthBucket>('daily');
  const [note, setNote] = useState('');
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showKnowledgePopup, setShowKnowledgePopup] = useState(false);
  const [dailyCard, setDailyCard] = useState(DAILY_KNOWLEDGE[0]);
  const [aiSuggestion, setAiSuggestion] = useState<{ title: string; content: string } | null>(null);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);

  useEffect(() => {
    fetchLedger();
    
    // Determine today's knowledge card based on date
    const todayIndex = new Date().getDate() % DAILY_KNOWLEDGE.length;
    setDailyCard(DAILY_KNOWLEDGE[todayIndex]);
  }, []);

  const generateAiSuggestion = async (entry: any) => {
    setIsGeneratingSuggestion(true);
    setAiSuggestion(null);
    setShowKnowledgePopup(true); // Show popup immediately with loading state

    try {
        const apiKey = localStorage.getItem('openai_key') || 'sk-e9b3e3516466412daf53ec50c362eaba';
        const res = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { 
                        role: 'system', 
                        content: '你是一位贴心且专业的“私人金融管家”。你的职责是帮助主人审视每一笔消费。请根据记账内容：\n1. 判断这笔消费是否合理（基于金额和类别）。\n2. 引用一个相关的经济学原理（如机会成本、沉没成本、边际效用、拿铁因子、心理账户等）来深度解读这种消费行为。\n3. 给出具体的改进建议或肯定，语气要诚恳、专业但易懂。\n\n字数控制在100-150字。输出必须是JSON格式：{"title": "一针见血的标题(6-10字)", "content": "详细分析内容"}' 
                    },
                    { 
                        role: 'user', 
                        content: `主人刚刚记了一笔账：${entry.type === 'expense' ? '支出' : '收入'} ${entry.amount}元，分类是${entry.bucket}，备注是“${entry.note}”。请分析。` 
                    }
                ],
                response_format: { type: 'json_object' }
            })
        });

        const data = await res.json();
        if (data.choices && data.choices[0].message.content) {
            const result = JSON.parse(data.choices[0].message.content);
            setAiSuggestion(result);
        } else {
            throw new Error('No content');
        }
    } catch (err) {
        console.error('AI Suggestion Error:', err);
        // Fallback to static card if AI fails
        setAiSuggestion({
            title: dailyCard.title,
            content: dailyCard.content
        });
    } finally {
        setIsGeneratingSuggestion(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount);
    if (!val) return;

    // Mock "Major Decision" check
    if (type === 'expense' && val > 500) {
      setShowAIAnalysis(true);
      return;
    }

    saveEntry();
  };

  const saveEntry = async () => {
    // Fire and forget to prevent blocking UI
    addLedgerEntry({
      type,
      amount: Number(amount),
      bucket: type === 'expense' ? bucket : 'daily', // Default bucket for income
      category: '一般', // Simplified
      note,
      date: new Date().toISOString(),
    }).catch(console.error);

    // Reset UI immediately
    setAmount('');
    setNote('');
    setShowAIAnalysis(false);
    
    // Trigger AI analysis instead of static card
    generateAiSuggestion({
        type,
        amount: Number(amount),
        bucket: type === 'expense' ? bucket : 'daily',
        note
    });
  };

  const handleClosePopup = () => {
      setShowKnowledgePopup(false);
      
      // If AI suggestion exists, save it as a knowledge card
      if (aiSuggestion) {
          addAiKnowledgeCard({
              id: crypto.randomUUID(),
              title: aiSuggestion.title,
              concept: '专属建议',
              content: aiSuggestion.content,
              tags: ['AI分析', type === 'expense' ? '支出' : '收入'],
              isAiGenerated: true,
              date: new Date().toISOString()
          });
      }

      // Auto-mark as read for daily card
      useStore.getState().markCardAsRead(dailyCard.id);
  };

  const handleDelete = async (id: string) => {
      if (confirm('确定要删除这条记录吗？')) {
          await deleteLedgerEntry(id);
      }
  };

  if (showAIAnalysis) {
    return (
      <div className="p-6 h-full flex flex-col">
        <h2 className="text-xl font-bold mb-4">🤔 AI 消费决策分析</h2>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
          <p className="text-orange-800 font-medium mb-2">这笔支出超过了 ¥500，让我们冷静一下：</p>
          <ul className="list-disc list-inside text-sm text-orange-700 space-y-2">
            <li>这笔消费是“计划内”的吗？</li>
            <li>如果等24小时再买，你还会想要吗？</li>
            <li>它的机会成本是什么？（比如这笔钱可以买10本书）</li>
          </ul>
        </div>
        <div className="flex gap-4 mt-auto">
          <button 
            onClick={() => setShowAIAnalysis(false)} 
            className="flex-1 btn btn-outline py-3"
          >
            我再想想
          </button>
          <button 
            onClick={saveEntry} 
            className="flex-1 btn btn-primary py-3"
          >
            确认支出
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 relative">
      <h1 className="text-2xl font-bold mb-6">每日记账</h1>
      
      {/* Knowledge Popup Modal */}
      {showKnowledgePopup && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-300">
                  <button 
                    onClick={handleClosePopup}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                      <X size={24} />
                  </button>
                  
                  <div className="flex justify-center mb-4 text-yellow-500">
                      <Lightbulb size={48} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-center mb-2">记账成功！🎉</h3>
                  <p className="text-center text-gray-500 text-sm mb-6">送你今天的财商锦囊</p>
                  
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 mb-6 min-h-[160px] flex flex-col justify-center relative">
                      {isGeneratingSuggestion ? (
                          <div className="flex flex-col items-center justify-center text-yellow-600 gap-2 h-full">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                              <span className="text-xs">管家正在分析您的账单...</span>
                          </div>
                      ) : (
                          <div className="animate-in fade-in duration-300">
                            <h4 className="font-bold text-yellow-800 mb-3 border-b border-yellow-200 pb-2">
                                {aiSuggestion?.title || dailyCard.title}
                            </h4>
                            <p className="text-sm text-yellow-800 leading-relaxed whitespace-pre-wrap">
                                {aiSuggestion?.content || dailyCard.content}
                            </p>
                          </div>
                      )}
                  </div>
                  
                  <button 
                    onClick={handleClosePopup}
                    className="w-full btn btn-primary py-3"
                  >
                    学到了，去看看其他
                  </button>
              </div>
          </div>
      )}

      {/* Type Toggle */}
      <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${type === 'expense' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          onClick={() => setType('expense')}
        >
          支出
        </button>
        <button
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${type === 'income' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
          onClick={() => setType('income')}
        >
          收入
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">金额</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">¥</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-4 text-2xl font-bold border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Bucket Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {type === 'expense' ? '分类' : '存入账户'}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {BUCKETS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBucket(b.id)}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                  bucket === b.id 
                    ? `${b.color} border-current ring-1 ring-current` 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <b.icon size={18} />
                <span className="text-sm font-medium">{b.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={type === 'expense' ? "花在哪了？（如：午餐、打车）" : "收入来源？（如：工资、奖金、理财收益）"}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none h-24 resize-none"
          />
        </div>

        <button type="submit" className="w-full btn btn-primary py-4 text-lg shadow-lg shadow-primary/20">
          记一笔
        </button>
      </form>

      {/* Recent Transactions List */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-800">最近记录</h2>
        <div className="space-y-3">
            {ledger.length === 0 ? (
                <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    还没有记账记录哦
                </div>
            ) : (
                ledger.map(entry => {
                    const bucketInfo = BUCKETS.find(b => b.id === entry.bucket) || BUCKETS[0];
                    const isExpense = entry.type === 'expense';
                    
                    return (
                        <div key={entry.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isExpense ? bucketInfo.color : 'bg-green-100 text-green-600'}`}>
                                    {isExpense ? <bucketInfo.icon size={18} /> : <TrendingUp size={18} />}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{entry.note || (isExpense ? bucketInfo.label : '收入')}</div>
                                    <div className="text-xs text-gray-400">
                                        {format(new Date(entry.date), 'MM月dd日 HH:mm', { locale: zhCN })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${isExpense ? 'text-gray-900' : 'text-green-600'}`}>
                                    {isExpense ? '-' : '+'}¥{Number(entry.amount).toFixed(2)}
                                </span>
                                <button 
                                    onClick={() => handleDelete(entry.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>
    </div>
  );
};
