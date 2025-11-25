
import React, { useCallback, useMemo, useState, useEffect, useRef, memo } from 'react';
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
  useReactFlow,
  OnConnectStart,
  OnConnectEnd
} from 'reactflow';
import { useNodesStore } from '../stores/nodesStore';
import { useUserStore } from '../stores/userStore';
import { BaseNode } from '../types/node.types';
import { CustomNode } from './nodes/CustomNode';
import { CustomEdge } from './edges/CustomEdge';
import { COLORS } from '../constants';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useSmoothControls } from '../hooks/useSmoothControls';
import { useVirtualNodes } from '../hooks/useVirtualNodes';
import { useTouchGestures } from '../hooks/useTouchGestures';
import { ShortcutHelp } from './ShortcutHelp';
import { ContextMenu } from './ContextMenu';
import { CommandPalette } from './CommandPalette';
import { FloatingToolbar } from './FloatingToolbar';
import { ContextMenuState } from '../types';
import { isValidConnection } from '../utils/connectionValidation';

interface GraphEngineProps {
  viewMode: 'analysis' | 'management' | 'workflow';
}

// Memoized Node Types
const NODE_TYPES = {
  root: memo(CustomNode),
  topic: memo(CustomNode),
  task: memo(CustomNode),
  video: memo(CustomNode),
  person: memo(CustomNode),
  note: memo(CustomNode),
  project: memo(CustomNode),
  document: memo(CustomNode),
  link: memo(CustomNode),
};

