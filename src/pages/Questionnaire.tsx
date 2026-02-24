import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../data/mockData';
import { useStore } from '../store/useStore';
import { ArrowLeft, ArrowRight, CheckCircle, Info } from 'lucide-react';

export const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const question = QUESTIONS[currentIdx];
  const isLast = currentIdx === QUESTIONS.length - 1;

  const handleSelect = (value: any) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
    // Auto advance for single choice
    if (question.type === 'single') {
      setTimeout(() => handleNext(value), 300);
    }
  };

  const handleNext = (currentValue?: any) => {
    const val = currentValue ?? answers[question.id];
    if (!val && val !== 0) return; // Validate

    if (isLast) {
      completeOnboarding({ ...answers, [question.id]: val }).then(() => {
        navigate('/dashboard');
      });
    } else {
      setCurrentIdx(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => currentIdx > 0 ? setCurrentIdx(p => p - 1) : navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-medium text-gray-500">
          Step {currentIdx + 1}/{QUESTIONS.length}
        </span>
        <div className="w-8" /> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-8">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md mb-2">
            {question.category === 'economic_base' ? '经济基本盘' : 
             question.category === 'financial_literacy' ? '金融素养' : '消费心理'}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {question.text}
          </h2>
        </div>

        {question.explanation && (
          <div className="mb-6 bg-blue-50 p-3 rounded-lg flex gap-3 text-blue-700 text-sm">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>{question.explanation}</p>
          </div>
        )}

        <div className="space-y-3">
          {question.type === 'single' && question.options?.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                answers[question.id] === opt.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-100 hover:border-gray-200 text-gray-700'
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              {answers[question.id] === opt.value && <CheckCircle size={20} />}
            </button>
          ))}

          {question.type === 'number' && (
            <div className="mt-4">
              <input
                type="number"
                placeholder="请输入金额"
                className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                value={answers[question.id] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: Number(e.target.value) }))}
              />
              <button
                onClick={() => handleNext()}
                className="mt-6 w-full btn btn-primary py-3"
              >
                下一步 <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
