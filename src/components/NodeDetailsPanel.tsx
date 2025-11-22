import React, { useState, useRef } from 'react';
import { BaseNode, NodeResource, NodeComment } from '../types';
import { X, Calendar, Link as LinkIcon, Youtube, FileText, Send, Palette, MessageSquare, Layers, Trash2, Plus, ExternalLink, Upload, Brain, Database, Cloud, Code, Globe, Server, Shield, Zap, CheckSquare, User, Star } from 'lucide-react';
import { COLORS, Z_INDEX } from '../constants';
import { useTemplateStore } from '../stores/templateStore';

interface NodeDetailsProps {
  node: BaseNode | null;
  onClose: () => void;
  onUpdateNode: (id: string, data: Partial<BaseNode>) => void;
}

type Tab = 'details' | 'style' | 'resources' | 'comments';

/**
 * Side panel component for editing node properties, style, resources, and comments.
 * Responsive design adapts to bottom sheet on mobile.
 */
export const NodeDetailsPanel: React.FC<NodeDetailsProps> = ({ node, onClose, onUpdateNode }) => {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newComment, setNewComment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addCustomTemplate } = useTemplateStore();

  // --- Resources Handler ---
  const handleAddResource = () => {
      if(!newResourceUrl || !node) return;
      
      let type: NodeResource['type'] = 'link';
      let title = 'External Link';

      if (newResourceUrl.includes('youtube.com') || newResourceUrl.includes('youtu.be')) {
          type = 'video';
          title = 'YouTube Video';
      } else if (newResourceUrl.endsWith('.pdf') || newResourceUrl.endsWith('.doc')) {
          type = 'file';
          title = 'Document';
      }

      const newResource: NodeResource = {
          id: Date.now().toString(),
          type,
          url: newResourceUrl,
          title
      };

      const updatedResources = [...(node.resources || []), newResource];
      onUpdateNode(node.id, { resources: updatedResources });
      setNewResourceUrl('');
  };

  const removeResource = (resId: string) => {
      if(!node) return;
      const updated = (node.resources || []).filter(r => r.id !== resId);
      onUpdateNode(node.id, { resources: updated });
  };

  // --- Comments Handler (Mock Collaboration) ---
  const handleAddComment = () => {
      if(!newComment.trim() || !node) return;
      const comment: NodeComment = {
          id: Date.now().toString(),
          userId: 'curr-user',
          userName: 'You',
          text: newComment,
          timestamp: Date.now()
      };
      const updatedComments = [...(node.comments || []), comment];
      onUpdateNode(node.id, { comments: updatedComments });
      setNewComment('');
  };

  // --- Icon Upload Handler ---
  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && node) {
          const reader = new FileReader();
          reader.onloadend = () => {
              // Save base64 string as icon
              if (typeof reader.result === 'string') {
                  onUpdateNode(node.id, { visual: { ...node.visual, icon: reader.result } });
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveAsTemplate = () => {
      if (!node) return;
      const name = prompt("Enter a name for this template:", node.title);
      if (name) {
          addCustomTemplate(node, name);
          // Add user feedback here e.g. a toast notification
      }
  }

  // --- Style Constants ---
  const colors = [COLORS.JIRAI_ACCENT, COLORS.JIRAI_SECONDARY, COLORS.SUCCESS, COLORS.WARNING, COLORS.PURPLE, COLORS.JIRAI_PANEL];
  
  const presetIcons = [
      { id: 'brain', Icon: Brain },
      { id: 'database', Icon: Database },
      { id: 'cloud', Icon: Cloud },
      { id: 'code', Icon: Code },
      { id: 'globe', Icon: Globe },
      { id: 'server', Icon: Server },
      { id: 'shield', Icon: Shield },
      { id: 'zap', Icon: Zap },
  ];

  if (!node) return null;

  const currentSize = (node.visual.sizeMultiplier || 1) < 0.9 ? 'sm' : (node.visual.sizeMultiplier || 1) > 1.2 ? 'lg' : 'md';

  return (
    <>
    {/* Mobile Backdrop */}
    <div 
        className="fixed inset-0 bg-black/50 sm:hidden backdrop-blur-sm animate-in fade-in" 
        onClick={onClose} 
        style={{ zIndex: Z_INDEX.MODAL - 1 }}
    />

    <div 
        className="fixed shadow-2xl flex flex-col bg-[#181B21] animate-in slide-in-from-right-10 duration-300
                   bottom-0 left-0 right-0 h-[85dvh] rounded-t-2xl border-t border-[#2D313A]
                   sm:top-0 sm:bottom-0 sm:left-auto sm:right-0 sm:w-96 sm:h-full sm:rounded-none sm:border-l sm:border-t-0"
        style={{ 
            zIndex: Z_INDEX.MODAL,
        }}
    >
      {/* Mobile Drag Handle */}
      <div className="w-full flex justify-center pt-3 pb-1 sm:hidden" onClick={onClose}>
          <div className="w-16 h-1.5 rounded-full bg-gray-700/50" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-jirai-border bg-jirai-dark/50">
        <div>
            <h2 className="font-bold text-white truncate max-w-[200px] text-lg">{node.title}</h2>
            <span className="text-xs text-gray-500 font-mono uppercase flex items-center gap-2">
                {node.type}
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className={node.status === 'done' ? 'text-emerald-400' : 'text-blue-400'}>{node.status}</span>
            </span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-jirai-border">
          {[
              { id: 'details', icon: Layers, label: 'Info' },
              { id: 'style', icon: Palette, label: 'Style' },
              { id: 'resources', icon: LinkIcon, label: 'Links' },
              { id: 'comments', icon: MessageSquare, label: 'Chat' }
          ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-1 py-3 sm:py-3 flex flex-col items-center gap-1 text-[10px] font-medium uppercase tracking-wide transition-colors min-h-[44px] justify-center ${
                    activeTab === tab.id 
                    ? 'text-jirai-accent border-b-2 border-jirai-accent bg-jirai-accent/5' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                }`}
              >
                  <tab.icon size={18} />
                  {tab.label}
              </button>
          ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 pb-20 sm:pb-5 bg-[#181B21]">
        
        {/* === TAB: DETAILS === */}
        {activeTab === 'details' && (
            <>
                <div>
                    <label className="text-xs font-mono text-gray-500 block mb-2">Label</label>
                    <input 
                        className="w-full bg-black/20 border border-jirai-border rounded px-3 py-3 sm:py-2 text-base sm:text-sm text-white outline-none focus:border-jirai-accent"
                        value={node.title}
                        onChange={(e) => onUpdateNode(node.id, { title: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-xs font-mono text-gray-500 block mb-2">Notes</label>
                    <textarea 
                        className="w-full bg-black/20 border border-jirai-border rounded p-3 text-base sm:text-sm text-gray-300 outline-none focus:border-jirai-accent resize-none h-32 sm:h-40"
                        value={node.description || ''}
                        onChange={(e) => onUpdateNode(node.id, { description: e.target.value })}
                        placeholder="Add detailed notes..."
                    />
                </div>
                <div className="bg-black/20 p-4 rounded border border-jirai-border">
                    <div className="flex items-center gap-2 mb-2 text-jirai-secondary">
                        <Calendar size={14} />
                        <span className="font-medium text-xs uppercase">Deadline</span>
                    </div>
                    <input 
                        type="date" 
                        className="w-full bg-jirai-dark border border-jirai-border rounded px-3 py-3 sm:py-2 text-base sm:text-sm text-white outline-none focus:border-jirai-secondary"
                        value={node.workflow?.end ? node.workflow.end.split('T')[0] : ''}
                        onChange={(e) => onUpdateNode(node.id, { workflow: { ...(node.workflow || { columnIndex: 0 }), end: e.target.value } })}
                    />
                </div>

                {/* Type Specific Fields */}
                {node.type === 'task' && (
                    <div className="bg-black/20 p-4 rounded border border-jirai-border">
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <CheckSquare size={14} />
                            <span className="font-medium text-xs uppercase">Task Details</span>
                        </div>
                        <label className="text-xs font-mono text-gray-500 block mb-1">Priority</label>
                        <select 
                            className="w-full bg-jirai-dark border border-jirai-border rounded px-3 py-3 sm:py-2 text-base sm:text-sm text-white outline-none focus:border-emerald-500"
                            value={node.task?.priority || 'medium'}
                            onChange={(e) => onUpdateNode(node.id, { task: { ...(node.task || {}), priority: e.target.value as any } })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                )}

                {node.type === 'person' && (
                    <div className="bg-black/20 p-4 rounded border border-jirai-border">
                         <div className="flex items-center gap-2 mb-2 text-purple-400">
                            <User size={14} />
                            <span className="font-medium text-xs uppercase">Person Info</span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-mono text-gray-500 block mb-1">Role</label>
                                <input 
                                    className="w-full bg-jirai-dark border border-jirai-border rounded px-3 py-3 sm:py-2 text-base sm:text-sm text-white outline-none focus:border-purple-500"
                                    value={node.person?.role || ''}
                                    onChange={(e) => onUpdateNode(node.id, { person: { ...(node.person || {}), role: e.target.value } })}
                                    placeholder="e.g. Designer"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-mono text-gray-500 block mb-1">Email</label>
                                <input 
                                    className="w-full bg-jirai-dark border border-jirai-border rounded px-3 py-3 sm:py-2 text-base sm:text-sm text-white outline-none focus:border-purple-500"
                                    value={node.person?.email || ''}
                                    onChange={(e) => onUpdateNode(node.id, { person: { ...(node.person || {}), email: e.target.value } })}
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>
                    </div>
                )}
                
                {node.type === 'video' && (
                     <div className="bg-black/20 p-4 rounded border border-jirai-border">
                         <div className="flex items-center gap-2 mb-2 text-red-400">
                            <Youtube size={14} />
                            <span className="font-medium text-xs uppercase">Video Settings</span>
                        </div>
                        <div>
                            <label className="text-xs font-mono text-gray-500 block mb-1">Thumbnail URL</label>
                            <input 
                                className="w-full bg-jirai-dark border border-jirai-border rounded px-3 py-3 sm:py-2 text-base sm:text-sm text-white outline-none focus:border-red-500"
                                value={node.video?.thumbnailUrl || ''}
                                onChange={(e) => onUpdateNode(node.id, { video: { ...(node.video || { platform: 'custom', videoId: '', url: '' }), thumbnailUrl: e.target.value } })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                )}
            </>
        )}

        {/* === TAB: STYLE === */}
        {activeTab === 'style' && (
            <>
                <div>
                    <label className="text-xs font-mono text-gray-500 block mb-3">Node Color</label>
                    <div className="flex flex-wrap gap-3 sm:gap-2">
                        {colors.map(c => (
                            <button
                                key={c}
                                onClick={() => onUpdateNode(node.id, { visual: { ...node.visual, color: c } })}
                                className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                    node.visual.color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                        <button 
                             onClick={() => onUpdateNode(node.id, { visual: { ...node.visual, color: undefined } })}
                             className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 text-[10px] hover:bg-gray-800"
                        >
                            RST
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-mono text-gray-500 block mb-3">Size</label>
                    <div className="flex bg-black/20 rounded p-1 border border-jirai-border">
                        {(['sm', 'md', 'lg'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => {
                                    const mult = s === 'sm' ? 0.75 : s === 'md' ? 1 : 1.5;
                                    onUpdateNode(node.id, { visual: { ...node.visual, sizeMultiplier: mult } });
                                }}
                                className={`flex-1 py-2.5 sm:py-1.5 text-xs rounded capitalize ${
                                    currentSize === s 
                                    ? 'bg-jirai-panel shadow text-white font-medium' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-mono text-gray-500 block mb-3">Icon</label>
                    <div className="grid grid-cols-4 gap-3 sm:gap-2 mb-4">
                        {presetIcons.map(({ id, Icon }) => (
                            <button
                                key={id}
                                onClick={() => onUpdateNode(node.id, { visual: { ...node.visual, icon: id } })}
                                className={`aspect-square flex items-center justify-center rounded-lg border transition-all ${
                                    node.visual.icon === id 
                                    ? 'bg-jirai-accent border-white text-white' 
                                    : 'bg-black/20 border-jirai-border text-gray-500 hover:bg-gray-800 hover:text-gray-300'
                                }`}
                            >
                                <Icon size={20} />
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex gap-2">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={handleIconUpload}
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 py-3 sm:py-2 bg-black/20 border border-jirai-border rounded-lg text-xs text-gray-400 hover:text-white hover:border-gray-500 flex items-center justify-center gap-2 min-h-[36px]"
                        >
                            <Upload size={14} /> Upload Image
                        </button>
                        <button 
                            onClick={() => onUpdateNode(node.id, { visual: { ...node.visual, icon: undefined } })}
                            className="px-4 py-3 sm:py-2 bg-black/20 border border-jirai-border rounded-lg text-xs text-gray-400 hover:text-red-400 hover:border-red-500 min-h-[36px]"
                            title="Remove Icon"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </>
        )}

        {/* === TAB: RESOURCES === */}
        {activeTab === 'resources' && (
            <>
                <div className="flex gap-2">
                    <input 
                        className="flex-1 bg-black/20 border border-jirai-border rounded px-3 py-3 sm:py-2 text-base sm:text-xs text-white outline-none focus:border-jirai-accent"
                        placeholder="Paste URL (YouTube, Docs...)"
                        value={newResourceUrl}
                        onChange={(e) => setNewResourceUrl(e.target.value)}
                    />
                    <button 
                        onClick={handleAddResource}
                        className="bg-jirai-accent px-3.5 rounded text-white hover:bg-red-600 transition-colors min-w-[44px]"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="space-y-3 mt-4">
                    {(node.resources || []).length === 0 && (
                        <p className="text-center text-gray-600 text-xs py-4 italic">No resources yet.</p>
                    )}
                    
                    {node.resources?.map(res => (
                        <div key={res.id} className="bg-gray-800/50 rounded border border-gray-700 overflow-hidden group">
                            <div className="flex items-center justify-between p-2 bg-black/20">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {res.type === 'video' ? <Youtube size={14} className="text-red-500 shrink-0" /> 
                                    : res.type === 'file' ? <FileText size={14} className="text-blue-400 shrink-0" />
                                    : <LinkIcon size={14} className="text-green-500 shrink-0" />}
                                    <span className="text-xs text-gray-300 truncate">{res.title}</span>
                                </div>
                                <button onClick={() => removeResource(res.id)} className="text-gray-500 hover:text-red-400 p-2">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            
                            {/* Embed Preview */}
                            {res.type === 'video' && (
                                <div className="aspect-video w-full bg-black">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={`https://www.youtube.com/embed/${res.url.split('v=')[1]?.split('&')[0] || res.url.split('/').pop() || ''}`} 
                                        frameBorder="0" 
                                        allowFullScreen
                                    />
                                </div>
                            )}
                            {res.type !== 'video' && (
                                <a href={res.url} target="_blank" rel="noreferrer" className="block p-3 text-xs text-blue-400 hover:underline bg-black/10 flex items-center gap-2">
                                    {res.url} <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </>
        )}

        {/* === TAB: COMMENTS === */}
        {activeTab === 'comments' && (
            <div className="flex flex-col h-full min-h-[300px]">
                 <div className="flex-1 space-y-3 mb-4">
                    {(node.comments || []).length === 0 && (
                        <div className="text-center py-8">
                            <MessageSquare className="mx-auto text-gray-700 mb-2" size={24} />
                            <p className="text-gray-600 text-xs">Start the discussion...</p>
                        </div>
                    )}
                    {node.comments?.map(c => (
                        <div key={c.id} className={`flex flex-col ${c.userId === 'curr-user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] p-2 rounded-lg text-xs ${
                                c.userId === 'curr-user' 
                                ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30' 
                                : 'bg-gray-700 text-gray-200'
                            }`}>
                                <p className="font-bold text-[10px] opacity-50 mb-0.5">{c.userName}</p>
                                {c.text}
                            </div>
                            <span className="text-[9px] text-gray-600 mt-0.5">
                                {new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                    ))}
                 </div>
                 
                 <div className="mt-auto flex gap-2 pb-safe">
                     <input 
                         className="flex-1 bg-black/20 border border-jirai-border rounded px-3 py-3 sm:py-2 text-base sm:text-xs text-white outline-none focus:border-jirai-accent"
                         placeholder="Write a comment..."
                         value={newComment}
                         onChange={(e) => setNewComment(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                     />
                     <button 
                         onClick={handleAddComment}
                         className="p-2.5 bg-jirai-panel border border-jirai-border hover:bg-jirai-border rounded text-gray-300 hover:text-white min-w-[44px]"
                     >
                         <Send size={16} />
                     </button>
                 </div>
            </div>
        )}
      </div>
      
      {/* Footer Actions */}
      <div className="p-3 border-t border-jirai-border bg-jirai-dark/50 mt-auto">
          <button 
            onClick={handleSaveAsTemplate}
            className="w-full py-2 bg-jirai-panel hover:bg-jirai-border border border-jirai-border text-xs font-mono text-gray-300 hover:text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
              <Star size={14} /> Save as Template
          </button>
      </div>

    </div>
    </>
  );
};