
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useSearch, FilterStatus, FilterType } from '../hooks/useSearch';
import { Z_INDEX } from '../constants';

interface SearchBarProps {
  isOverlay?: boolean;
  onClose?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ isOverlay = false, onClose }) => {
  const { 
    query, setQuery, 
    statusFilter, setStatusFilter, 
    typeFilter, setTypeFilter,
    results, focusResult, clearSearch 
  } = useSearch();
  
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setShowFilters(false);
      }
    };
    if (!isOverlay) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOverlay]);
  
  useEffect(() => {
    if (isOverlay) {
        inputRef.current?.focus();
    }
  }, [isOverlay]);


  const handleResultClick = (nodeId: string) => {
    focusResult(nodeId);
    setIsFocused(false);
    if(onClose) onClose();
  };

  const SearchInput = () => (
    <div className={`flex items-center bg-[#181B21] border border-[#2D313A] rounded-lg transition-all w-full ${isFocused || isOverlay ? 'ring-1 ring-[#FF4F5E] border-[#FF4F5E]' : 'sm:w-64'}`}>
      <Search size={16} className="ml-3 text-gray-500" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="Search nodes..."
        className="flex-1 bg-transparent border-none text-sm text-white px-2 py-2 focus:outline-none placeholder-gray-600"
      />
      {query && (
        <button onClick={clearSearch} className="p-1 text-gray-500 hover:text-white">
          <X size={14} />
        </button>
      )}
      {!isOverlay && (
        <button onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border-l border-[#2D313A] hover:bg-[#2D313A] rounded-r-lg transition-colors ${statusFilter !== 'all' || typeFilter !== 'all' ? 'text-[#FF4F5E]' : 'text-gray-500'}`}>
          <Filter size={14} />
        </button>
      )}
    </div>
  );

  const ResultsDropdown = () => (
    <div className={`absolute top-full left-0 right-0 mt-2 bg-[#181B21] border border-[#2D313A] rounded-lg shadow-2xl z-[60] max-h-80 overflow-y-auto custom-scrollbar ${isOverlay ? 'static bg-transparent border-none shadow-none mt-4' : ''}`}>
      <div className="p-2 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
        Found {results.length} nodes
      </div>
      {results.map(node => (
        <button key={node.id} onClick={() => handleResultClick(node.id)}
            className="w-full text-left p-3 hover:bg-[#2D313A] border-b border-[#2D313A]/50 last:border-0 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white truncate">{node.title}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#0F1115] text-gray-400 border border-[#2D313A] uppercase">{node.type}</span>
          </div>
          {node.description && <p className="text-xs text-gray-500 truncate">{node.description}</p>}
        </button>
      ))}
    </div>
  );
  
  if (isOverlay) {
    return (
        <div className="search-overlay animate-in fade-in">
            <div className="flex items-center gap-4 w-full max-w-2xl mx-auto">
                <div className="flex-1"><SearchInput /></div>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-sm">Cancel</button>
            </div>
            <div className="w-full max-w-2xl mx-auto mt-4 overflow-y-auto custom-scrollbar">
                {results.length > 0 ? <ResultsDropdown /> : <div className="text-center text-gray-500 pt-8">Search for nodes by title or description.</div>}
            </div>
        </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <SearchInput />
      {(isFocused && results.length > 0) && <ResultsDropdown />}
    </div>
  );
};
