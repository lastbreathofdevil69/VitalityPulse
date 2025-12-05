
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Bot, User, MessageSquare, ClipboardList, Volume2, StopCircle, RefreshCw } from 'lucide-react';
import { generateFitnessAdvice, chatWithAdvisor } from '../services/gemini';
import { LottiePlayer, ANIMATIONS } from './Animations';

const SimpleMarkdown = ({ text }: { text: string }) => {
  return (
    <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
      {text.split('\n').map((line, i) => {
        if (!line) return <div key={i} className="h-2" />;
        if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-4">{line.replace('###', '')}</h3>;
        if (line.startsWith('**')) return <p key={i} className="font-bold text-slate-900 dark:text-slate-100 mt-2">{line.replace(/\*\*/g, '')}</p>;
        if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-emerald-500 pl-1">{line.replace('- ', '')}</li>;
        return <p key={i}>{line.replace(/\*\*/g, '')}</p>;
      })}
    </div>
  );
};

export const AIAdvisor = ({ 
  profile, 
  bmiCategory 
}: { 
  profile: any; 
  bmiCategory: string; 
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'chat'>('plan');
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: `Hi ${profile.name}! I'm your AI fitness coach. How can I help you reach your goals today?` }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatLoading]);

  // TTS Logic
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, '')); // Clean markdown chars
      utterance.pitch = 1;
      utterance.rate = 1.0;
      utterance.volume = 1;
      
      // Try to select a better voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech not supported in this browser.");
    }
  };
  
  // Cleanup speech on unmount
  useEffect(() => {
      return () => {
          window.speechSynthesis.cancel();
      }
  }, []);

  const handleGeneratePlan = async () => {
    setLoading(true);
    const result = await generateFitnessAdvice(
      profile, 
      { value: 0, category: bmiCategory as any, color: '' }, 
      "Improve general fitness and energy levels"
    );
    setPlan(result);
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user' as const, text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    const responseText = await chatWithAdvisor(messages.concat(userMsg), chatInput);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setChatLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Navigation / Sidebar for Advisor */}
      <div className="w-full md:w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-4 shrink-0 h-fit md:h-full flex flex-row md:flex-col gap-2">
         <button 
            onClick={() => setActiveTab('plan')}
            className={`flex-1 md:flex-none p-3 rounded-xl flex items-center justify-center md:justify-start gap-3 transition-all ${activeTab === 'plan' ? 'bg-emerald-500 text-white shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
         >
            <ClipboardList size={20} />
            <span className="font-semibold">My Plan</span>
         </button>
         <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 md:flex-none p-3 rounded-xl flex items-center justify-center md:justify-start gap-3 transition-all ${activeTab === 'chat' ? 'bg-emerald-500 text-white shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
         >
            <MessageSquare size={20} />
            <span className="font-semibold">AI Chat</span>
         </button>

         <div className="hidden md:block mt-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white relative overflow-hidden">
             <div className="relative z-10">
                 <Bot size={24} className="mb-2" />
                 <p className="text-xs font-medium opacity-90">Powered by Gemini 2.5 Flash</p>
             </div>
             <Sparkles className="absolute -bottom-4 -right-4 text-white opacity-20" size={60} />
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col relative">
        
        {/* Tab: Fitness Plan */}
        {activeTab === 'plan' && (
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {!plan ? (
                    <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                        <LottiePlayer src={ANIMATIONS.FITNESS} className="w-48 h-48 mb-6" />
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Personalized Fitness Plan</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Generate a workout and nutrition routine tailored specifically to your goal of <span className="text-emerald-600 dark:text-emerald-400 font-bold capitalize">{profile.goal.replace('_', ' ')}</span> and activity level.</p>
                        <button 
                            onClick={handleGeneratePlan}
                            disabled={loading}
                            className="bg-slate-900 dark:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                            {loading ? 'Analyzing Profile...' : 'Generate My Plan'}
                        </button>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="text-emerald-500" /> Your Custom Plan
                            </h2>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => speakText(plan)}
                                    className={`p-2 rounded-lg transition-colors ${isSpeaking ? 'bg-red-100 text-red-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                    title="Read Aloud"
                                >
                                    {isSpeaking ? <StopCircle size={20} /> : <Volume2 size={20} />}
                                </button>
                                <button 
                                    onClick={handleGeneratePlan}
                                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    title="Regenerate"
                                >
                                    <RefreshCw size={20} />
                                </button>
                            </div>
                        </div>
                        <SimpleMarkdown text={plan} />
                    </div>
                )}
            </div>
        )}

        {/* Tab: AI Chat */}
        {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400'}`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-slate-900 dark:bg-slate-800 text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-slate-800'
                                }`}>
                                    {msg.role === 'model' ? <SimpleMarkdown text={msg.text} /> : msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {chatLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <LottiePlayer src={ANIMATIONS.ROBOT} className="w-12 h-8" />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask about workouts, nutrition, or motivation..."
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                            disabled={chatLoading}
                        />
                        <button 
                            type="submit"
                            disabled={!chatInput.trim() || chatLoading}
                            className="absolute right-2 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
