import React from 'react';
import { useStore } from '../store/useStore';
import { PieChart, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, ledger } = useStore();
  
  const totalIncome = ledger
    .filter(l => l.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalExpense = ledger
    .filter(l => l.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Mock data for wealth grid visualization
  // In real app, this would be calculated from ledger + initial assets
  const buckets = [
    { label: '备用金', percent: user?.wealthGrid.emergency || 20, color: 'bg-yellow-400' },
    { label: '日常', percent: user?.wealthGrid.daily || 15, color: 'bg-blue-400' },
    { label: '增值', percent: user?.wealthGrid.investment || 50, color: 'bg-purple-400' },
    { label: '成长', percent: user?.wealthGrid.growth || 15, color: 'bg-green-400' },
  ];

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-500 text-sm">Hi, {user?.name}</p>
          <h1 className="text-2xl font-bold">财务健康仪表盘</h1>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
          👤
        </div>
      </div>

      {/* Asset Summary */}
      <div className="bg-black text-white rounded-2xl p-6 mb-6 shadow-xl shadow-gray-200">
        <p className="text-gray-400 text-sm mb-1">净资产 (估算)</p>
        <h2 className="text-3xl font-bold mb-6">¥ 12,580.00</h2>
        <div className="flex gap-8">
          <div>
            <div className="flex items-center gap-1 text-green-400 text-xs mb-1">
              <ArrowUpRight size={14} /> 收入
            </div>
            <p className="font-semibold">¥ {totalIncome.toFixed(2)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-red-400 text-xs mb-1">
              <ArrowDownRight size={14} /> 支出
            </div>
            <p className="font-semibold">¥ {totalExpense.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Wealth Grid Target vs Actual */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <PieChart size={18} className="text-primary" /> 
            财富四宫格目标
          </h3>
          <span className="text-xs text-gray-400">基于你的画像</span>
        </div>
        
        <div className="flex h-4 rounded-full overflow-hidden mb-4">
          {buckets.map(b => (
            <div 
              key={b.label}
              style={{ width: `${b.percent}%` }}
              className={`${b.color}`}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {buckets.map(b => (
            <div key={b.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${b.color}`} />
              <div className="flex-1 flex justify-between text-sm">
                <span className="text-gray-600">{b.label}</span>
                <span className="font-bold">{b.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
          <TrendingUp size={18} /> 本周洞察
        </h3>
        <p className="text-sm text-indigo-700 leading-relaxed mb-3">
          本周你的「日常开销」控制得很好，比上周下降了 10%。
          建议将节省下来的 200 元转入「增值金」账户。
        </p>
        <button className="text-xs font-bold text-indigo-600 bg-white px-3 py-2 rounded-lg border border-indigo-200 shadow-sm">
          去转账
        </button>
      </div>
    </div>
  );
};
