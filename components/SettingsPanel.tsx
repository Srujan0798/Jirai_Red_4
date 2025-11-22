
import React from 'react';
import { X, Sliders, RefreshCw, BookOpen } from 'lucide-react';
import { useNodesStore } from '../stores/nodesStore';
import { Z_INDEX, STORAGE_KEYS } from '../constants';
import { getInitialState } from '../utils/initialState';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { layoutPreference, setLayoutPreference, setGraph } = useNodesStore();
  
  const handleReset = () => {
      if (confirm('Are you sure you want to reset your workspace? This will clear all nodes and edges.')) {
          const { nodes, edges } = getInitialState();
          setGraph(nodes, edges);
          onClose();
      }
  };

  const handleReplayTutorial = () => {
      localStorage.removeItem(STORAGE_KEYS.TUTORIAL_COMPLETED);
      window.location.reload();
  };
  
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-[59] animate-in fade-in" 
        onClick={onClose} 
      />
      <div
        className="fixed top-0 left-0 bottom-0 w-80 bg-[#181B21] border-r border-[#2D313A] shadow-2xl flex flex-col animate-in slide-in-from-left-10 duration-300"
        style={{ zIndex: Z_INDEX.PANEL }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-jirai-border bg-jirai-dark/50">
          <div className="flex items-center gap-3">
            <Sliders size={18} className="text-jirai-accent" />
            <h2 className="font-bold text-white text-lg">Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Layout Preference */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-3">Layout Algorithm</label>
            <div className="flex bg-black/20 rounded p-1 border border-jirai-border">
              {(['ORGANIC', 'HORIZONTAL', 'VERTICAL'] as const).map(pref => (
                <button
                  key={pref}
                  onClick={() => setLayoutPreference(pref)}
                  className={`flex-1 py-1.5 text-xs rounded capitalize transition-colors ${
                    layoutPreference === pref 
                    ? 'bg-jirai-panel shadow text-white font-medium' 
                    : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {pref.toLowerCase()}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 mt-2 font-mono">
              'Organic' is best for Mind Maps. Others are experimental.
            </p>
          </div>

          {/* Data Management */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-3">Workspace Data</label>
            <div className="space-y-2">
                <button
                    onClick={handleReset}
                    className="w-full flex items-center gap-2 text-sm px-3 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-300 rounded-lg border border-red-500/20 transition-colors"
                >
                    <RefreshCw size={14} />
                    Reset Workspace
                </button>
                <button
                    onClick={handleReplayTutorial}
                    className="w-full flex items-center gap-2 text-sm px-3 py-3 bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 rounded-lg border border-blue-500/20 transition-colors"
                >
                    <BookOpen size={14} />
                    Replay Tutorial
                </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
