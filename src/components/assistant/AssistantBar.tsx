
import React, { useState } from 'react';
import { Send, Sparkles, Command, Zap } from 'lucide-react';
import { useStore } from '../../store';
import { generateAnalysisFromPrompt } from '../../services/geminiService';
import { LoadingSpinner } from '../LoadingSpinner';
import { Z_INDEX } from '../../constants';
import { analytics } from '../../services/analytics';

export function AssistantBar() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { nodes, viewMode, addNodes, addEdges } = useStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const contextualPrompt = `[Context: ${viewMode} mode] ${input}`;
      const { nodes: newNodes, edges: newEdges } = await generateAnalysisFromPrompt(contextualPrompt, nodes, viewMode);
      
      addNodes(newNodes);
      addEdges(newEdges);
      
      // Track successful query
      analytics.trackAIQuery(true);
      
    } catch (error) {
      console.error('AI generation failed:', error);
      // Track failed query
      analytics.trackAIQuery(false);
      if (error instanceof Error) {
          analytics.trackError(error.message, 'assistant-bar');
      }
    } finally {
      setIsProcessing(false);
      setInput('');
    }
  };
  
  return (
    <div 
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[600px] px-4 pointer-events-none transition-all duration-500 ease-out"
      style={{ zIndex: Z_INDEX.ASSISTANT }}
    >
      <div 
        className={`pointer-events-auto relative transition-all duration-500 ease-out transform ${isFocused ? 'scale-105 -translate-y-2' : 'hover:scale-[1.02]'}`}
      >
        {/* Neon Glow Underlay */}
        <div className={`absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF4F5E] via-purple-500 to-[#4A9EFF] opacity-0 transition-opacity duration-500 blur-xl ${isFocused || isProcessing ? 'opacity-40' : 'group-hover:opacity-20'}`} />

        <form 
            onSubmit={handleSubmit} 
            className={`relative flex items-center gap-2 glass-panel p-2 rounded-full transition-colors border border-white/10 ${isFocused ? 'bg-[#0A0A0F]/90' : 'bg-[#0A0A0F]/70'}`}
        >
          {/* AI Icon */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isProcessing ? 'bg-white/5' : 'bg-gradient-to-br from-[#FF4F5E]/20 to-purple-500/20'}`}>
              {isProcessing ? (
                  <LoadingSpinner size="sm" />
              ) : (
                  <Sparkles size={18} className={`text-[#FF4F5E] ${isFocused ? 'animate-pulse' : ''}`} />
              )}
          </div>

          {/* Input */}
          <input
              id="assistant-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={viewMode === 'management' ? "Add tasks to timeline..." : "Ask AI to analyze..."}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none font-medium text-sm h-10 px-2"
              disabled={isProcessing}
              autoComplete="off"
          />

          {/* Shortcut Hint */}
          {!input && !isProcessing && (
              <div className="hidden sm:flex items-center gap-1.5 pr-4 text-[10px] text-gray-600 font-mono pointer-events-none border-r border-white/5">
                  <Command size={10} /> K
              </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${input.trim() 
                    ? 'bg-gradient-to-r from-[#FF4F5E] to-[#D63F4C] text-white shadow-[0_0_15px_rgba(255,79,94,0.4)] hover:scale-110 active:scale-95' 
                    : 'bg-white/5 text-gray-600'
                }
            `}
          >
            {input.trim() ? <Send size={16} className="ml-0.5" /> : <Zap size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
