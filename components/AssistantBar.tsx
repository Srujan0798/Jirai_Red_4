
import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { generateAnalysisFromPrompt } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { Z_INDEX } from '../constants';

export function AssistantBar() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { nodes, viewMode, addNode, addEdge } = useStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Call AI Service (Client-side Gemini acting as Backend)
      const { nodes: newNodes, edges: newEdges } = await generateAnalysisFromPrompt(input, nodes, viewMode);
      
      // Add nodes to canvas (Incremental update)
      newNodes.forEach(node => addNode(node));
      newEdges.forEach(edge => addEdge(edge));
      
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsProcessing(false);
      setInput('');
    }
  };
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-[#0F1115]/95 border-t border-[#2D313A] p-3 sm:p-4 backdrop-blur-xl pb-6 sm:pb-4"
      style={{ zIndex: Z_INDEX.ASSISTANT }}
    >
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2 sm:gap-3">
        <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-jirai-accent to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
            <input
                id="assistant-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={window.innerWidth < 640 ? "Ask Jirai..." : `Ask Jirai to add nodes in ${viewMode} mode...`}
                className="relative w-full px-3 py-3 sm:px-4 sm:py-3 bg-[#181B21] border border-[#2D313A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-jirai-accent focus:ring-1 focus:ring-jirai-accent transition-all font-mono text-base sm:text-sm"
                disabled={isProcessing}
                autoComplete="off"
            />
            {isProcessing && (
                <div className="absolute right-3 top-3.5 sm:top-3">
                  <LoadingSpinner size="sm" />
                </div>
            )}
        </div>
        
        <button
          type="submit"
          disabled={isProcessing || !input.trim()}
          className={`px-4 sm:px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-bold text-sm min-w-[44px] justify-center ${
              isProcessing || !input.trim() 
              ? 'bg-[#181B21] text-gray-600 cursor-not-allowed' 
              : 'bg-jirai-accent text-white hover:bg-red-600 shadow-lg shadow-red-900/20'
          }`}
        >
          {isProcessing ? <Sparkles className="w-5 h-5 sm:w-4 sm:h-4 animate-pulse" /> : <Send className="w-5 h-5 sm:w-4 sm:h-4" />}
          <span className="hidden sm:inline">{isProcessing ? 'Thinking...' : 'Generate'}</span>
        </button>
      </form>
    </div>
  );
}
