import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { WealthBucket } from '../types';
import { Wallet, TrendingUp, ShieldAlert, Coffee, ArrowRight } from 'lucide-react';

const BUCKETS: { id: WealthBucket; label: string; icon: any; color: string }[] = [
  { id: 'daily', label: '日常开销', icon: Coffee, color: 'bg-blue-100 text-blue-600' },
  { id: 'emergency', label: '备用金', icon: ShieldAlert, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'investment', label: '增值金', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
  { id: 'growth', label: '成长金', icon: Wallet, color: 'bg-green-100 text-green-600' },
];

export const DailyLedger: React.FC = () => {
  const { addLedgerEntry } = useStore();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [bucket, setBucket] = useState<WealthBucket>('daily');
  const [note, setNote] = useState('');
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

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

  const saveEntry = () => {
    addLedgerEntry({
      type,
      amount: Number(amount),
      bucket,
      category: '一般', // Simplified
      note,
      date: new Date().toISOString(),
    });
    // Reset
    setAmount('');
    setNote('');
    setShowAIAnalysis(false);
    alert('记账成功！');
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">每日记账</h1>
      
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

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {type === 'expense' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">四宫格分类</label>
            <div className="grid grid-cols-2 gap-3">
              {BUCKETS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBucket(b.id)}
                  className={`p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                    bucket === b.id ? 'border-primary bg-primary/5' : 'border-gray-100'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${b.color}`}>
                    <b.icon size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-primary focus:outline-none"
            placeholder="这笔钱花在哪里了？"
          />
        </div>

        <button type="submit" className="w-full btn btn-primary py-4 text-lg shadow-lg shadow-primary/20">
          记一笔
        </button>
      </form>
    </div>
  );
};
