
import React, { useState, useEffect } from 'react';
import { X, Download, Upload, Settings, BookOpen, Star, Github } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onOpenImport, onOpenExport, onOpenSettings }) => {
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsRendered(false);
    }
  };
  
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  if (!isRendered) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none md:hidden">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div 
        onAnimationEnd={handleAnimationEnd}
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#181B21] border-r border-[#2D313A] shadow-2xl flex flex-col pt-safe pb-safe pointer-events-auto ${isOpen ? 'slide-in' : 'slide-out'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2D313A]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚓</span>
            <span className="font-bold text-white text-lg">Jirai</span>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          <MenuItem icon={Upload} label="Import Workspace" onClick={() => handleAction(onOpenImport)} />
          <MenuItem icon={Download} label="Export Workspace" onClick={() => handleAction(onOpenExport)} />
          <MenuItem icon={Settings} label="Settings" onClick={() => handleAction(onOpenSettings)} />
          <div className="h-px bg-[#2D313A] my-2" />
          <MenuItem icon={BookOpen} label="Replay Tutorial" onClick={() => {
              localStorage.removeItem('jirai_tutorial_completed');
              window.location.reload();
          }} />
        </div>

        <div className="p-4 border-t border-[#2D313A] text-center">
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white flex items-center justify-center gap-2">
                <Github size={14} /> View on GitHub
            </a>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
        <Icon size={18} />
        <span className="font-medium text-sm">{label}</span>
    </button>
);
