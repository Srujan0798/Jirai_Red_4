import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { BaseNode } from '../../types/node.types';
import { useNodesStore } from '../../stores/nodesStore';
import { CheckSquare, Square, PlayCircle, User, Youtube, Mail, ExternalLink, FileText, Box } from 'lucide-react';

export function BaseNodeComponent({ data, selected }: NodeProps<BaseNode>) {
  const { selectNode, toggleTaskStatus, setEditingNode } = useNodesStore();
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Single click: Just select (visual), do not open edit panel
    selectNode(data.id, e.shiftKey);
  };
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Double click: Open edit panel
    setEditingNode(data.id);
  };

  // --- RENDERERS ---

  const renderTaskContent = () => {
    const isDone = data.status === 'done';
    return (
        <div className="flex items-start gap-3 w-full">
            <button 
                onClick={(e) => { e.stopPropagation(); toggleTaskStatus(data.id); }} 
                className={`mt-0.5 shrink-0 transition-colors ${isDone ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
            >
                {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
            </button>
            <div className="flex flex-col w-full overflow-hidden">
                <span className={`font-medium text-sm truncate ${isDone ? 'line-through opacity-50 text-gray-400' : 'text-gray-100'}`}>
                    {data.title}
                </span>
                <div className="flex items-center gap-2 mt-1">
                    {data.task?.priority && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider
                            ${data.task.priority === 'urgent' ? 'bg-red-500/20 text-red-300' :
                              data.task.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                              'bg-blue-500/20 text-blue-300'}`}>
                            {data.task.priority}
                        </span>
                    )}
                    {data.workflow?.end && (
                        <span className="text-[10px] text-gray-500 font-mono">
                            Due: {new Date(data.workflow.end).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
  };

  const renderVideoContent = () => (
      <div className="flex flex-col w-full h-full relative group">
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
              <Youtube size={32} className="text-red-500 drop-shadow-lg opacity-90" />
          </div>
          {data.video?.thumbnailUrl ? (
              <img src={data.video.thumbnailUrl} alt="thumb" className="w-full h-full object-cover opacity-60" />
          ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-900/20 to-black flex items-center justify-center">
                   {/* Placeholder */}
              </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
              <span className="text-xs font-bold text-white truncate block">{data.title}</span>
              <span className="text-[9px] text-gray-300 flex items-center gap-1 mt-0.5">
                  <PlayCircle size={10} />
                  {data.video?.durationSeconds ? `${Math.floor(data.video.durationSeconds/60)} min` : 'Video'}
              </span>
          </div>
      </div>
  );

  const renderPersonContent = () => (
      <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shadow-lg shrink-0 overflow-hidden border-2 border-white/20">
                {data.person?.avatar ? <img src={data.person.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={20} />}
          </div>
          <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-white truncate">{data.title}</span>
              <span className="text-[10px] text-purple-200 truncate uppercase tracking-wider">{data.person?.role || 'Contact'}</span>
              {data.person?.email && (
                  <div className="flex items-center gap-1 mt-0.5 text-[9px] text-purple-300/80">
                      <Mail size={8} /> <span className="truncate max-w-[100px]">{data.person.email}</span>
                  </div>
              )}
          </div>
      </div>
  );

  const renderDefaultContent = () => (
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded ${data.type === 'project' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-gray-300'}`}>
             {data.type === 'project' ? <Box size={16} /> : <FileText size={16} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-white truncate">{data.title}</div>
          {data.description && (
            <div className="text-[10px] text-slate-400 truncate">{data.description}</div>
          )}
        </div>
      </div>
  );

  // --- STYLES ---
  
  const getContainerStyle = () => {
      if (data.type === 'video') return 'p-0 overflow-hidden border-red-500/30 bg-black';
      if (data.type === 'person') return 'rounded-full px-2 py-2 border-purple-500/50 bg-[#1e1b4b] pr-4';
      if (data.type === 'task') return 'border-l-4 border-l-emerald-500 border-y border-r border-slate-700 bg-[#15171C]';
      return 'px-4 py-3 border-2 border-slate-600 bg-[#1E2128]';
  };

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        transform: `scale(${data.visual.sizeMultiplier || 1})`,
        width: data.visual.width,
        height: data.visual.height,
        backgroundColor: data.visual.color && data.type !== 'video' && data.type !== 'person' ? data.visual.color : undefined
      }}
      className={`
        relative transition-all duration-200 cursor-pointer shadow-lg group
        ${getContainerStyle()}
        ${data.type !== 'person' ? 'rounded-lg' : ''}
        ${selected ? 'ring-2 ring-blue-500 shadow-blue-500/20 z-50' : 'hover:border-white/30'}
      `}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-300 !border-2 !border-slate-900 transition-opacity opacity-0 group-hover:opacity-100 hover:!bg-jirai-accent hover:scale-125" />
      
      {data.type === 'task' && renderTaskContent()}
      {data.type === 'video' && renderVideoContent()}
      {data.type === 'person' && renderPersonContent()}
      {['topic', 'note', 'link', 'project', 'document', 'root'].includes(data.type) && renderDefaultContent()}

      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-slate-300 !border-2 !border-slate-900 transition-opacity opacity-0 group-hover:opacity-100 hover:!bg-jirai-accent hover:scale-125" />
      
      {/* Quick Actions Overlay (Optional) */}
      {data.resources && data.resources.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <ExternalLink size={8} /> {data.resources.length}
          </div>
      )}
    </div>
  );
}
