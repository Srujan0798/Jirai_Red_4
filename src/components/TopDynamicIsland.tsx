
import React from 'react';
import { Undo2, Redo2, Upload, Download, CalendarRange, CalendarDays, LayoutTemplate, Trash2, Copy } from 'lucide-react';
import { ViewMode, CalendarView } from '../types';
import { SearchBar } from './SearchBar';

interface TopDynamicIslandProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    calendarView?: CalendarView;
    setCalendarView?: (view: CalendarView) => void;
    onAutoLayout: () => void;
    selectedNodeIds: string[];
    pastLength: number;
    futureLength: number;
    onUndo: () => void;
    onRedo: () => void;
    onImport: () => void;
    onExport: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onClearSelection: () => void;
    onOpenTemplates: () => void;
}

export const TopDynamicIsland: React.FC<TopDynamicIslandProps> = ({
    viewMode,
    calendarView,
    setCalendarView,
    selectedNodeIds,
    pastLength,
    futureLength,
    onUndo,
    onRedo,
    onImport,
    onExport,
    onDuplicate,
    onDelete,
    onOpenTemplates
}) => {
    const hasSelection = selectedNodeIds.length > 0;

    const IconBtn = ({ onClick, icon: Icon, disabled, title, danger }: any) => (
        <button 
            onClick={onClick} 
            disabled={disabled} 
            title={title}
            className={`p-2.5 rounded-xl transition-all duration-200 glass-button
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'}
                ${danger ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'}
            `}
        >
            <Icon size={18} strokeWidth={2} />
        </button>
    );

    return (
        <>
            {/* === LEFT: BRAND & SEARCH === */}
            <div className="fixed top-6 left-6 z-50 flex items-start gap-4 pointer-events-none">
                <div className="pointer-events-auto glass-panel rounded-2xl p-1.5 pr-5 flex items-center gap-3 group cursor-pointer transition-all hover:border-white/20 hidden sm:flex">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4F5E] to-[#D63F4C] flex items-center justify-center shadow-lg shadow-red-900/20 text-white font-bold text-xl group-hover:rotate-6 transition-transform duration-500">
                        <span>J</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-sm leading-none tracking-wide group-hover:text-glow transition-all">Jirai</span>
                        <span className="text-[10px] text-gray-500 font-mono mt-1">v2.0</span>
                    </div>
                </div>
                
                <div className="pointer-events-auto shadow-2xl">
                    <SearchBar />
                </div>
            </div>

            {/* === CENTER: CONTEXT ACTIONS === */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-3">
                {/* Calendar View Toggles */}
                {viewMode === 'workflow' && setCalendarView && (
                    <div className="pointer-events-auto glass-panel rounded-full p-1 flex items-center gap-1">
                        {(['WEEK', 'MONTH'] as const).map((view) => (
                            <button 
                                key={view}
                                onClick={() => setCalendarView(view)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all duration-300 ${
                                    calendarView === view 
                                    ? 'bg-[#FF4F5E] text-white shadow-[0_0_15px_rgba(255,79,94,0.4)]' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Selection Toolbar */}
                {hasSelection && (
                    <div className="pointer-events-auto glass-panel rounded-2xl p-1.5 flex items-center gap-1 animate-in slide-in-from-top-4 duration-300">
                         <div className="px-3 flex flex-col border-r border-white/10 mr-1">
                            <span className="text-[9px] text-gray-500 font-mono uppercase">Selected</span>
                            <span className="text-xs font-bold text-white">{selectedNodeIds.length} Nodes</span>
                         </div>
                         <IconBtn onClick={onDuplicate} icon={Copy} title="Duplicate" />
                         <IconBtn onClick={onDelete} icon={Trash2} title="Delete" danger />
                    </div>
                )}
            </div>

            {/* === RIGHT: GLOBAL TOOLS === */}
            <div className="fixed top-6 right-6 z-50 pointer-events-none hidden sm:block">
                <div className="pointer-events-auto glass-panel rounded-2xl p-1.5 flex items-center gap-1">
                    <IconBtn onClick={onUndo} disabled={pastLength === 0} icon={Undo2} title="Undo" />
                    <IconBtn onClick={onRedo} disabled={futureLength === 0} icon={Redo2} title="Redo" />
                    
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    
                    <IconBtn onClick={onOpenTemplates} icon={LayoutTemplate} title="Templates" />
                    <IconBtn onClick={onImport} icon={Upload} title="Import" />
                    <IconBtn onClick={onExport} icon={Download} title="Export" />
                </div>
            </div>
        </>
    );
};
