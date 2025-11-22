import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  onSendMessage: (msg: string) => void;
  isProcessing: boolean;
  messages: ChatMessage[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage, isProcessing, messages }) => {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] flex flex-col gap-2 transition-all duration-500 ease-out z-30 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
      
      {/* Chat History Bubble */}
      {messages.length > 0 && (
          <div className="bg-jirai-panel/90 backdrop-blur-lg border border-jirai-border rounded-2xl p-4 max-h-[300px] overflow-y-auto shadow-2xl mb-2 custom-scrollbar">
             {messages.map(m => (
                 <div key={m.id} className={`mb-3 last:mb-0 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                         m.role === 'user' 
                         ? 'bg-jirai-accent/20 text-white border border-jirai-accent/30' 
                         : 'bg-gray-800/50 text-gray-200 border border-gray-700'
                     }`}>
                         {m.text}
                     </div>
                 </div>
             ))}
             <div ref={endRef} />
          </div>
      )}

      {/* Input Bar */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-jirai-accent to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
        <form onSubmit={handleSubmit} className="relative bg-jirai-panel border border-jirai-border rounded-2xl flex items-center p-1.5 shadow-2xl">
          <div className="p-3 text-jirai-accent">
            <Sparkles size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Jirai to analyze or plan a workflow..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none font-mono text-sm px-2"
          />
          <div className="flex items-center gap-1">
            <button type="button" className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
                <Mic size={18} />
            </button>
            <button 
                type="submit" 
                disabled={isProcessing || !input.trim()}
                className={`p-2 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium text-xs ${
                    input.trim() ? 'bg-jirai-accent text-white shadow-lg shadow-red-900/20' : 'bg-gray-800 text-gray-500'
                }`}
            >
                {isProcessing ? (
                    <span className="animate-pulse">Thinking...</span>
                ) : (
                    <>
                        <span>Run</span>
                        <Send size={14} />
                    </>
                )}
            </button>
          </div>
        </form>
      </div>

      <div className="text-center">
          <p className="text-[10px] text-gray-600 font-mono">Jirai AI v1.0 • Press Enter to generate Mind Map</p>
      </div>
    </div>
  );
};