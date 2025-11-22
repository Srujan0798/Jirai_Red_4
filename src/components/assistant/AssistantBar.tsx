
import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useStore } from '../../store';
import { generateAnalysisFromPrompt } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { Z_INDEX } from '../../constants';

export function AssistantBar() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { nodes, viewMode, addNodes, addEdges } = useStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Contextualize prompt based on view mode
      const contextualPrompt = `[Context: ${viewMode} mode] ${input}`;
      const { nodes: newNodes, edges: newEdges } = await generateAnalysisFromPrompt(contextualPrompt, nodes, viewMode);
      
      // Use bulk actions to improve performance and consolidated undo history
      addNodes(newNodes);
      addEdges(newEdges);
      
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsProcessing(false);
      setInput('');
    }
  };
  
  return (
    <div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[600px] px-4 z-[90] pointer-events-none"
      style={{ zIndex: Z_INDEX.ASSISTANT }}
    >
      <div className="pointer-events-auto transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1">
        <form 
            onSubmit={handleSubmit} 
            className="relative flex items-center gap-2 bg-[#181B21]/90 backdrop-blur-xl border border-[#2D313A]/80 p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/5"
        >
          {/* Input Area */}
          <div className="flex-1 relative flex items-center pl-1">
              <div className="absolute left-3 text-jirai-accent flex items-center justify-center animate-pulse">
                  {isProcessing ? <LoadingSpinner size="sm" /> : <Sparkles size={18} />}
              </div>
              <input
                  id="assistant-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={viewMode === 'management' ? "Add tasks to the timeline..." : "Ask Jirai to analyze..."}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none font-mono text-sm rounded-full"
                  disabled={isProcessing}
                  autoComplete="off"
              />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
                isProcessing || !input.trim() 
                ? 'bg-[#2D313A]/50 text-gray-600 cursor-not-allowed' 
                : 'bg-jirai-accent text-white hover:bg-red-500 shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95'
            }`}
          >
            <Send size={18} className={input.trim() ? "ml-0.5" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
}
