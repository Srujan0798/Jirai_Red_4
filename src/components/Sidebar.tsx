
import React from 'react';
import { ViewMode } from '../types';
import { Network, KanbanSquare, CalendarRange, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onOpenSettings }) => {
  
  const NavItem = ({ view, icon: Icon, label }: { view: ViewMode, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => onChangeView(view)}
        className="group relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all duration-300"
      >
        {/* Active Glow Background */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-500 ${isActive ? 'bg-[#FF4F5E] shadow-[0_0_25px_rgba(255,79,94,0.4)] scale-100 opacity-100' : 'scale-75 opacity-0 bg-white/5 group-hover:opacity-100 group-hover:scale-90'}`} />
        
        {/* Icon */}
        <Icon 
            size={20} 
            className={`relative z-10 transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-gray-500 group-hover:text-gray-200'}`} 
            strokeWidth={isActive ? 2.5 : 2}
        />
        
        {/* Floating Tooltip */}
        <div className="absolute left-full ml-5 px-3 py-1.5 glass-panel text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0 z-[999]">
          {label}
          {/* Arrow */}
          <div className="absolute top-1/2 right-full -mt-1 -mr-[1px] border-4 border-transparent border-r-white/10" />
        </div>
      </button>
    );
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-6">
      <div className="glass-panel p-2 rounded-2xl flex flex-col gap-2 shadow-2xl border-white/5">
        <NavItem view='analysis' icon={Network} label="Analysis Mode" />
        <NavItem view='management' icon={KanbanSquare} label="Timeline Mode" />
        <NavItem view='workflow' icon={CalendarRange} label="Calendar Mode" />
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1" />
        
        <button 
            onClick={onOpenSettings}
            className="group relative flex items-center justify-center w-12 h-12 rounded-xl"
        >
             <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100" />
             <Settings size={20} className="relative z-10 text-gray-500 group-hover:text-white transition-colors duration-300 group-hover:rotate-90" />
             <div className="absolute left-full ml-5 px-3 py-1.5 glass-panel text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0 z-[999]">
                Settings
            </div>
        </button>
      </div>
    </div>
  );
};
