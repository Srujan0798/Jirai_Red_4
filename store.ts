
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect, 
  applyNodeChanges, 
  applyEdgeChanges, 
  Connection,
  NodeChange,
  EdgeChange
} from 'reactflow';
import { BaseNode, BaseEdge, ViewMode, LayoutPreference, CalendarView, NodeVisual } from './types';
import { reapplyLayout } from './services/geminiService';
import { LIMITS, STORAGE_KEYS } from './constants';
import { getInitialState } from './utils/initialState';

interface HistoryState {
  nodes: BaseNode[];
  edges: BaseEdge[];
}

interface AppState {
  nodes: BaseNode[];
  edges: BaseEdge[];
  viewMode: ViewMode;
  layoutPreference: LayoutPreference;
  calendarView: CalendarView;
  selectedNodeIds: string[];
  editingNodeId: string | null;
  clipboard: BaseNode[];
  
  past: HistoryState[];
  future: HistoryState[];
  
  // Actions
  setGraph: (nodes: BaseNode[], edges: BaseEdge[]) => void;
  resetWorkspace: () => void;
  updateNode: (id: string, updates: Partial<BaseNode>) => void;
  
  // React Flow Events
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  undo: () => void;
  redo: () => void;
  
  setViewMode: (mode: ViewMode) => void;
  setCalendarView: (view: CalendarView) => void;
  autoLayout: () => void;
  setLayoutPreference: (pref: LayoutPreference) => void;
  addEdge: (edge: BaseEdge) => void;
  addNode: (node: BaseNode) => void;
  deleteSelectedNodes: () => void;
  duplicateSelectedNodes: () => void;
  copySelectedNodes: () => void;
  cutSelectedNodes: () => void;
  pasteNodes: (position?: { x: number, y: number }) => void;
  selectAll: () => void;
  selectNode: (id: string, multi?: boolean) => void;
  setSelectedNodes: (ids: string[]) => void;
  clearSelection: () => void;
  setEditingNode: (id: string | null) => void;
  toggleTaskStatus: (id: string) => void;
}

// Helper to generate safe unique IDs
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const createHistoryEntry = (nodes: BaseNode[], edges: BaseEdge[]): HistoryState => ({
  nodes: JSON.parse(JSON.stringify(nodes)),
  edges: JSON.parse(JSON.stringify(edges)),
});

