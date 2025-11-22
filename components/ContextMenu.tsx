
import React, { useEffect, useRef } from 'react';
import { useNodesStore } from '../stores/nodesStore';
import { useTemplateStore } from '../stores/templateStore';
import { ContextMenuState } from '../types';
import { BaseNode, NodePosition } from '../types/node.types';
import { Scissors, Copy, ClipboardPaste, Trash2, CopyPlus, Star, PlusCircle } from 'lucide-react';

interface ContextMenuProps {
  menu: ContextMenuState | null;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ menu, onClose }) => {
  const { 
      copySelectedNodes, 
      cutSelectedNodes, 
      pasteNodes, 
      deleteSelectedNodes, 
      duplicateSelectedNodes, 
      addNode
  } = useNodesStore();
  const { addCustomTemplate } = useTemplateStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!menu) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };
  
  const isNodeMenu = menu.type === 'node';
  const node = isNodeMenu ? menu.data as BaseNode : null;
  const position = !isNodeMenu ? menu.data as NodePosition : { x: 0, y: 0 };
  
  return (
    <div
      ref={ref}
      className="fixed z-[100] bg-[#1E2128]/90 backdrop-blur-md border border-[#2D313A] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      style={{ top: menu.top, left: menu.left }}
    >
      <div className="flex flex-col text-sm text-gray-200">
        {isNodeMenu && node && (
            <>
                <button onClick={() => handleAction(cutSelectedNodes)} className="flex items-center gap-3 px-4 py-2 hover:bg-[#FF4F5E] hover:text-white transition-colors text-left"><Scissors size={14} /> Cut</button>
                <button onClick={() => handleAction(copySelectedNodes)} className="flex items-center gap-3 px-4 py-2 hover:bg-[#FF4F5E] hover:text-white transition-colors text-left"><Copy size={14} /> Copy</button>
                <button onClick={() => handleAction(() => pasteNodes())} className="flex items-center gap-3 px-4 py-2 hover:bg-[#FF4F5E] hover:text-white transition-colors text-left"><ClipboardPaste size={14} /> Paste</button>
                <div className="h-px bg-[#2D313A] my-1" />
                <button onClick={() => handleAction(duplicateSelectedNodes)} className="flex items-center gap-3 px-4 py-2 hover:bg-[#FF4F5E] hover:text-white transition-colors text-left"><CopyPlus size={14} /> Duplicate</button>
                <button onClick={() => handleAction(() => addCustomTemplate(node, node.title))} className="flex items-center gap-3 px-4 py-2 hover:bg-[#FF4F5E] hover:text-white transition-colors text-left"><Star size={14} /> Save as Template</button>
                <div className="h-px bg-[#2D313A] my-1" />
                <button onClick={() => handleAction(deleteSelectedNodes)} className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-left"><Trash2 size={14} /> Delete</button>
            </>
        )}
        {!isNodeMenu && (
             <>
                <button onClick={() => handleAction(() => addNode({
                    id: `node-${Date.now()}`,
                    type: 'topic',
                    title: 'New Topic',
                    position,
                    visual: { shape: 'rounded-rect', sizeMultiplier: 1 },
                    status: 'todo'
                }))} className="flex items-center gap-3 px-4 py-2 hover:bg-[#FF4F5E] hover:text-white transition-colors text-left"><PlusCircle size={14} /> New Node</button>
                <button onClick={() => handleAction(() => pasteNodes(position))} className="flex items-center gap-3 px-4 py-2 hover:bg-[#FF4F5E] hover:text-white transition-colors text-left"><ClipboardPaste size={14} /> Paste Here</button>
            </>
        )}
      </div>
    </div>
  );
};
