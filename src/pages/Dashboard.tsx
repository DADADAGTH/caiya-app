import React from 'react';
import { useStore } from '../store/useStore';
import { PieChart, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, ledger } = useStore();
  
  // Calculate total income and expense
  const totalIncome = ledger
    .filter(l => l.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
    
  const totalExpense = ledger
    .filter(l => l.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const netAssets = totalIncome - totalExpense;

  // Calculate actual assets in each bucket
  const bucketAssets = {
      emergency: ledger.filter(l => l.bucket === 'emergency').reduce((acc, l) => acc + Number(l.type === 'income' ? l.amount : -l.amount), 0),
      daily: ledger.filter(l => l.bucket === 'daily').reduce((acc, l) => acc + Number(l.type === 'income' ? l.amount : -l.amount), 0),
      investment: ledger.filter(l => l.bucket === 'investment').reduce((acc, l) => acc + Number(l.type === 'income' ? l.amount : -l.amount), 0),
      growth: ledger.filter(l => l.bucket === 'growth').reduce((acc, l) => acc + Number(l.type === 'income' ? l.amount : -l.amount), 0),
  };

  // Safe default for user wealthGrid
  const wealthGrid = user?.wealthGrid || { emergency: 20, daily: 15, investment: 50, growth: 15 };

  const buckets = [
    { 
        label: '备用金', 
        targetPercent: wealthGrid.emergency, 
        actualAmount: Math.max(0, bucketAssets.emergency),
        targetAmount: (netAssets * wealthGrid.emergency) / 100, // Theoretical target based on current net assets
        color: 'bg-yellow-400',
        textColor: 'text-yellow-600'
    },
    { 
        label: '日常', 
        targetPercent: wealthGrid.daily, 
        actualAmount: Math.max(0, bucketAssets.daily),
        targetAmount: (netAssets * wealthGrid.daily) / 100,
        color: 'bg-blue-400',
        textColor: 'text-blue-600'
    },
    { 
        label: '增值', 
        targetPercent: wealthGrid.investment, 
        actualAmount: Math.max(0, bucketAssets.investment),
        targetAmount: (netAssets * wealthGrid.investment) / 100,
        color: 'bg-purple-400',
        textColor: 'text-purple-600'
    },
    { 
        label: '成长', 
        targetPercent: wealthGrid.growth, 
        actualAmount: Math.max(0, bucketAssets.growth),
        targetAmount: (netAssets * wealthGrid.growth) / 100,
        color: 'bg-green-400',
        textColor: 'text-green-600'
    },
  ];

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-500 text-sm">Hi, {user?.name}</p>
          <h1 className="text-2xl font-bold">财务健康仪表盘</h1>
        </div>
        <Link to="/profile" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl overflow-hidden border border-gray-200">
           {user?.name?.[0] || <Wallet className="text-gray-600" size={20} />}
        </Link>
      </div>

      {/* Asset Summary */}
      <div className="bg-black text-white rounded-2xl p-6 mb-6 shadow-xl shadow-gray-200 relative overflow-hidden">
        <div className="relative z-10">
            <p className="text-gray-400 text-sm mb-1">净资产 (基于记账)</p>
            <h2 className="text-3xl font-bold mb-6">¥ {netAssets.toFixed(2)}</h2>
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
        
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-800 to-black rounded-full blur-2xl opacity-50 -mr-10 -mt-10 pointer-events-none" />
      </div>

      {/* Empty State / Call to Action */}
      {ledger.length === 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                  <h3 className="font-bold text-blue-900 mb-1">还没有数据？</h3>
                  <p className="text-xs text-blue-700">记一笔收入，激活你的财富四宫格</p>
              </div>
              <Link to="/ledger" className="btn btn-sm btn-primary shadow-lg shadow-blue-200">
                  <Plus size={16} className="mr-1" /> 记一笔
              </Link>
          </div>
      )}

      {/* Wealth Grid Target vs Actual */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <PieChart size={18} className="text-primary" /> 
            四宫格动态
          </h3>
          <span className="text-xs text-gray-400">实际 vs 目标</span>
        </div>
        
        {/* Progress Bar Stack */}
        <div className="flex h-4 rounded-full overflow-hidden mb-6 bg-gray-100">
          {buckets.map(b => (
            <div 
              key={b.label}
              style={{ width: `${(b.actualAmount / Math.max(1, netAssets)) * 100}%` }}
              className={`${b.color} transition-all duration-500`}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {buckets.map(b => {
              const currentPercent = netAssets > 0 ? (b.actualAmount / netAssets) * 100 : 0;
              const diff = currentPercent - b.targetPercent;
              const isGood = Math.abs(diff) < 5;
              
              return (
                <div key={b.label} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${b.color}`} />
                      <span className="text-xs font-bold text-gray-700">{b.label}</span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                      <span className="text-lg font-bold text-gray-800">¥{b.actualAmount.toFixed(0)}</span>
                      <div className="text-right">
                          <div className={`text-xs font-bold ${diff > 5 ? 'text-red-500' : diff < -5 ? 'text-blue-500' : 'text-green-500'}`}>
                              {currentPercent.toFixed(1)}%
                          </div>
                          <div className="text-[10px] text-gray-400">目标 {b.targetPercent}%</div>
                      </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="mt-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                          className={`h-full ${b.color}`} 
                          style={{ width: `${Math.min((currentPercent / b.targetPercent) * 100, 100)}%` }}
                      />
                  </div>
                </div>
              );
          })}
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
