
import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { motion } from 'framer-motion';
import { BaseNode } from '../../types/node.types';
import { useStore as useNodesStore } from '../../store';
import { CheckSquare, Square, PlayCircle, User, Youtube, FileText, Box, StickyNote, Globe, Clock, Brain, Link as LinkIcon } from 'lucide-react';

const NodeContent = ({ data, selected }: { data: BaseNode; selected: boolean }) => {
  const { toggleTaskStatus, viewMode } = useNodesStore();

  // === 1. MANAGEMENT MODE (TIMELINE) ===
  if (viewMode === 'management') {
      const isDone = data.status === 'done';
      return (
        <div className={`flex flex-col w-full h-full p-3 rounded-lg border-l-[3px] shadow-xl transition-all duration-300 backdrop-blur-md group
            ${isDone 
                ? 'bg-emerald-950/30 border-emerald-500/50' 
                : 'bg-[#121217]/60 border-blue-500/50 hover:bg-[#181820]/80'
            } ${selected ? 'ring-1 ring-white/30 brightness-110' : 'border-t border-r border-b border-white/5'}`}>
             
             <div className="flex items-center justify-between mb-2">
                 <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">{data.type}</span>
                 {data.workflow?.end && (
                    <span className="text-[9px] text-gray-400 flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded-sm font-mono">
                        <Clock size={10} />
                        {new Date(data.workflow.end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                 )}
             </div>
             
             <span className={`text-xs font-bold truncate mb-3 block ${isDone ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                 {data.title}
             </span>
             
             <div className="w-full h-1 bg-white/5 rounded-full mt-auto overflow-hidden">
                 <div 
                    className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${isDone ? 'bg-emerald-500 text-emerald-500' : 'bg-blue-500 text-blue-500'}`} 
                    style={{ width: isDone ? '100%' : `${data.progress || 25}%` }} 
                 />
             </div>
        </div>
      );
  }

  // === 2. WORKFLOW MODE (CALENDAR) ===
  if (viewMode === 'workflow') {
      let badgeStyle = 'bg-[#121217]/80 border-white/5 text-gray-300';
      if (data.type === 'task') badgeStyle = 'bg-emerald-950/40 border-emerald-500/20 text-emerald-200';
      if (data.type === 'video') badgeStyle = 'bg-red-950/40 border-red-500/20 text-red-200';
      if (data.type === 'project') badgeStyle = 'bg-indigo-950/40 border-indigo-500/20 text-indigo-200';

      return (
          <div className={`flex items-center gap-2 w-full h-full px-3 rounded-md border backdrop-blur-sm shadow-sm transition-all hover:scale-[1.02] ${badgeStyle} ${selected ? 'ring-1 ring-white/40 shadow-lg' : ''}`}>
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_5px_currentColor] ${data.status === 'done' ? 'bg-emerald-400 text-emerald-400' : 'bg-white/50 text-white'}`} />
              <span className="text-[10px] font-medium truncate leading-none opacity-90">{data.title}</span>
          </div>
      );
  }

  // === 3. ANALYSIS MODE (MIND MAP - GLASS CARDS) ===

  // Root Node - Radar Design
  if (data.type === 'root') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Radar Scan Effect */}
        <div className={`absolute inset-[-20%] rounded-full border border-[#FF4F5E]/20 opacity-0 transition-opacity duration-700 ${selected ? 'opacity-100' : ''}`}>
            <div className="absolute inset-0 rounded-full border-t border-[#FF4F5E]/60 animate-radar-spin" />
        </div>
        
        {/* Core Glow */}
        <div className={`absolute inset-0 rounded-full bg-[#FF4F5E] blur-[40px] transition-opacity duration-500 ${selected ? 'opacity-20' : 'opacity-5'}`} />
        
        {/* Main Circle */}
        <div className={`relative w-full h-full rounded-full bg-gradient-to-b from-[#1a1a24] to-[#050507] flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 group transition-all duration-300 ${selected ? 'scale-105 border-[#FF4F5E]/50 shadow-[0_0_30px_rgba(255,79,94,0.2)]' : ''}`}>
            <div className="absolute inset-0 rounded-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
            <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transform group-hover:scale-110 transition-transform duration-300">⚓</span>
        </div>
        
        {/* Label Pill */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 glass-panel px-4 py-1.5 rounded-full border border-white/10">
             <span className="text-[10px] font-bold text-white whitespace-nowrap tracking-widest uppercase">{data.title}</span>
        </div>
      </div>
    );
  }

  // Video Node - Cinematic Card
  if (data.type === 'video') {
    return (
      <div className={`flex flex-col w-full h-full bg-black rounded-xl overflow-hidden relative group border border-white/10 hover:border-red-500/40 transition-all duration-500 shadow-2xl ${selected ? 'ring-1 ring-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)] scale-[1.02]' : ''}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-[#050507]">
          <Youtube size={28} className="text-red-600 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 filter drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
        </div>
        {data.video?.thumbnailUrl && (
           <img src={data.video.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/90 to-transparent">
          <span className="text-[11px] font-bold text-gray-200 truncate block leading-tight group-hover:text-white transition-colors">{data.title}</span>
          <span className="text-[9px] text-red-400/80 flex items-center gap-1 mt-1 font-mono uppercase tracking-wider">
            <PlayCircle size={10} />
            {data.video?.durationSeconds ? `${Math.floor(data.video.durationSeconds/60)}m` : 'PLAY'}
          </span>
        </div>
      </div>
    );
  }

  // Person Node - Avatar Floating
  if (data.type === 'person') {
    return (
      <div className={`flex items-center gap-3 w-full h-full p-2 glass-panel rounded-full pr-6 transition-all duration-300 hover:bg-white/5 border-white/5 ${selected ? 'border-purple-500/40 bg-purple-900/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : ''}`}>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center text-purple-200 shrink-0 overflow-hidden shadow-inner border border-white/10 relative">
          <div className="absolute inset-0 bg-purple-500/20 animate-pulse-slow" />
          {data.person?.avatar ? <img src={data.person.avatar} alt="" className="w-full h-full object-cover relative z-10" /> : <User size={16} className="relative z-10" />}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-gray-200 truncate">{data.title}</span>
          <span className="text-[9px] text-purple-300/60 truncate font-mono uppercase tracking-wider">{data.person?.role || 'Contact'}</span>
        </div>
      </div>
    );
  }

  // Standard Card (Topic, Task, etc.)
  const isTask = data.type === 'task';
  const isDone = isTask && data.status === 'done';
  
  let Icon = Brain;
  let iconColor = 'text-gray-400';
  let glowColor = 'rgba(255,255,255,0)';
  
  if (data.type === 'project') { Icon = Box; iconColor = 'text-indigo-400'; glowColor = 'rgba(99, 102, 241, 0.1)'; }
  if (data.type === 'note') { Icon = StickyNote; iconColor = 'text-yellow-400'; }
  if (data.type === 'link') { Icon = LinkIcon; iconColor = 'text-blue-400'; }
  if (data.type === 'document') { Icon = FileText; iconColor = 'text-slate-300'; }
  if (isTask) { 
      Icon = isDone ? CheckSquare : Square; 
      iconColor = isDone ? 'text-emerald-400' : 'text-gray-500';
      glowColor = isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0)';
  }

  return (
    <div 
        className={`
            flex flex-col w-full h-full p-4 rounded-2xl glass-panel transition-all duration-500 ease-out group
            ${selected ? 'border-t border-l border-white/20 shadow-2xl scale-[1.03] bg-[#121217]/80' : 'hover:bg-[#121217]/60 hover:border-white/10'}
        `}
        style={{ boxShadow: selected ? `0 0 30px -5px ${glowColor}` : '' }}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
          <div className={`p-1.5 rounded-lg bg-white/5 border border-white/5 ${iconColor} transition-colors duration-300 group-hover:bg-white/10`}>
              {isTask ? (
                  <button onClick={(e) => { e.stopPropagation(); toggleTaskStatus(data.id); }} className="transition-transform active:scale-90">
                      <Icon size={16} />
                  </button>
              ) : (
                  <Icon size={16} />
              )}
          </div>
          
          {data.resources && data.resources.length > 0 && (
             <div className="flex items-center gap-1 text-[9px] font-bold text-blue-400 bg-blue-950/30 px-2 py-0.5 rounded-full border border-blue-500/20">
                 <Globe size={10} /> {data.resources.length}
             </div>
          )}
      </div>
      
      {/* Title */}
      <span className={`text-[13px] font-semibold leading-tight transition-colors duration-300 ${isDone ? 'text-gray-600 line-through decoration-gray-700' : 'text-gray-200 group-hover:text-white'}`}>
          {data.title}
      </span>
      
      {/* Description / Footer */}
      {data.description ? (
          <div className="mt-auto pt-3 border-t border-white/5">
              <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed font-medium group-hover:text-gray-400 transition-colors">
                  {data.description}
              </p>
          </div>
      ) : (
          /* Decorative bottom bar if no description */
          <div className="mt-auto pt-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="h-0.5 w-4 rounded-full bg-white/10" />
              <div className="h-0.5 w-2 rounded-full bg-white/10" />
          </div>
      )}
    </div>
  );
};

export const CustomNode = memo(({ data, selected }: NodeProps<BaseNode>) => {
  const { viewMode } = useNodesStore();
  const isResizable = selected && viewMode === 'analysis';

  return (
    <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full h-full"
    >
      {/* Custom Handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2 !h-2 !bg-[#020408] !border-[2px] !border-gray-600 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:!bg-[#FF4F5E] hover:!border-[#FF4F5E] hover:!w-3 hover:!h-3 hover:shadow-[0_0_10px_#FF4F5E]" 
      />
      
      {isResizable && (
        <NodeResizer 
          minWidth={100} 
          minHeight={50} 
          color="#FF4F5E" 
          isVisible={true}
          lineStyle={{ opacity: 0.3 }}
          handleStyle={{ width: 8, height: 8, borderRadius: 2, border: 'none', backgroundColor: '#FF4F5E' }}
        />
      )}

      <div className={`w-full h-full group relative ${selected ? 'z-50' : 'z-10'}`}>
        <NodeContent data={data} selected={selected} />
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2 !h-2 !bg-[#020408] !border-[2px] !border-gray-600 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:!bg-[#FF4F5E] hover:!border-[#FF4F5E] hover:!w-3 hover:!h-3 hover:shadow-[0_0_10px_#FF4F5E]"
      />
    </motion.div>
  );
});
