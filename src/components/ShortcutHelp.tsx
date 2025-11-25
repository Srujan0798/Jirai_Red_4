
import React, { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutHelp: React.FC<ShortcutHelpProps> = ({ isOpen, onClose }) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const modifier_unused = isMac ? 'Cmd' : 'Ctrl';
  const modifier_unusedSymbol = isMac ? '⌘' : 'Ctrl';

  const SHORTCUTS = [
    { category: 'Editing', items: [
        { keys: [modifier_unusedSymbol, 'C'], label: 'Copy' },
        { keys: [modifier_unusedSymbol, 'X'], label: 'Cut' },
        { keys: [modifier_unusedSymbol, 'V'], label: 'Paste' },
        { keys: [modifier_unusedSymbol, 'D'], label: 'Duplicate' },
        { keys: ['Del'], label: 'Delete' },
        { keys: [modifier_unusedSymbol, 'Z'], label: 'Undo' },
        { keys: [modifier_unusedSymbol, 'Shift', 'Z'], label: 'Redo' },
    ]},
    { category: 'Navigation', items: [
        { keys: [modifier_unusedSymbol, '+'], label: 'Zoom In' },
        { keys: [modifier_unusedSymbol, '-'], label: 'Zoom Out' },
        { keys: [modifier_unusedSymbol, '0'], label: 'Reset Zoom' },
        { keys: ['Space', 'Drag'], label: 'Pan Canvas' },
        { keys: [modifier_unusedSymbol, 'F'], label: 'Search / AI' },
    ]},
    { category: 'Creation', items: [
        { keys: [modifier_unusedSymbol, 'N'], label: 'New Node' },
        { keys: ['Dbl Click'], label: 'Edit Node' },
    ]},
    { category: 'Selection', items: [
        { keys: [modifier_unusedSymbol, 'A'], label: 'Select All' },
        { keys: ['Esc'], label: 'Clear Selection' },
        { keys: ['Shift', 'Click'], label: 'Multi Select' },
    ]}
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181B21] border border-[#2D313A] rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#2D313A] flex justify-between items-center bg-[#181B21]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF4F5E]/10 rounded-lg text-[#FF4F5E]">
                <Keyboard size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                <p className="text-sm text-gray-400">Master your workflow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-[#0F1115]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {SHORTCUTS.map((group) => (
                    <div key={group.category}>
                        <h3 className="text-xs font-bold text-[#FF4F5E] uppercase tracking-wider mb-4 flex items-center gap-2">
                            {group.category}
                            <div className="h-px flex-1 bg-[#2D313A]" />
                        </h3>
                        <div className="space-y-3">
                            {group.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                                    <div className="flex gap-1">
                                        {item.keys.map((k, idx) => (
                                            <kbd key={idx} className="px-2 py-1 bg-[#181B21] border border-[#2D313A] rounded text-[10px] font-mono text-gray-400 min-w-[24px] text-center shadow-sm">
                                                {k}
                                            </kbd>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2D313A] bg-[#181B21] text-center">
            <p className="text-xs text-gray-500">
                Press <kbd className="px-1.5 py-0.5 bg-[#0F1115] border border-[#2D313A] rounded text-[10px] mx-1">{modifier_unusedSymbol}</kbd> + <kbd className="px-1.5 py-0.5 bg-[#0F1115] border border-[#2D313A] rounded text-[10px] mx-1">/</kbd> to toggle this modal
            </p>
        </div>
      </div>
    </div>
  );
};
