
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  BackgroundVariant,
  Panel,
  OnMove,
  ConnectionLineType,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import { useNodesStore } from '../stores/nodesStore';
import { BaseNode } from '../types/node.types';
import { CustomNode } from './nodes/CustomNode';
import { COLORS } from '../constants';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { ShortcutHelp } from './ShortcutHelp';
import { ContextMenu } from './ContextMenu';
import { ContextMenuState } from '../types';

interface GraphEngineProps {
  viewMode: 'analysis' | 'management' | 'workflow';
}

const nodeTypes = {
  root: CustomNode,
  topic: CustomNode,
  task: CustomNode,
  video: CustomNode,
  person: CustomNode,
  note: CustomNode,
  project: CustomNode,
  document: CustomNode,
  link: CustomNode,
};

const GraphEngineInner: React.FC<GraphEngineProps> = ({ viewMode }) => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    selectNode,
    clearSelection,
    setEditingNode,
    addNode,
  } = useNodesStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project, fitView } = useReactFlow();

  // Initialize Keyboard Shortcuts
  const { isHelpOpen, toggleHelp } = useKeyboardShortcuts();
  
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Viewport state for syncing custom headers (Timeline/Calendar)
  const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
  const [currentTimeX, setCurrentTimeX] = useState(0);

  // Calculate "Now" position for Timeline View
  useEffect(() => {
      const calculateNow = () => {
          const now = new Date();
          const minutes = now.getHours() * 60 + now.getMinutes();
          const dayProgress = minutes / (24 * 60);
          const x = 100 + (dayProgress * 320); 
          setCurrentTimeX(x);
      };
      
      calculateNow();
      const interval = setInterval(calculateNow, 60000); 
      return () => clearInterval(interval);
  }, []);

  const rfNodes: Node<BaseNode>[] = useMemo(() => nodes.map(n => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: n,
    width: n.visual.width ?? (viewMode === 'management' ? 280 : viewMode === 'workflow' ? 230 : (n.type === 'root' ? 180 : 160)),
    height: n.visual.height ?? (viewMode === 'management' ? 100 : viewMode === 'workflow' ? 60 : (n.type === 'root' ? 180 : 100)),
    draggable: true, 
  })), [nodes, viewMode]);

  const rfEdges: Edge[] = useMemo(() => edges.map(e => ({
    id: e.id,
    source: e.from,
    target: e.to,
    animated: e.style === 'dashed',
    style: { 
        stroke: e.color || (e.kind === 'next' ? COLORS.JIRAI_SECONDARY : '#363B47'), 
        strokeWidth: Math.max(2, e.weight || 2),
        strokeDasharray: e.style === 'dashed' ? '5,5' : undefined,
        opacity: viewMode === 'analysis' ? 0.6 : 0.2 
    },
    type: viewMode === 'analysis' ? 'default' : 'smoothstep'
  })), [edges, viewMode]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setContextMenu(null);
    selectNode(node.id, false);
  }, [selectNode]);

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    setEditingNode(node.id);
  }, [setEditingNode]);

  const onPaneClick = useCallback(() => {
    clearSelection();
    setContextMenu(null);
  }, [clearSelection]);

  const onMove: OnMove = useCallback((evt, viewport) => {
    setTransform(viewport);
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
        id: 'pane-menu',
        top: event.clientY,
        left: event.clientX,
        type: 'pane',
        data: project({ x: event.clientX, y: event.clientY })
    });
  }, [project]);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node<BaseNode>) => {
    event.preventDefault();
    setContextMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
        type: 'node',
        data: node.data
    });
  }, []);

  const timelineHeaders = useMemo(() => {
      const dates = [];
      const today = new Date();
      
      for (let i = 0; i < 60; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          dates.push(d);
      }
      return dates;
  }, []);

  const calendarDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const snapToGrid = viewMode !== 'analysis';
  const snapGrid: [number, number] = viewMode === 'workflow' ? [250, 50] : [20, 20];

  const handlePaneDoubleClick = useCallback((event: React.MouseEvent) => {
      const position = project({ x: event.clientX, y: event.clientY });
      addNode({
          id: `node-${Date.now()}`,
          type: 'topic',
          title: 'New Topic',
          position,
          visual: { shape: 'rounded-rect', sizeMultiplier: 1 },
          status: 'todo'
      });
  }, [project, addNode]);

  return (
    <>
    <ShortcutHelp isOpen={isHelpOpen} onClose={toggleHelp} />
    <ContextMenu menu={contextMenu} onClose={() => setContextMenu(null)} />
    <div className="w-full h-full bg-[#0F1115] relative overflow-hidden pb-24" ref={reactFlowWrapper}>
      
      {viewMode === 'management' && (
        <>
            <div className="absolute top-0 left-0 right-0 h-32 z-40 bg-[#14171d]/95 border-b border-[#2D313A] shadow-2xl pointer-events-none backdrop-blur-sm overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full flex will-change-transform"
                    style={{ 
                        transform: `translateX(${transform.x}px) scale(${transform.zoom})`, 
                        transformOrigin: '0 0' 
                    }}
                >
                    <div className="shrink-0 w-[100px] h-full border-r border-[#2D313A]/50 bg-[#181b21] z-10 relative shadow-lg flex items-center justify-center">
                        <span className="text-xs font-mono text-gray-500 rotate-[-90deg] tracking-widest">STREAMS</span>
                    </div>
                    
                    {timelineHeaders.map((date, i) => {
                        const isToday = i === 0;
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        
                        return (
                          <div 
                            key={i} 
                            className={`shrink-0 w-[320px] h-full border-r border-[#2D313A]/30 flex flex-col items-center justify-end pb-4 
                                ${isToday ? 'bg-gradient-to-b from-transparent to-[#FF4F5E]/10' : isWeekend ? 'bg-white/[0.02]' : ''}
                            `}
                          >
                               <span className={`text-[10px] font-bold tracking-[0.2em] mb-1 uppercase font-mono ${isToday ? 'text-[#FF4F5E]' : 'text-gray-500'}`}>
                                 {date.toLocaleDateString('en-US', { weekday: 'short' })}
                               </span>
                               <div className={`text-3xl font-bold font-sans ${isToday ? 'text-[#FF4F5E]' : 'text-gray-200'}`}>
                                 {date.getDate()}
                               </div>
                               <span className="text-[10px] text-gray-600 font-mono mt-1">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                          </div>
                        );
                    })}
                </div>
            </div>
            
            <div 
                className="absolute top-0 left-0 z-0 pointer-events-none origin-top-left timeline-grid-pattern will-change-transform"
                style={{
                    width: '100000px',
                    height: '100000px',
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
                    marginLeft: '100px' 
                }}
            />

             <div 
                className="absolute top-32 bottom-0 w-0.5 bg-[#FF4F5E] z-10 pointer-events-none shadow-[0_0_10px_#FF4F5E] will-change-transform"
                style={{
                    transform: `translateX(${transform.x + (currentTimeX * transform.zoom)}px)`,
                    transformOrigin: '0 0'
                }}
             >
                 <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-[#FF4F5E] shadow-lg" />
                 <div className="absolute top-2 left-2 text-[10px] font-mono text-[#FF4F5E] bg-black/80 px-1 rounded whitespace-nowrap">
                    NOW
                 </div>
             </div>
             
             <div className="absolute top-0 left-0 bottom-0 w-[100px] bg-[#0F1115]/50 backdrop-blur-[1px] border-r border-[#2D313A] z-0 pointer-events-none will-change-transform" 
                  style={{ transform: `translate(${transform.x}px, 0)` }} 
             />
        </>
      )}

      {viewMode === 'workflow' && (
          <>
            <div className="absolute top-0 left-0 right-0 h-12 z-40 bg-[#14171d] border-b border-[#2D313A] shadow-lg pointer-events-none overflow-hidden">
                 <div 
                    className="absolute top-0 left-0 h-full flex will-change-transform"
                    style={{ 
                        transform: `translateX(${transform.x}px) scale(${transform.zoom})`, 
                        transformOrigin: '0 0' 
                    }}
                 >
                    {Array.from({ length: 20 }).map((_, w) => (
                        <div key={w} className="flex">
                            {calendarDays.map((day, d) => (
                                <div key={`${w}-${d}`} className="shrink-0 w-[250px] h-full border-r border-[#2D313A]/30 flex items-center justify-center bg-[#181B21]">
                                    <span className={`text-[10px] font-bold tracking-widest ${day === 'SUN' || day === 'SAT' ? 'text-[#FF4F5E]/70' : 'text-gray-500'}`}>
                                        {day}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                 </div>
            </div>

            <div 
                className="absolute top-0 left-0 z-0 pointer-events-none origin-top-left calendar-grid-pattern will-change-transform"
                style={{
                    width: '100000px',
                    height: '100000px',
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
                    marginTop: '50px'
                }}
            />
          </>
      )}

      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onDoubleClick={handlePaneDoubleClick}
        onMove={onMove}
        nodeTypes={nodeTypes}
        minZoom={0.1}
        maxZoom={2}
        snapToGrid={snapToGrid}
        snapGrid={snapGrid}
        fitView
        className="bg-transparent"
        connectionLineStyle={{ stroke: '#FF4F5E', strokeWidth: 2 }}
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        {viewMode === 'analysis' && (
            <Background 
                variant={BackgroundVariant.Dots} 
                gap={24} 
                size={1} 
                color="#2D313A" 
                className="opacity-50"
            />
        )}
        
        <Panel position="bottom-right" className="mb-32 mr-4 pointer-events-none opacity-50">
             <div className="text-[10px] font-mono text-gray-500 border border-gray-800 px-2 py-1 rounded bg-black/40 uppercase tracking-widest">
                 {viewMode === 'analysis' ? 'Mind Map' : viewMode === 'management' ? 'Timeline View' : 'Calendar Grid'}
             </div>
        </Panel>

        <Controls className="bg-[#181B21] border border-[#2D313A] fill-gray-400 rounded-lg overflow-hidden shadow-xl mb-24 ml-4" showInteractive={false} />
        
        <MiniMap 
            className="bg-[#181B21] border border-[#2D313A] rounded-lg overflow-hidden shadow-2xl mb-24 mr-4" 
            maskColor="rgba(15, 17, 21, 0.8)"
            nodeColor={(n) => {
               const t = n.data.type;
               if(t === 'root') return COLORS.JIRAI_ACCENT;
               if(t === 'task') return COLORS.SUCCESS;
               if(t === 'video') return COLORS.RED;
               if(t === 'person') return COLORS.PURPLE;
               return '#374151';
            }}
        />
      </ReactFlow>
    </div>
    </>
  );
};

export const GraphEngine: React.FC<GraphEngineProps> = (props) => {
  return (
    <ReactFlowProvider>
      <GraphEngineInner {...props} />
    </ReactFlowProvider>
  );
};
