import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { BaseNode } from '../../types/node.types';
import { useStore as useNodesStore } from '../../store';
import { CheckSquare, Square, PlayCircle, User, Youtube, FileText, Box, StickyNote, Globe, Clock, Brain } from 'lucide-react';

const NodeContent = ({ data, selected }: { data: BaseNode; selected: boolean }) => {
  const { toggleTaskStatus, viewMode } = useNodesStore();

  // === 1. MANAGEMENT MODE (TIMELINE - GANTT STYLE) ===
  if (viewMode === 'management') {
      const isDone = data.status === 'done';
      return (
        <div className={`flex flex-col w-full h-full p-2 rounded-lg border-l-4 shadow-sm transition-colors ${
            isDone ? 'bg-[#10B981]/10 border-emerald-500' : 'bg-[#1E2128] border-blue-500'
        }`}>
             <div className="flex items-center justify-between mb-1">
                 <span className="text-[10px] font-semibold text-gray-400 uppercase">{data.type}</span>
                 {data.workflow?.end && (
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(data.workflow.end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                 )}
             </div>
             <span className={`text-xs font-medium truncate mb-1 ${isDone ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                 {data.title}
             </span>
             
             {/* Progress Bar */}
             <div className="w-full h-1 bg-gray-700 rounded-full mt-auto overflow-hidden">
                 <div 
                    className={`h-full rounded-full ${isDone ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                    style={{ width: isDone ? '100%' : '60%' }}
                 />
             </div>
        </div>
      );
  }

  // === 2. WORKFLOW MODE (CALENDAR - BADGE STYLE) ===
  if (viewMode === 'workflow') {
      let badgeColor = 'bg-gray-800 border-gray-700 text-gray-300';
      if (data.type === 'task') badgeColor = 'bg-emerald-900/30 border-emerald-800 text-emerald-100';
      if (data.type === 'video') badgeColor = 'bg-red-900/30 border-red-800 text-red-100';
      if (data.type === 'project') badgeColor = 'bg-blue-900/30 border-blue-800 text-blue-100';

      return (
          <div className={`flex items-center gap-2 w-full h-full px-2 rounded border ${badgeColor} shadow-sm hover:brightness-105 transition-all`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${data.status === 'done' ? 'bg-emerald-400' : 'bg-white/50'}`} />
              <span className="text-xs font-medium truncate leading-none">{data.title}</span>
          </div>
      );
  }

  // === 3. ANALYSIS MODE (MIND MAP - CLEAN CARDS) ===

  if (data.type === 'root') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Clean Gradient Circle */}
        <div className={`w-full h-full rounded-full bg-gradient-to-br from-[#FF4F5E] to-[#D63F4C] flex items-center justify-center shadow-xl border-4 border-[#0F1115] group transition-transform duration-300 ${selected ? 'scale-105 ring-4 ring-[#FF4F5E]/20' : ''}`}>
            <span className="text-3xl filter drop-shadow-md select-none transform group-hover:scale-110 transition-transform">⚓</span>
        </div>
        
        {/* Floating Label */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#181B21] px-3 py-1.5 rounded-full border border-[#2D313A] shadow-lg">
             <span className="text-xs font-bold text-gray-200 whitespace-nowrap">{data.title}</span>
        </div>
      </div>
    );
  }

  if (data.type === 'task') {
    const isDone = data.status === 'done';
    return (
      <div className="flex items-start gap-3 w-full h-full p-3 bg-[#1E2128] border border-[#2D313A] rounded-lg shadow-sm hover:border-gray-500 transition-colors">
        <button 
          onClick={(e) => { e.stopPropagation(); toggleTaskStatus(data.id); }} 
          className={`mt-0.5 shrink-0 transition-colors ${isDone ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
        >
          {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <span className={`text-sm font-medium truncate ${isDone ? 'line-through opacity-50 text-gray-500' : 'text-gray-200'}`}>
            {data.title}
          </span>
          {data.task?.priority && (
             <div className="mt-1">
               <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium
                  ${data.task.priority === 'urgent' ? 'bg-red-500/10 text-red-400' :
                    data.task.priority === 'high' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-blue-500/10 text-blue-400'}`}>
                  {data.task.priority}
               </span>
             </div>
          )}
        </div>
      </div>
    );
  }

  if (data.type === 'video') {
    return (
      <div className="flex flex-col w-full h-full bg-black rounded-lg overflow-hidden relative group border border-[#2D313A] hover:border-red-500/50 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <Youtube size={32} className="text-red-600 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
        </div>
        {data.video?.thumbnailUrl && (
           <img src={data.video.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <span className="text-xs font-medium text-white truncate block">{data.title}</span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
            <PlayCircle size={10} />
            {data.video?.durationSeconds ? `${Math.floor(data.video.durationSeconds/60)}m` : 'Video'}
          </span>
        </div>
      </div>
    );
  }

  if (data.type === 'person') {
    return (
      <div className="flex items-center gap-3 w-full h-full p-2.5 bg-[#1E2128] border border-[#2D313A] rounded-full pr-5 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0 overflow-hidden">
          {data.person?.avatar ? <img src={data.person.avatar} alt="" className="w-full h-full object-cover" /> : <User size={16} />}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-semibold text-white truncate">{data.title}</span>
          <span className="text-[10px] text-gray-400 truncate">{data.person?.role || 'Contact'}</span>
        </div>
      </div>
    );
  }

  // Default Generic Node (Topic, Note, Document etc.)
  let Icon = Brain; // Default to Brain for 'topic'
  let accentColor = 'text-purple-400'; // Purple for creativity/ideas
  
  if (data.type === 'project') { Icon = Box; accentColor = 'text-blue-400'; }
  if (data.type === 'note') { Icon = StickyNote; accentColor = 'text-yellow-400'; }
  if (data.type === 'link') { Icon = Globe; accentColor = 'text-green-400'; }
  if (data.type === 'document') { Icon = FileText; accentColor = 'text-gray-400'; }

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full p-3 rounded-xl bg-[#1E2128] border border-[#2D313A] shadow-sm transition-all ${selected ? 'ring-2 ring-[#FF4F5E] border-transparent' : 'hover:border-gray-500'}`}>
      <div className={`mb-2 ${accentColor}`}>
        <Icon size={20} />
      </div>
      <span className="text-xs font-semibold text-gray-200 truncate w-full text-center px-1">{data.title}</span>
      {data.description && <span className="text-[10px] text-gray-500 truncate w-full text-center mt-0.5">{data.description}</span>}
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
        className="!w-2 !h-2 !bg-[#2D313A] !border-none transition-opacity opacity-0 group-hover:opacity-100" 
      />
      
      {isResizable && (
        <NodeResizer 
          minWidth={100} 
          minHeight={50} 
          color="#FF4F5E" 
          isVisible={true}
          handleStyle={{ width: 6, height: 6, borderRadius: 3 }}
        />
      )}

      <div className={`w-full h-full group ${selected ? 'z-50' : ''}`}>
        <NodeContent data={data} selected={selected} />
        
        {data.resources && data.resources.length > 0 && (
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm border border-[#1E2128]">
             {data.resources.length}
           </div>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!w-2 !h-2 !bg-[#2D313A] !border-none transition-opacity opacity-0 group-hover:opacity-100"
      />
    </>
  );
});