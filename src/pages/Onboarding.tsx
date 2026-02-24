import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sprout } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-50 to-emerald-100 text-center">
      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-8 shadow-lg">
        <Sprout size={48} className="text-white" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-4">财芽 Caiya</h1>
      <p className="text-lg text-gray-600 mb-8">
        陪你从0学理财<br/>让每一分钱都教你会花钱
      </p>
      
      <div className="space-y-4 w-full">
        <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm">
          <h3 className="font-semibold text-gray-800">🎯 画像构建</h3>
          <p className="text-sm text-gray-500">10分钟精准定位你的财务坐标</p>
        </div>
        <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm">
          <h3 className="font-semibold text-gray-800">💬 AI 陪伴</h3>
          <p className="text-sm text-gray-500">每一次消费都是一次经济学思考</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/auth')}
        className="mt-12 w-full btn btn-primary py-4 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
      >
        开启财富之旅 <ArrowRight size={20} />
      </button>
    </div>
  );
};
