import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Settings, Key } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const AIChat: React.FC = () => {
  const { user } = useStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `你好 ${user?.name}！我是你的专属财商顾问。我可以帮你分析消费习惯、规划理财目标，或者解答关于“四宫格”法则的疑问。\n\n今天有什么可以帮你的吗？`,
      timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_key') || 'sk-e9b3e3516466412daf53ec50c362eaba');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If user hasn't set a key but we have a default one from code, save it
    if (!localStorage.getItem('openai_key')) {
        localStorage.setItem('openai_key', 'sk-e9b3e3516466412daf53ec50c362eaba');
    }
    
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const saveApiKey = () => {
      localStorage.setItem('openai_key', apiKey);
      setShowSettings(false);
      alert('API Key 已保存！');
  };

  const callOpenAI = async (userMessage: string) => {
      try {
          const res = await fetch('https://api.deepseek.com/chat/completions', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`
              },
              body: JSON.stringify({
                  model: 'deepseek-chat',
                  messages: [
                      { role: 'system', content: '你是一位贴心且专业的“私人金融管家”，拥有深厚的经济学背景。你的职责是帮助主人（用户）管理每一分钱。请从经济学角度深度分析用户的消费行为，引用相关原理（如边际效用、机会成本、沉没成本、复利效应等），并提供具体的资产配置建议。回答风格要诚恳、细致、专业，像一位老管家一样为主人着想。' },
                      ...messages.map(m => ({ role: m.role, content: m.content })),
                      { role: 'user', content: userMessage }
                  ],
                  stream: false
              })
          });

          const data = await res.json();
          if (data.error) throw new Error(data.error.message);
          return data.choices[0].message.content;
      } catch (err: any) {
          console.error('DeepSeek API Error:', err);
          return `调用 AI 失败: ${err.message}。\n\n请检查右上角设置中的 API Key 是否正确。`;
      }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    if (apiKey) {
        // Use Real API
        const response = await callOpenAI(userMsg.content);
        const aiMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: response,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    } else {
        // Mock AI response
        setTimeout(() => {
          const aiMsg: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: generateMockResponse(userMsg.content),
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, aiMsg]);
          setIsTyping(false);
        }, 1500);
    }
  };

  const generateMockResponse = (query: string): string => {
    if (query.includes('四宫格')) {
      return '“财富四宫格”是将你的资产分为四份：\n1. **备用金**：应对突发状况（如失业、生病）。\n2. **日常开销**：衣食住行。\n3. **增值金**：低风险投资，跑赢通胀。\n4. **成长金**：投资自己，学习新技能。\n\n你需要我帮你调整比例吗？';
    }
    if (query.includes('理财') || query.includes('投资')) {
      return '理财的第一步是记账。我看你最近记录了几笔支出，这是个好习惯！建议你先从积累“备用金”开始，存够 3-6 个月的生活费后再考虑高风险投资。';
    }
    return '这是一个很好的问题！作为一个 AI 财商顾问，我建议我们先从分析你的“日常开销”占比开始。通常建议将日常开销控制在收入的 60% 以内。\n\n（提示：在右上角设置中配置 OpenAI Key 可开启真实 AI 对话）';
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 pb-20 relative">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Bot size={24} />
            </div>
            <div>
            <h1 className="font-bold text-gray-900">AI 财商顾问</h1>
            <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${apiKey ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-xs text-gray-500">{apiKey ? '在线 (Real)' : '演示模式'}</span>
            </div>
            </div>
        </div>
        <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
        >
            <Settings size={20} />
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
          <div className="absolute top-20 right-4 left-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 z-20 animate-in fade-in slide-in-from-top-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Key size={18} /> 配置 OpenAI API
              </h3>
              <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full p-3 border border-gray-200 rounded-lg mb-3 text-sm font-mono"
              />
              <div className="flex gap-2">
                  <button onClick={() => setShowSettings(false)} className="flex-1 btn btn-outline py-2 text-sm">取消</button>
                  <button onClick={saveApiKey} className="flex-1 btn btn-primary py-2 text-sm">保存</button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Key 仅保存在本地浏览器中，不会上传服务器。</p>
          </div>
      )}

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-gray-200' : 'bg-primary/10 text-primary'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/20' 
                : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-100 fixed bottom-[72px] left-0 right-0 md:relative md:bottom-0">
        <form onSubmit={handleSend} className="flex gap-2 relative max-w-md mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="问我任何关于理财的问题..."
            className="flex-1 p-3 pl-4 pr-12 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};
