
import React, { useState, useRef, useEffect } from 'react';
import { Undo2, Redo2, Upload, Download, CalendarRange, CalendarDays, LayoutTemplate, Trash2, Copy, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { ViewMode, CalendarView } from '../types';
import { SearchBar } from './SearchBar';
import { useUserStore } from '../stores/userStore';

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
    onClearSelection,
    onOpenTemplates
}) => {
    const hasSelection = selectedNodeIds.length > 0;
    const { profile } = useUserStore();
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Re-trigger settings event for app to catch
    const openSettings = () => {
        const event = new CustomEvent('open-settings');
        window.dispatchEvent(event);
        setProfileOpen(false);
    };

    return (
        <>
            {/* === ZONE 1: BRAND & SEARCH (TOP LEFT) === */}
            <div className="fixed top-6 left-6 z-50 pointer-events-none select-none flex items-center gap-3">
                <div className="pointer-events-auto bg-[#181B21]/90 backdrop-blur-xl border border-[#2D313A]/80 shadow-2xl rounded-2xl p-3 flex items-center gap-3 transition-transform hover:scale-105 hover:border-[#FF4F5E]/20 group hidden sm:flex">
                    <div className="text-2xl transform group-hover:rotate-12 transition-transform duration-300 filter drop-shadow-lg">⚓</div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-white text-sm tracking-tight">Jirai</span>
                        <span className="text-[9px] text-gray-500 font-mono">v1.3</span>
                    </div>
                </div>
                <div className="pointer-events-auto">
                    <SearchBar />
                </div>
            </div>

            {/* === ZONE 2: MODE & CONTEXT TOOLS (TOP CENTER) === */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                <div className="pointer-events-auto bg-[#181B21]/90 backdrop-blur-xl border border-[#2D313A]/80 shadow-2xl rounded-2xl p-1.5 flex items-center gap-2 transition-all hover:border-[#FF4F5E]/20">
                    
                    {/* Calendar Controls */}
                    {viewMode === 'workflow' && setCalendarView && (
                        <div className="flex bg-black/40 rounded-xl p-1">
                            <button 
                                onClick={() => setCalendarView('WEEK')}
                                className={`p-2 rounded-lg transition-all ${calendarView === 'WEEK' ? 'bg-[#FF4F5E] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                title="Week View"
                            >
                                <CalendarRange size={16} />
                            </button>
                            <button 
                                onClick={() => setCalendarView('MONTH')}
                                className={`p-2 rounded-lg transition-all ${calendarView === 'MONTH' ? 'bg-[#FF4F5E] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                title="Month View"
                            >
                                <CalendarDays size={16} />
                            </button>
                        </div>
                    )}
                    
                    {/* Selection Controls */}
                    {hasSelection && (
                        <div className="flex items-center gap-1 animate-in fade-in duration-300">
                             <div className="text-xs font-mono text-gray-500 px-2">{selectedNodeIds.length} selected</div>
                             <div className="h-6 w-px bg-[#2D313A]" />
                             <button onClick={onDuplicate} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="Duplicate">
                                <Copy size={16} />
                             </button>
                             <button onClick={onDelete} className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors" title="Delete">
                                <Trash2 size={16} />
                             </button>
                        </div>
                    )}

                </div>
            </div>

            {/* === ZONE 3: PROFILE & GLOBAL TOOLS (TOP RIGHT) === */}
            <div className="fixed top-6 right-6 z-50 pointer-events-none flex gap-3">
                <div className="pointer-events-auto bg-[#181B21]/90 backdrop-blur-xl border border-[#2D313A]/80 shadow-2xl rounded-2xl p-1.5 flex items-center gap-1 transition-all hover:border-[#FF4F5E]/20">
                    <button onClick={onUndo} disabled={pastLength === 0} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl disabled:opacity-30 transition-colors" title="Undo (Ctrl+Z)">
                        <Undo2 size={18} />
                    </button>
                    <button onClick={onRedo} disabled={futureLength === 0} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl disabled:opacity-30 transition-colors" title="Redo (Ctrl+Shift+Z)">
                        <Redo2 size={18} />
                    </button>
                    <div className="h-6 w-px bg-[#2D313A] mx-1" />
                    <button onClick={onOpenTemplates} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="Templates">
                        <LayoutTemplate size={18} />
                    </button>
                    <button onClick={onImport} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="Import JSON">
                        <Upload size={18} />
                    </button>
                    <button onClick={onExport} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors" title="Export Workspace">
                        <Download size={18} />
                    </button>
                </div>

                {/* User Profile Dropdown */}
                <div ref={profileRef} className="pointer-events-auto relative">
                    <button 
                        onClick={() => setProfileOpen(!isProfileOpen)}
                        className="bg-[#181B21]/90 backdrop-blur-xl border border-[#2D313A]/80 shadow-2xl rounded-2xl p-1.5 pl-2 flex items-center gap-2 hover:border-[#FF4F5E]/30 transition-all h-full"
                    >
                        <span className="text-xs font-medium text-white hidden lg:block max-w-[100px] truncate">{profile.name}</span>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF4F5E] to-purple-600 overflow-hidden border border-white/10">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                                    {profile.name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-[#181B21] border border-[#2D313A] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                            <div className="p-3 border-b border-[#2D313A]">
                                <p className="text-xs font-bold text-white">{profile.name}</p>
                                <p className="text-[10px] text-gray-500 truncate">{profile.email || 'Set your email in settings'}</p>
                            </div>
                            <div className="p-1">
                                <button onClick={openSettings} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                                    <User size={14} /> Profile
                                </button>
                                <button onClick={openSettings} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                                    <Settings size={14} /> Settings
                                </button>
                            </div>
                            <div className="p-1 border-t border-[#2D313A]">
                                <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                    <LogOut size={14} /> Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
