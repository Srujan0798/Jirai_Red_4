
import React, { useCallback, useState, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider,
  OnMove,
  Connection,
  OnConnectStart,
  OnConnectEnd,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useNodesStore } from '../../stores/nodesStore';
import { useBoardStore } from '../../stores/boardStore';
import { BaseNodeComponent } from '../nodes/BaseNodeComponent';
import { BaseNode } from '../../types/node.types';

const nodeTypes = {
  topic: BaseNodeComponent,
  task: BaseNodeComponent,
  video: BaseNodeComponent,
  person: BaseNodeComponent,
  document: BaseNodeComponent,
  note: BaseNodeComponent,
  link: BaseNodeComponent,
  project: BaseNodeComponent,
  root: BaseNodeComponent,
};

function CanvasInner() {
  const { nodes, edges, updateNode, clearSelection, addEdge: addStoreEdge, addNode } = useNodesStore();
  const { currentBoard, setViewport, setZoom } = useBoardStore();
  const { project } = useReactFlow();
  
  // Viewport state for syncing custom headers
  const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });

  // Refs for connection handling
  const connectingNodeId = useRef<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- DATA PREP ---
  const reactFlowNodes: Node<BaseNode>[] = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node,
  }));

  // --- VISIBILITY IMPROVEMENT: EDGE STYLING ---
  const reactFlowEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.from,
    target: edge.to,
    animated: edge.style === 'dashed',
    style: { 
        stroke: edge.color || '#4A9EFF', 
        strokeWidth: Math.max(2, edge.weight || 2),
        opacity: edge.opacity || 1,
        strokeDasharray: edge.style === 'dashed' ? '5,5' : edge.style === 'dotted' ? '2,2' : undefined
    },
    label: edge.label,
    type: 'default' 
  }));
  
  // --- HANDLERS ---
  const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node<BaseNode>) => {
    updateNode(node.id, { position: node.position });

    // Smart Reschedule Logic (simplified for brevity)
    if (currentBoard?.mode === 'management') {
        // ... logic for updating dates based on column ...
    }
  }, [updateNode, currentBoard]);
  
  const onMove: OnMove = useCallback((_evt, viewport) => {
    setViewport(viewport.x, viewport.y);
    setZoom(viewport.zoom);
    setTransform(viewport);
  }, [setViewport, setZoom]);
  
  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // --- CONNECTION HANDLERS ---
  const onConnect = useCallback((params: Connection) => {
      if (params.source && params.target) {
          addStoreEdge({
              id: `e-${Date.now()}`,
              from: params.source,
              to: params.target,
              kind: 'solid',
              style: 'solid',
              weight: 2,
              opacity: 1
          });
      }
  }, [addStoreEdge]);

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback((event) => {
    if (!connectingNodeId.current || !wrapperRef.current) return;

    const targetIsPane = (event.target as Element).classList.contains('react-flow__pane');

    if (targetIsPane) {
        // Drop on canvas -> Create new node
        const { top, left } = wrapperRef.current.getBoundingClientRect();
        
        // Fallback for touch/mouse events
        const clientX = (event as MouseEvent).clientX || (event as TouchEvent).changedTouches?.[0]?.clientX;
        const clientY = (event as MouseEvent).clientY || (event as TouchEvent).changedTouches?.[0]?.clientY;
        
        if (clientX && clientY) {
             const position = project({
                x: clientX - left,
                y: clientY - top,
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
            
            addStoreEdge({
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
  }, [project, addNode, addStoreEdge]);

  // --- TIMELINE DATA ---
  const timelineDates = useMemo(() => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 60; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          dates.push(d);
      }
      return dates;
  }, []);

  // --- RENDER ---
  return (
    <div ref={wrapperRef} className="w-full h-full relative bg-slate-950">
      
      {/* === MANAGEMENT MODE LAYERS === */}
      {currentBoard?.mode === 'management' && (
          <>
            {/* Header Implementation */}
             <div className="absolute top-0 left-0 right-0 h-32 z-40 bg-[#14171d] border-b border-[#2D313A] shadow-2xl pointer-events-none overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full flex"
                    style={{ 
                        transform: `translateX(${transform.x}px) scale(${transform.zoom})`, 
                        transformOrigin: '0 0' 
                    }}
                >
                    <div className="shrink-0 w-[100px] h-full border-r border-[#2D313A]/50 bg-[#181b21] z-10 relative shadow-lg" />
                    {timelineDates.map((date, i) => (
                          <div key={i} className="shrink-0 w-[320px] h-full border-r border-[#2D313A]/30 flex flex-col items-center justify-end pb-4">
                               <span className="text-[13px] font-bold tracking-[0.2em] mb-2 uppercase font-mono text-gray-500">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                               <div className="text-gray-200 font-bold">{date.getDate()}</div>
                          </div>
                    ))}
                </div>
            </div>
            {/* Grid Lines */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                 <div 
                    className="absolute top-0 left-0 flex h-[5000px]"
                    style={{ 
                        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`, 
                        transformOrigin: '0 0' 
                    }}
                 >
                     <div className="shrink-0 w-[100px] h-full border-r border-[#2D313A] bg-[#0F1115]" />
                     {timelineDates.map((_, i) => (
                        <div key={i} className="shrink-0 w-[320px] border-r border-[#2D313A]/20 h-full" />
                     ))}
                 </div>
            </div>
          </>
      )}

      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        nodeTypes={nodeTypes}
        onNodeDragStop={onNodeDragStop}
        onMove={onMove}
        onPaneClick={onPaneClick}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={currentBoard ? { x: currentBoard.viewport.x, y: currentBoard.viewport.y, zoom: currentBoard.zoom } : { x: 0, y: 0, zoom: 1 }}
        className="z-10"
        connectionLineStyle={{ stroke: '#FF4F5E', strokeWidth: 2, strokeDasharray: '5,5' }}
      >
        {currentBoard?.mode === 'analysis' && (
            <Background color="#334155" gap={20} size={1} className="bg-slate-950" />
        )}
        <Controls className="bg-slate-800 border-slate-700 fill-white" />
        <MiniMap className="bg-slate-900 border-slate-700" nodeColor="#3b82f6" maskColor="rgba(15, 23, 42, 0.8)" />
      </ReactFlow>
    </div>
  );
}

export function MainCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
