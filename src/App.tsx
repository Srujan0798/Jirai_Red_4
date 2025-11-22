

import React, { useEffect, useState } from 'react';
import { GraphEngine } from './components/GraphEngine';
import { AssistantBar } from './components/assistant/AssistantBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ExportImportDialog } from './components/ExportImportDialog';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { TopDynamicIsland } from './components/TopDynamicIsland';
import { TemplateSelector } from './components/TemplateSelector';
import { useBoardStore } from './stores/boardStore';
import { useNodesStore } from './stores/nodesStore';
import { NodeDetailsPanel } from './components/NodeDetailsPanel';
import { Sidebar } from './components/Sidebar';
import { SettingsPanel } from './components/SettingsPanel';
import { getInitialState } from './utils/initialState';

function App() {
  const { currentBoard, createBoard } = useBoardStore();
  const { 
    nodes, 
    setGraph,
    selectedNodeIds, 
    deleteSelectedNodes, 
    duplicateSelectedNodes,
    undo, 
    redo,
    past,
    future,
    updateNode,
    clearSelection,
    editingNodeId,
    setEditingNode,
    viewMode,
    setViewMode,
    calendarView,
    setCalendarView,
    autoLayout,
  } = useNodesStore();

  const [showDialog, setShowDialog] = useState(false);
  const [dialogTab, setDialogTab] = useState<'export' | 'import'>('export');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const editingNode = editingNodeId ? nodes.find(n => n.id === editingNodeId) || null : null;

  useEffect(() => {
    if (!currentBoard) {
      createBoard('My Workspace', 'analysis');
    }
    
    if (nodes.length === 0) {
      const { nodes: initialNodes, edges: initialEdges } = getInitialState();
      setGraph(initialNodes, initialEdges);
    }
  }, [currentBoard, createBoard, nodes.length, setGraph]);

  const handleOpenExport = () => {
    setDialogTab('export');
    setShowDialog(true);
  };

  const handleOpenImport = () => {
    setDialogTab('import');
    setShowDialog(true);
  };
  
  if (!currentBoard) return <div className="w-screen h-screen bg-[#0F1115] flex items-center justify-center text-white">Loading...</div>;
  
  return (
    <ErrorBoundary>
      <div className="w-screen h-screen bg-[#0F1115] flex flex-col overflow-hidden relative font-sans text-[#E0E0E0]">
        
        <OnboardingTutorial />

        <ExportImportDialog 
          isOpen={showDialog} 
          onClose={() => setShowDialog(false)} 
          initialTab={dialogTab} 
        />

        <TemplateSelector 
           isOpen={showTemplates}
           onClose={() => setShowTemplates(false)}
        />

        <SettingsPanel 
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />

        <TopDynamicIsland 
          viewMode={viewMode}
          setViewMode={setViewMode}
          calendarView={calendarView}
          setCalendarView={setCalendarView}
          onAutoLayout={autoLayout}
          selectedNodeIds={selectedNodeIds}
          pastLength={past.length}
          futureLength={future.length}
          onUndo={undo}
          onRedo={redo}
          onImport={handleOpenImport}
          onExport={handleOpenExport}
          onDuplicate={duplicateSelectedNodes}
          onDelete={deleteSelectedNodes}
  
          onClearSelection={clearSelection}
          onOpenTemplates={() => setShowTemplates(true)}
        />

        <Sidebar 
          currentView={viewMode} 
          onChangeView={setViewMode} 
          onOpenSettings={() => setShowSettings(true)}
        />
        
        <div className="absolute inset-0 z-0">
              <GraphEngine viewMode={viewMode} />
        </div>
        
        <AssistantBar />

        <NodeDetailsPanel 
          node={editingNode} 
          onClose={() => setEditingNode(null)} 
          onUpdateNode={(id, data) => updateNode(id, data)} 
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;