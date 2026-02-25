import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sprout } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-yellow-100 to-amber-50 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <div className="w-24 h-24 bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] rounded-full flex items-center justify-center mb-8 shadow-xl relative z-10 border-4 border-white shadow-amber-200">
        <Sprout size={48} className="text-[#15803D] drop-shadow-sm" />
      </div>
      
      <h1 className="text-4xl font-black text-black mb-2 tracking-tight">财芽 Caiya</h1>
      <p className="text-lg text-gray-600 mb-12 font-medium">
        陪你从0学理财<br/>让每一分钱都教你会花钱
      </p>
      
      <div className="space-y-4 w-full relative z-10">
        <div className="bg-white/80 p-5 rounded-2xl backdrop-blur-md shadow-sm border border-white/50 transform rotate-1 hover:rotate-0 transition-transform">
          <h3 className="font-bold text-black text-lg">🎯 画像构建</h3>
          <p className="text-sm text-gray-500">10分钟精准定位你的财务坐标</p>
        </div>
        <div className="bg-white/80 p-5 rounded-2xl backdrop-blur-md shadow-sm border border-white/50 transform -rotate-1 hover:rotate-0 transition-transform">
          <h3 className="font-bold text-black text-lg">💬 AI 陪伴</h3>
          <p className="text-sm text-gray-500">每一次消费都是一次经济学思考</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/auth')}
        className="mt-12 w-full btn btn-primary py-4 text-lg font-bold shadow-xl shadow-yellow-200 flex items-center justify-center gap-2 relative z-10 transform active:scale-95 transition-transform"
      >
        开启财富之旅 <ArrowRight size={20} />
      </button>
    </div>
  );
};
