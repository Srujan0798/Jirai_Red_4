
import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { useReactFlow } from 'reactflow';

export const useKeyboardShortcuts = () => {
  const [isHelpOpen, setHelpOpen] = useState(false);
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  
  const {
    undo,
    redo,
    copySelectedNodes,
    cutSelectedNodes,
    pasteNodes,
    deleteSelectedNodes,
    duplicateSelectedNodes,
    selectAll,
    clearSelection,
    addNode
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Ignore if user is typing in an input, textarea, or contenteditable
      if (
        target && (
          ['INPUT', 'TEXTAREA'].includes(target.tagName) ||
          target.isContentEditable
        )
      ) {
        // Allow Escape to blur input
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // --- HELP (Cmd+/) ---
      if (cmdKey && e.key === '/') {
        e.preventDefault();
        setHelpOpen(prev => !prev);
        return;
      }

      // --- COMMAND PALETTE HANDLED IN COMPONENT (Cmd+K) ---
      // We leave Cmd+K for the CommandPalette component event listener to handle globally

      // --- EDITING ---
      if (cmdKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copySelectedNodes();
        return;
      }

      if (cmdKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        cutSelectedNodes();
        return;
      }

      if (cmdKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        pasteNodes();
        return;
      }

      if (cmdKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelectedNodes();
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Prevent backspace from navigating back in some browsers
        if (e.key === 'Backspace') e.preventDefault();
        deleteSelectedNodes();
        return;
      }

      // --- SELECTION ---
      if (cmdKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAll();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        clearSelection();
        setHelpOpen(false);
        return;
      }

      // --- HISTORY ---
      if (cmdKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }
      // Windows Redo (Ctrl+Y)
      if (cmdKey && e.key.toLowerCase() === 'y' && !isMac) {
         e.preventDefault();
         redo();
         return;
      }

      // --- VIEW ---
      if (cmdKey && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
        return;
      }

      if (cmdKey && e.key === '-') {
        e.preventDefault();
        zoomOut();
        return;
      }

      if (cmdKey && e.key === '0') {
        e.preventDefault();
        zoomTo(1);
        return;
      }

      // --- CREATION ---
      if (cmdKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const newNode = {
            id: `node-${Date.now()}`,
            type: 'topic' as const,
            title: 'New Topic',
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            visual: { shape: 'rounded-rect' as const, sizeMultiplier: 1 },
            status: 'todo' as const
        };
        addNode(newNode);
        return;
      }
      
      // Search focus
      if (cmdKey && e.key.toLowerCase() === 'f') {
          e.preventDefault();
          document.getElementById('assistant-input')?.focus();
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo, redo, copySelectedNodes, cutSelectedNodes, pasteNodes, 
    deleteSelectedNodes, duplicateSelectedNodes, selectAll, 
    clearSelection, addNode, zoomIn, zoomOut, zoomTo, fitView
  ]);

  return { isHelpOpen, toggleHelp: () => setHelpOpen(prev => !prev) };
};
