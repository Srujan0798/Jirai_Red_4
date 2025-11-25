
import React, { useState } from 'react';
import { X, Search, CheckSquare, StickyNote, Box, Brain, User, Youtube, FileText, Star, Trash2 } from 'lucide-react';
import { useTemplateStore } from '../stores/templateStore';
import { NodeTemplate } from '../types/template.types';
import { useStore } from '../store'; // Nodes store
import { BaseNode } from '../types';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icon mapper
const IconMap: Record<string, any> = {
  CheckSquare, StickyNote, Box, Brain, User, Youtube, FileText, Star
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ isOpen, onClose }) => {
  const { getAllTemplates, deleteCustomTemplate } = useTemplateStore();
  const { addNode } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const templates = getAllTemplates();

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'productivity', 'planning', 'research', 'personal', 'custom'];

  const handleUseTemplate = (template: NodeTemplate) => {
    const randomOffset = 200;
    const newNode: BaseNode = {
      ...template.data as BaseNode,
      id: `node-${Date.now()}`,
      position: { x: Math.floor(Math.random() * randomOffset), y: Math.floor(Math.random() * randomOffset) },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addNode(newNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181B21] border border-[#2D313A] rounded-2xl w-full max-w-4xl h-[80vh] shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2D313A] bg-[#181B21] flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-white">Node Templates</h2>
                <p className="text-sm text-gray-400">Jumpstart your thinking with pre-built structures.</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-[#2D313A] bg-[#0F1115] flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search templates..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#181B21] border border-[#2D313A] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FF4F5E]"
                />
            </div>
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                            selectedCategory === cat 
                            ? 'bg-[#FF4F5E] text-white' 
                            : 'bg-[#181B21] border border-[#2D313A] text-gray-400 hover:text-white hover:border-gray-500'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0F1115]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500">
                        No templates found matching your criteria.
                    </div>
                )}

                {filteredTemplates.map(tpl => {
                    const Icon = IconMap[tpl.icon || 'FileText'] || FileText;
                    return (
                        <div 
                            key={tpl.id} 
                            className="group relative bg-[#1E2128] border border-[#2D313A] hover:border-[#FF4F5E]/50 rounded-xl p-5 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-3 rounded-lg bg-opacity-10 ${tpl.isCustom ? 'bg-yellow-500 text-yellow-400' : 'bg-blue-500 text-blue-400'}`}>
                                    <Icon size={24} />
                                </div>
                                {tpl.isCustom && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteCustomTemplate(tpl.id); }}
                                        className="text-gray-600 hover:text-red-400 p-1 transition-colors"
                                        title="Delete Template"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <h3 className="font-bold text-white mb-1">{tpl.name}</h3>
                            <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">{tpl.description}</p>

                            <button 
                                onClick={() => handleUseTemplate(tpl)}
                                className="w-full py-2 rounded-lg bg-[#2D313A] text-gray-300 text-sm font-medium hover:bg-[#FF4F5E] hover:text-white transition-colors"
                            >
                                Use Template
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

      </div>
    </div>
  );
};