// Main Component (No inner wrapper needed as Provider is in App)
export const GraphEngine: React.FC<GraphEngineProps> = memo(({ viewMode }) => {
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
    addEdge
  } = useNodesStore();

  const { preferences } = useUserStore();
  const reduceMotion = preferences.reduceMotion;

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  // Hooks
  const { isHelpOpen, toggleHelp } = useKeyboardShortcuts();
  useSmoothControls(); 
  
  // Phase 9: Touch Gestures
  const gesturesBind = useTouchGestures(reactFlowWrapper);

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
  const [currentTimeX, setCurrentTimeX] = useState(0);

  // Edge Types Registration
  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);

  // Performance: Memoize edge options
  const connectionLineStyle = useMemo(() => ({ 
    stroke: '#FF4F5E', 
    strokeWidth: 2 
  }), []);

  const defaultEdgeOptions = useMemo(() => ({
    type: 'smoothstep',
    animated: false,
    style: { strokeWidth: 2 }
  }), []);

  // Fit view optimization
  useEffect(() => {
    const duration = reduceMotion ? 0 : 800;
    const timer = setTimeout(() => fitView({ duration, padding: 0.2 }), 100);
    return () => clearTimeout(timer);
  }, [fitView, nodes.length === 3, reduceMotion]); 

  // Timeline "Now" Marker
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

  // --- VIRTUALIZATION ---
  const visibleNodes = useVirtualNodes(rfNodes);

  const rfEdges: Edge[] = useMemo(() => edges.map(e => ({
    id: e.id,
    source: e.from,
    target: e.to,
    animated: e.style === 'dashed',
    style: { 
        stroke: e.color || (e.kind === 'next' ? COLORS.JIRAI_SECONDARY : '#2D313A'), 
        strokeWidth: Math.max(1.5, e.weight || 1.5),
        strokeDasharray: e.style === 'dashed' ? '5,5' : undefined,
        opacity: viewMode === 'analysis' ? 0.6 : 0.3
    },
    type: viewMode === 'analysis' ? 'custom' : 'smoothstep'
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
        data: screenToFlowPosition({ x: event.clientX, y: event.clientY })
    });
  }, [screenToFlowPosition]);

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

  // Connect to Create Handlers
  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback((event) => {
    if (!connectingNodeId.current || !reactFlowWrapper.current) return;

    const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');

    if (targetIsPane) {
        const clientX = (event as MouseEvent).clientX || (event as TouchEvent).changedTouches?.[0]?.clientX;
        const clientY = (event as MouseEvent).clientY || (event as TouchEvent).changedTouches?.[0]?.clientY;
        
        if (clientX && clientY) {
             const position = screenToFlowPosition({
                x: clientX,
                y: clientY,
            });

            const newNode: BaseNode = {
                id: `node-${Date.now()}`,
                type: 'topic',
                title: 'New Topic',
                position,
                visual: { shape: 'rounded-rect', sizeMultiplier: 1 },
                status: 'todo'
            };

            addNode(newNode);
            
            addEdge({
                id: `e-${Date.now()}`,
                from: connectingNodeId.current,
                to: newNode.id,
                kind: 'solid',
                style: 'solid',
                weight: 2,
                opacity: 1
            });
        }
    }
    connectingNodeId.current = null;
  }, [screenToFlowPosition, addNode, addEdge]);

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
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addNode({
          id: `node-${Date.now()}`,
          type: 'topic',
          title: 'New Topic',
          position,
          visual: { shape: 'rounded-rect', sizeMultiplier: 1 },
          status: 'todo'
      });
  }, [screenToFlowPosition, addNode]);

  return (
    <>
    <ShortcutHelp isOpen={isHelpOpen} onClose={toggleHelp} />
    <CommandPalette />
    <ContextMenu menu={contextMenu} onClose={() => setContextMenu(null)} />
    
    <div className="w-full h-full bg-[#020408] relative overflow-hidden" ref={reactFlowWrapper} {...gesturesBind()}>
      
      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,4,8,0.6)_100%)] z-0" />

      {viewMode === 'management' && (
        <>
            {/* Timeline Header */}
            <div className="absolute top-0 left-0 right-0 h-32 z-40 bg-[#020408]/95 border-b border-white/5 shadow-2xl pointer-events-none backdrop-blur-md overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full flex will-change-transform"
                    style={{ 
                        transform: `translateX(${transform.x}px) scale(${transform.zoom})`, 
                        transformOrigin: '0 0' 
                    }}
                >
                    <div className="shrink-0 w-[100px] h-full border-r border-white/5 bg-[#020408] z-10 relative shadow-lg flex items-center justify-center">
                        <span className="text-[10px] font-mono text-gray-600 rotate-[-90deg] tracking-widest">STREAMS</span>
                    </div>
                    {timelineHeaders.map((date, i) => {
                        const isToday = i === 0;
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        return (
                          <div 
                            key={i} 
                            className={`shrink-0 w-[320px] h-full border-r border-white/5 flex flex-col items-center justify-end pb-4 
                                ${isToday ? 'bg-gradient-to-b from-transparent to-[#FF4F5E]/5' : isWeekend ? 'bg-white/[0.01]' : ''}
                            `}
                          >
                               <span className={`text-[10px] font-bold tracking-[0.2em] mb-1 uppercase font-mono ${isToday ? 'text-[#FF4F5E]' : 'text-gray-600'}`}>
                                 {date.toLocaleDateString('en-US', { weekday: 'short' })}
                               </span>
                               <div className={`text-3xl font-bold font-sans ${isToday ? 'text-[#FF4F5E]' : 'text-gray-300'}`}>
                                 {date.getDate()}
                               </div>
                               <span className="text-[10px] text-gray-700 font-mono mt-1">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                          </div>
                        );
                    })}
                </div>
            </div>
            
            <div 
                className="absolute top-0 left-0 z-0 pointer-events-none origin-top-left timeline-grid-pattern will-change-transform opacity-30"
                style={{
                    width: '100000px',
                    height: '100000px',
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
                    marginLeft: '100px' 
                }}
            />

             {/* "NOW" Line */}
             <div 
                className="absolute top-32 bottom-0 w-px bg-[#FF4F5E] z-10 pointer-events-none shadow-[0_0_10px_#FF4F5E] will-change-transform"
                style={{
                    transform: `translateX(${transform.x + (currentTimeX * transform.zoom)}px)`,
                    transformOrigin: '0 0'
                }}
             >
                 <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-[#FF4F5E] shadow-lg" />
                 <div className="absolute top-2 left-2 text-[9px] font-bold tracking-wider text-[#FF4F5E] bg-[#020408] border border-[#FF4F5E]/30 px-1.5 py-0.5 rounded">
                    NOW
                 </div>
             </div>
             
             <div className="absolute top-0 left-0 bottom-0 w-[100px] bg-[#020408]/50 backdrop-blur-[1px] border-r border-white/5 z-0 pointer-events-none will-change-transform" 
                  style={{ transform: `translate(${transform.x}px, 0)` }} 
             />
        </>
      )}

      {viewMode === 'workflow' && (
          <>
            <div className="absolute top-0 left-0 right-0 h-12 z-40 bg-[#020408] border-b border-white/5 shadow-lg pointer-events-none overflow-hidden">
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
                                <div key={`${w}-${d}`} className="shrink-0 w-[250px] h-full border-r border-white/5 flex items-center justify-center bg-[#020408]">
                                    <span className={`text-[10px] font-bold tracking-widest ${day === 'SUN' || day === 'SAT' ? 'text-[#FF4F5E]/70' : 'text-gray-600'}`}>
                                        {day}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                 </div>
            </div>

            <div 
                className="absolute top-0 left-0 z-0 pointer-events-none origin-top-left calendar-grid-pattern will-change-transform opacity-30"
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
        nodes={visibleNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onDoubleClick={handlePaneDoubleClick}
        onMove={onMove}
        nodeTypes={NODE_TYPES}
        edgeTypes={edgeTypes}
        isValidConnection={(conn) => isValidConnection(conn, rfEdges)}
        minZoom={0.1}
        maxZoom={4}
        snapToGrid={snapToGrid}
        snapGrid={snapGrid}
        fitView
        className="bg-transparent"
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        proOptions={{ hideAttribution: true }}
        panOnDrag={true}
        selectionOnDrag={true}
        panOnScroll={true}
      >
        {viewMode === 'analysis' && (
            <Background 
                variant={BackgroundVariant.Dots} 
                gap={24} 
                size={1} 
                color="#444" 
                className="opacity-10"
            />
        )}
        
        <FloatingToolbar />
        
        <Panel position="bottom-right" className="mb-32 mr-4 pointer-events-none opacity-50">
             <div className="text-[10px] font-mono text-gray-600 border border-white/5 px-2 py-1 rounded-full bg-black/40 uppercase tracking-widest">
                 {viewMode === 'analysis' ? 'Mind Map' : viewMode === 'management' ? 'Timeline View' : 'Calendar Grid'}
             </div>
        </Panel>

        <Controls className="mb-24 ml-4" showInteractive={false} />
        
        <MiniMap 
            className="mb-24 mr-4" 
            maskColor="rgba(2, 4, 8, 0.8)"
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
});
