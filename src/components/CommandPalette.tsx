
import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useStore } from '../store';
import { 
  Search, Plus, FileText, Download, Upload, Trash2, Copy, 
  Network, LayoutList, Calendar, RefreshCw 
} from 'lucide-react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export const CommandPalette = () => {
  // Use local state for open/close, but trigger via global event or prop if needed
  // For now, we'll rely on the event listener in this component or the hook
  const [open, setOpen] = useState(false);
  
  const { 
    addNode, 
    viewMode, 
    setViewMode, 
    selectAll, 
    clearSelection,
    deleteSelectedNodes,
    resetWorkspace
  } = useStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const run = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  return (
    <Command.Dialog 
        open={open} 
        onOpenChange={setOpen} 
        label="Global Command Menu"
    >
      <div className="flex items-center border-b border-[#2D313A] px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-gray-400" />
        <Command.Input placeholder="Type a command or search..." />
      </div>
      
      <Command.List className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Actions">
          <Command.Item onSelect={() => run(() => addNode({
              id: `node-${Date.now()}`,
              type: 'topic',
              title: 'New Topic',
              position: { x: 0, y: 0 }, // Center logic ideally handled by GraphEngine
              visual: { shape: 'rounded-rect', sizeMultiplier: 1 },
              status: 'todo'
          }))}>
            <Plus /> New Topic
          </Command.Item>
          <Command.Item onSelect={() => run(() => addNode({
              id: `task-${Date.now()}`,
              type: 'task',
              title: 'New Task',
              position: { x: 50, y: 50 },
              visual: { shape: 'rounded-rect', sizeMultiplier: 1 },
              status: 'todo'
          }))}>
            <FileText /> New Task
          </Command.Item>
        </Command.Group>

        <Command.Group heading="View">
          <Command.Item onSelect={() => run(() => setViewMode('analysis'))}>
            <Network /> Analysis Mode
          </Command.Item>
          <Command.Item onSelect={() => run(() => setViewMode('management'))}>
            <LayoutList /> Timeline Mode
          </Command.Item>
          <Command.Item onSelect={() => run(() => setViewMode('workflow'))}>
            <Calendar /> Workflow Mode
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Selection">
          <Command.Item onSelect={() => run(selectAll)}>
            <Copy /> Select All
          </Command.Item>
          <Command.Item onSelect={() => run(clearSelection)}>
            <Trash2 /> Clear Selection
          </Command.Item>
          <Command.Item onSelect={() => run(deleteSelectedNodes)}>
            <Trash2 className="text-red-400" /> Delete Selected
          </Command.Item>
        </Command.Group>

        <Command.Separator />

        <Command.Group heading="System">
          <Command.Item onSelect={() => run(() => {
              if(confirm('Reset Workspace?')) resetWorkspace();
          })}>
            <RefreshCw /> Reset Workspace
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
};
