
import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useStore } from '../../store';
import { generateAnalysisFromPrompt } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { Z_INDEX } from '../../constants';

export function AssistantBar() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { nodes, viewMode, addNode, addEdge } = useStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Contextualize prompt based on view mode
      const contextualPrompt = `[Context: ${viewMode} mode] ${input}`;
      const { nodes: newNodes, edges: newEdges } = await generateAnalysisFromPrompt(contextualPrompt, nodes, viewMode);
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
      className="fixed bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/80 to-transparent pointer-events-none"
      style={{ zIndex: Z_INDEX.ASSISTANT }}
    >
      <div className="max-w-2xl mx-auto pb-safe pointer-events-auto">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <div className="flex-1 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-jirai-accent to-purple-600 rounded-xl blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative flex items-center">
                  <div className="absolute left-3 text-jirai-accent pointer-events-none">
                      {isProcessing ? <LoadingSpinner size="sm" /> : <Sparkles size={16} />}
                  </div>
                  <input
                      id="assistant-input"
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={viewMode === 'management' ? "Add tasks to the timeline..." : "Ask Jirai to analyze..."}
                      className="w-full pl-9 pr-4 py-3 bg-[#181B21]/95 border border-[#2D313A] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-[#181B21] focus:border-jirai-accent/50 transition-all font-mono text-sm shadow-xl"
                      disabled={isProcessing}
                      autoComplete="off"
                  />
              </div>
          </div>
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 min-w-[44px] min-h-[44px] ${
                isProcessing || !input.trim() 
                ? 'bg-[#2D313A]/50 text-gray-600 cursor-not-allowed' 
                : 'bg-jirai-accent text-white hover:bg-red-500 shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95'
            }`}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
