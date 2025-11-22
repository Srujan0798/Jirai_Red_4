
import React, { useState } from 'react';
import { Menu, Search, X, Network, LayoutList, Calendar, ChevronDown } from 'lucide-react';
import { ViewMode } from '../types';

interface MobileHeaderProps {
  onMenuOpen: () => void;
  onSearchOpen: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuOpen, onSearchOpen, viewMode, setViewMode }) => {
  const [isViewSelectorOpen, setViewSelectorOpen] = useState(false);

  const viewOptions = [
    { id: 'analysis', label: 'Analysis', icon: Network },
    { id: 'management', label: 'Timeline', icon: LayoutList },
    { id: 'workflow', label: 'Calendar', icon: Calendar },
  ];

  const CurrentViewIcon = viewOptions.find(v => v.id === viewMode)?.icon || Network;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#181B21]/80 backdrop-blur-xl border-b border-[#2D313A] pt-safe">
      <div className="flex items-center justify-between h-16 px-4">
        <button onClick={onMenuOpen} className="p-2 -ml-2 text-gray-300">
          <Menu size={24} />
        </button>

        <div className="relative">
          <button 
            onClick={() => setViewSelectorOpen(!isViewSelectorOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
          >
            <CurrentViewIcon size={16} className="text-jirai-accent" />
            <span className="text-sm font-medium text-white capitalize">{viewMode}</span>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${isViewSelectorOpen ? 'rotate-180' : ''}`} />
          </button>
          {isViewSelectorOpen && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-[#1E2128] border border-[#2D313A] rounded-lg shadow-2xl p-2 animate-in fade-in zoom-in-95">
              {viewOptions.map(view => (
                <button
                  key={view.id}
                  onClick={() => {
                    setViewMode(view.id as ViewMode);
                    setViewSelectorOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded hover:bg-white/10 text-left text-sm text-gray-200"
                >
                  <view.icon size={16} className={viewMode === view.id ? 'text-jirai-accent' : 'text-gray-400'} />
                  {view.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button onClick={onSearchOpen} className="p-2 -mr-2 text-gray-300">
          <Search size={22} />
        </button>
      </div>
    </div>
  );
};
