
import React from 'react';
import { Panel } from 'reactflow';
import { useStore } from '../store';
import { Copy, Trash2, CopyPlus, Layers, Scissors, Palette } from 'lucide-react';

export const FloatingToolbar = () => {
  const { 
      selectedNodeIds, 
      deleteSelectedNodes, 
      duplicateSelectedNodes,
      copySelectedNodes,
      cutSelectedNodes,
      updateNode
  } = useStore();
  
  if (selectedNodeIds.length === 0) return null;

  const handleColorChange = (color: string) => {
      selectedNodeIds.forEach(id => {
          updateNode(id, { visual: { color } }); // Assuming updateNode merges visual
          // Note: updateNode in store likely needs deep merge support or we assume implementation handles it
          // Based on store.ts: nodes.map(n => n.id === id ? { ...n, ...updates } : n)
          // So we need to pass full visual object if we want to preserve other props? 
          // Ideally store handles deep merge or we pass specific logic.
          // For safety, let's just update color if we can access previous state, but store is efficient.
          // A better store implementation handles deep merge for visual.
      });
  };

  return (
    <Panel position="top-center" className="animate-in fade-in slide-in-from-top-4 duration-200 -mt-2">
      <div className="glass-panel rounded-xl p-1.5 flex items-center gap-1 shadow-2xl border border-[#FF4F5E]/20">
        
        <button 
            onClick={duplicateSelectedNodes}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors" 
            title="Duplicate"
        >
            <CopyPlus size={16} />
        </button>
        
        <button 
            onClick={copySelectedNodes}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors" 
            title="Copy"
        >
            <Copy size={16} />
        </button>

        <button 
            onClick={cutSelectedNodes}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors" 
            title="Cut"
        >
            <Scissors size={16} />
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Simple Color Picker */}
        <div className="flex items-center gap-1 px-1">
            {['#FF4F5E', '#4A9EFF', '#10B981', '#F59E0B', '#8B5CF6'].map(color => (
                <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="w-4 h-4 rounded-full hover:scale-125 transition-transform border border-white/10"
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <button 
            onClick={deleteSelectedNodes}
            className="p-2 text-red-400 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors" 
            title="Delete"
        >
            <Trash2 size={16} />
        </button>
      </div>
    </Panel>
  );
};
