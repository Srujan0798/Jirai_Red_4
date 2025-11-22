
import React from 'react';
import { ViewMode } from '../types';
import { Network, LayoutList, Calendar, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onOpenSettings }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: ViewMode, icon: any, label: string }) => (
    <button
      onClick={() => onChangeView(view)}
      className={`
        relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all duration-300 group
        ${currentView === view 
          ? 'bg-jirai-accent text-white shadow-[0_0_20px_rgba(255,79,94,0.4)] scale-110' 
          : 'text-gray-400 hover:text-white hover:bg-white/10'
        }
      `}
    >
      <Icon size={20} strokeWidth={currentView === view ? 2.5 : 2} />
      
      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-2 py-1 bg-[#181B21] border border-[#2D313A] text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none backdrop-blur-md translate-x-[-10px] group-hover:translate-x-0 duration-200 z-[999]">
        {label}
      </div>
    </button>
  );

  return (
    <div id="sidebar-nav" className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 pointer-events-none hidden sm:flex">
      <div className="pointer-events-auto bg-[#181B21]/80 backdrop-blur-xl border border-[#2D313A]/80 p-2 rounded-2xl shadow-2xl flex flex-col gap-2 items-center transition-transform hover:scale-105 hover:border-[#FF4F5E]/20">
        
        <NavItem view='analysis' icon={Network} label="Analysis Mode" />
        <NavItem view='management' icon={LayoutList} label="Timeline Mode" />
        <NavItem view='workflow' icon={Calendar} label="Calendar Mode" />
        
        <div className="w-8 h-px bg-[#2D313A]/80 my-1" />
        
        <button 
            onClick={onOpenSettings}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-colors group relative"
        >
             <Settings size={20} />
             <div className="absolute left-full ml-4 px-2 py-1 bg-[#181B21] border border-[#2D313A] text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none backdrop-blur-md translate-x-[-10px] group-hover:translate-x-0 duration-200 z-[999]">
                Settings
            </div>
        </button>

      </div>
    </div>
  );
};
