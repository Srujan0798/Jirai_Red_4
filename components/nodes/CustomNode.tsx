
import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { BaseNode } from '../../types/node.types';
import { useStore as useNodesStore } from '../../store';
import { CheckSquare, Square, PlayCircle, User, Youtube, FileText, Box, StickyNote, Globe, Clock, Brain } from 'lucide-react';

const NodeContent = ({ data, selected }: { data: BaseNode; selected: boolean }) => {
  const { toggleTaskStatus, viewMode } = useNodesStore();

  // === 1. MANAGEMENT MODE (TIMELINE - GANTT STYLE) ===
  // Goal: Linear, clear time duration, "Bar" look.
  if (viewMode === 'management') {
      const isDone = data.status === 'done';
      // Calculate width roughly based on duration if possible, otherwise static for now
      // In a real Gantt, width is dynamic. Here we fake it with style.
      
      let barColor = 'border-blue-500 bg-[#1E2128]';
      if (data.type === 'project') barColor = 'border-indigo-500 bg-[#1E2128]';
      if (data.type === 'task') barColor = 'border-emerald-500 bg-[#1E2128]';
      if (isDone) barColor = 'border-emerald-600 bg-emerald-900/20';

      return (
        <div className={`flex flex-col w-full h-full p-3 rounded-lg border-l-4 shadow-lg transition-all hover:brightness-110 ${barColor}`}>
             <div className="flex items-center justify-between mb-2">
                 <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">{data.type}</span>
                 {data.workflow?.end && (
                    <span className="text-[9px] text-gray-400 flex items-center gap-1 bg-black/30 px-1.5 py-0.5 rounded">
                        <Clock size={10} />
                        {new Date(data.workflow.end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                 )}
             </div>
             <span className={`text-sm font-bold truncate mb-2 ${isDone ? 'text-gray-500 line-through' : 'text-white'}`}>
                 {data.title}
             </span>
             
             {/* Fake Progress/Duration Bar */}
             <div className="w-full h-1.5 bg-gray-700 rounded-full mt-auto overflow-hidden">
                 <div 
                    className={`h-full rounded-full ${isDone ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                    style={{ width: isDone ? '100%' : `${data.progress || 45}%` }} 
                 />
             </div>
        </div>
      );
  }

  // === 2. WORKFLOW MODE (CALENDAR - BADGE STYLE) ===
  // Goal: Compact, fit in grid, "Post-it" look.
  if (viewMode === 'workflow') {
      let badgeClass = 'bg-gray-800 border-gray-700 text-gray-300';
      if (data.type === 'task') badgeClass = 'bg-emerald-900/40 border-emerald-800 text-emerald-200';
      if (data.type === 'video') badgeClass = 'bg-red-900/40 border-red-800 text-red-200';
      if (data.type === 'project') badgeClass = 'bg-indigo-900/40 border-indigo-800 text-indigo-200';
      if (data.type === 'note') badgeClass = 'bg-yellow-900/40 border-yellow-800 text-yellow-200';

      return (
          <div className={`flex flex-col justify-center w-full h-full px-3 py-1 rounded-md border ${badgeClass} shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-grab`}>
              <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${data.status === 'done' ? 'bg-emerald-400' : 'bg-current opacity-50'}`} />
                  <span className="text-[11px] font-medium truncate leading-tight">{data.title}</span>
              </div>
          </div>
      );
  }

  // === 3. ANALYSIS MODE (MIND MAP - ORGANIC) ===
  // Goal: Exploration, connection, "Investigation" look.

  // Special Root Node
  if (data.type === 'root') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className={`w-full h-full rounded-full bg-gradient-to-br from-[#FF4F5E] to-[#D63F4C] flex items-center justify-center shadow-[0_0_30px_rgba(255,79,94,0.4)] border-4 border-[#0F1115] group transition-transform duration-300 ${selected ? 'scale-110 ring-4 ring-[#FF4F5E]/30' : ''}`}>
            <span className="text-4xl filter drop-shadow-md select-none">⚓</span>
        </div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#181B21] px-4 py-1.5 rounded-full border border-[#2D313A] shadow-xl">
             <span className="text-sm font-bold text-white whitespace-nowrap tracking-wide">{data.title}</span>
        </div>
      </div>
    );
  }

  // Standard Analysis Nodes
  const isDone = data.status === 'done';
  let Icon = Brain;
  let accentColor = 'text-gray-400';
  let borderColor = 'border-[#2D313A]';
  let bgColor = 'bg-[#1E2128]';

  if (data.type === 'video') { Icon = Youtube; accentColor = 'text-red-500'; borderColor = 'border-red-900/30'; }
  if (data.type === 'person') { Icon = User; accentColor = 'text-purple-500'; borderColor = 'border-purple-900/30'; }
  if (data.type === 'task') { Icon = CheckSquare; accentColor = 'text-emerald-500'; borderColor = 'border-emerald-900/30'; }
  if (data.type === 'project') { Icon = Box; accentColor = 'text-indigo-500'; borderColor = 'border-indigo-900/30'; }
  
  // Video Specific (Thumbnail Card)
  if (data.type === 'video' && data.video?.thumbnailUrl) {
      return (
        <div className={`flex flex-col w-full h-full bg-black rounded-xl overflow-hidden relative group border ${borderColor} shadow-lg transition-transform ${selected ? 'ring-2 ring-[#FF4F5E]' : ''}`}>
            <img src={data.video.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle size={32} className="text-white opacity-80 drop-shadow-lg" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                <span className="text-[10px] font-bold text-white truncate block">{data.title}</span>
            </div>
        </div>
      );
  }

  // Person Specific (Circle)
  if (data.type === 'person') {
      return (
          <div className={`flex items-center gap-3 w-full h-full p-2 bg-[#1E2128] border ${borderColor} rounded-full pr-6 shadow-lg hover:border-purple-500/50 transition-colors`}>
              <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-200 shrink-0 border border-purple-500/20">
                  {data.person?.avatar ? <img src={data.person.avatar} className="w-full h-full rounded-full object-cover"/> : <User size={18} />}
              </div>
              <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">{data.title}</span>
                  <span className="text-[9px] text-gray-400 truncate uppercase tracking-wider">{data.person?.role || 'Contact'}</span>
              </div>
          </div>
      );
  }

  // Default Card
  return (
    <div className={`flex flex-col w-full h-full p-4 rounded-2xl ${bgColor} border ${borderColor} shadow-lg transition-all ${selected ? 'ring-2 ring-[#FF4F5E] scale-105' : 'hover:border-gray-600'}`}>
      <div className="flex items-start justify-between mb-2">
          <div className={`p-1.5 rounded-lg bg-black/20 ${accentColor}`}>
              <Icon size={16} />
          </div>
          {data.type === 'task' && (
              <button onClick={(e) => { e.stopPropagation(); toggleTaskStatus(data.id); }} className={isDone ? 'text-emerald-500' : 'text-gray-600 hover:text-white'}>
                  {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
          )}
      </div>
      <span className={`text-xs font-bold leading-snug ${isDone ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
          {data.title}
      </span>
      {data.resources && data.resources.length > 0 && (
          <div className="mt-auto pt-2 flex gap-1">
              {data.resources.map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />)}
          </div>
      )}
    </div>
  );
};

export const CustomNode = memo(({ data, selected }: NodeProps<BaseNode>) => {
  const { viewMode } = useNodesStore();
  const isResizable = selected && viewMode === 'analysis';

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!w-2 !h-2 !bg-[#374151] !border-2 !border-[#0F1115] transition-opacity opacity-0 group-hover:opacity-100" 
      />
      
      {isResizable && (
        <NodeResizer 
          minWidth={100} 
          minHeight={50} 
          color="#FF4F5E" 
          isVisible={true}
          handleStyle={{ width: 8, height: 8, borderRadius: 4 }}
        />
      )}

      <div className={`w-full h-full group ${selected ? 'z-50' : ''}`}>
        <NodeContent data={data} selected={selected} />
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2 !h-2 !bg-[#374151] !border-2 !border-[#0F1115] transition-opacity opacity-0 group-hover:opacity-100"
      />
    </>
  );
});