const withHistory = <T extends AppState>(fn: (state: T) => Partial<T>, set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => {
  const currentState = get();
  const historyEntry = createHistoryEntry(currentState.nodes, currentState.edges);
  const newPast = [...currentState.past, historyEntry].slice(-LIMITS.MAX_HISTORY);
  
  const newState = fn(currentState);
  
  set({
    ...newState,
    past: newPast,
    future: [],
  });
};

export const useStore = create<AppState>()(
  persist(
      (set, get) => ({
        nodes: [],
        edges: [],
        viewMode: 'analysis',
        layoutPreference: 'ORGANIC',
        calendarView: 'WEEK',
        selectedNodeIds: [],
        editingNodeId: null,
        clipboard: [],
        past: [],
        future: [],

        setGraph: (nodes, edges) => set({ nodes, edges, selectedNodeIds: [], past: [], future: [] }),
        
        resetWorkspace: () => {
            const { nodes, edges } = getInitialState();
            set({ nodes, edges, selectedNodeIds: [], editingNodeId: null, past: [], future: [] });
        },

        onNodesChange: (changes: NodeChange[]) => {
          const isHistoryChange = changes.some(c => 
            (c.type === 'position' && !c.dragging) || c.type === 'remove' || c.type === 'dimensions'
          );
        
          const updater = (state: AppState): Partial<AppState> => {
            const rfNodes = state.nodes.map(n => ({
              id: n.id,
              data: n,
              position: n.position,
              type: n.type,
              // Important: pass visual dims to ReactFlow
              width: n.visual.width,
              height: n.visual.height,
              selected: state.selectedNodeIds.includes(n.id),
            }));
        
            const nextRfNodes = applyNodeChanges(changes, rfNodes);
            
            const nextNodes = state.nodes
              .map(n => {
                const rfNode = nextRfNodes.find(rn => rn.id === n.id);
                if (!rfNode) return null; 
                
                // Sync back dimensions if React Flow updates them
                const visualUpdate: Partial<NodeVisual> = {};
                if (rfNode.width != null) visualUpdate.width = rfNode.width;
                if (rfNode.height != null) visualUpdate.height = rfNode.height;

                return {
                  ...n,
                  position: rfNode.position,
                  visual: { ...n.visual, ...visualUpdate },
                };
              })
              .filter((n): n is BaseNode => n !== null);
            
            const nextSelectedIds = nextRfNodes.filter(n => n.selected).map(n => n.id);
            
            return { nodes: nextNodes, selectedNodeIds: nextSelectedIds };
          };
        
          if (isHistoryChange) {
            withHistory(updater, set, get);
          } else {
            set(updater);
          }
        },

        onEdgesChange: (changes: EdgeChange[]) => {
            withHistory(state => {
                const rfEdges = state.edges.map(e => ({
                    id: e.id,
                    source: e.from,
                    target: e.to,
                }));
                const nextRfEdges = applyEdgeChanges(changes, rfEdges);
                const nextEdgeIds = new Set(nextRfEdges.map(e => e.id));
                
                return {
                    edges: state.edges.filter(e => nextEdgeIds.has(e.id))
                };
            }, set, get);
        },

        onConnect: (connection: Connection) => {
            if (!connection.source || !connection.target) return;
            const newEdge: BaseEdge = {
                id: generateId(),
                from: connection.source,
                to: connection.target,
                kind: 'solid',
                style: 'solid',
                weight: 2,
                opacity: 1,
                color: '#4A9EFF'
            };
            withHistory((state) => ({ edges: [...state.edges, newEdge] }), set, get);
        },

        updateNode: (id, updates) => withHistory((state) => ({
          nodes: state.nodes.map((n) => n.id === id ? { ...n, ...updates } : n)
        }), set, get),

        setViewMode: (mode) => {
            const { nodes, edges, layoutPreference } = get();
            // Recalculate layout whenever mode changes
            const layoutNodes = reapplyLayout(nodes, edges, mode, layoutPreference);
            set({ viewMode: mode, nodes: layoutNodes });
        },

        setCalendarView: (view) => set({ calendarView: view }),

        autoLayout: () => withHistory((state) => {
          const layoutNodes = reapplyLayout(state.nodes, state.edges, state.viewMode, state.layoutPreference);
          return { nodes: layoutNodes };
        }, set, get),

        setLayoutPreference: (pref) => {
            const { nodes, edges, viewMode } = get();
            const layoutNodes = reapplyLayout(nodes, edges, viewMode, pref);
            set({ layoutPreference: pref, nodes: layoutNodes });
        },

        addEdge: (edge) => withHistory((state) => ({ edges: [...state.edges, edge] }), set, get),

        addNode: (node) => withHistory((state) => ({
          nodes: [...state.nodes, node],
          editingNodeId: node.id,
          selectedNodeIds: [node.id]
        }), set, get),

        deleteSelectedNodes: () => {
          if (get().selectedNodeIds.length === 0) return;
          withHistory((state) => {
            const newNodes = state.nodes.filter(n => !state.selectedNodeIds.includes(n.id));
            const newEdges = state.edges.filter(e => !state.selectedNodeIds.includes(e.from) && !state.selectedNodeIds.includes(e.to));
            return {
                nodes: newNodes,
                edges: newEdges,
                selectedNodeIds: [],
                editingNodeId: null
            };
          }, set, get);
        },

        duplicateSelectedNodes: () => {
          if (get().selectedNodeIds.length === 0) return;
          withHistory((state) => {
            const selected = state.nodes.filter(n => state.selectedNodeIds.includes(n.id));
            const newNodes = selected.map(n => ({
                ...JSON.parse(JSON.stringify(n)),
                id: generateId(),
                position: { x: n.position.x + 50, y: n.position.y + 50 },
                title: `${n.title} (Copy)`
            }));
            return {
                nodes: [...state.nodes, ...newNodes],
                selectedNodeIds: newNodes.map(n => n.id)
            };
          }, set, get);
        },

        copySelectedNodes: () => set((state) => {
            const selected = state.nodes.filter(n => state.selectedNodeIds.includes(n.id));
            return { clipboard: JSON.parse(JSON.stringify(selected)) };
        }),

        cutSelectedNodes: () => {
            if (get().selectedNodeIds.length === 0) return;
            withHistory((state) => {
                const selected = state.nodes.filter(n => state.selectedNodeIds.includes(n.id));
                const newNodes = state.nodes.filter(n => !state.selectedNodeIds.includes(n.id));
                const newEdges = state.edges.filter(e => !state.selectedNodeIds.includes(e.from) && !state.selectedNodeIds.includes(e.to));
                return {
                    clipboard: JSON.parse(JSON.stringify(selected)),
                    nodes: newNodes,
                    edges: newEdges,
                    selectedNodeIds: []
                };
            }, set, get);
        },

        pasteNodes: (position) => {
            if (get().clipboard.length === 0) return;
            withHistory((state) => {
              const newNodes = state.clipboard.map((n, i) => ({
                  ...JSON.parse(JSON.stringify(n)),
                  id: generateId(),
                  position: position ? { x: position.x + i*10, y: position.y + i*10 } : { x: n.position.x + 50, y: n.position.y + 50 },
              }));
              return {
                  nodes: [...state.nodes, ...newNodes],
                  selectedNodeIds: newNodes.map(n => n.id)
              };
            }, set, get);
        },

        selectAll: () => set(state => ({ selectedNodeIds: state.nodes.map(n => n.id) })),
        
        undo: () => {
            const { past } = get();
            if (past.length === 0) return;
            
            const previous = past[past.length - 1];
            const newPast = past.slice(0, -1);
            
            set((state) => ({
              ...previous,
              past: newPast,
              future: [createHistoryEntry(state.nodes, state.edges), ...state.future],
              selectedNodeIds: [],
              editingNodeId: null
            }));
        },
    
        redo: () => {
            const { future } = get();
            if (future.length === 0) return;

            const next = future[0];
            const newFuture = future.slice(1);
            
            set((state) => ({
              ...next,
              past: [...state.past, createHistoryEntry(state.nodes, state.edges)],
              future: newFuture
            }));
        },

        selectNode: (id, multi = false) => set((state) => {
            if (multi) {
                return { selectedNodeIds: state.selectedNodeIds.includes(id) 
                    ? state.selectedNodeIds.filter(nid => nid !== id) 
                    : [...state.selectedNodeIds, id] };
            }
            return { selectedNodeIds: [id] };
        }),

        setSelectedNodes: (ids) => set({ selectedNodeIds: ids }),
        clearSelection: () => set({ selectedNodeIds: [], editingNodeId: null }),
        setEditingNode: (id) => set({ editingNodeId: id }),
        
        toggleTaskStatus: (id) => withHistory((state) => ({
            nodes: state.nodes.map(n => n.id === id ? { ...n, status: n.status === 'done' ? 'todo' : 'done' } : n)
        }), set, get),

      }),
    {
      name: STORAGE_KEYS.PERSISTENCE,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        viewMode: state.viewMode,
      }),
    }
  )
);
