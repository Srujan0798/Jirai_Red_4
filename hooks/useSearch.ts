
import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { BaseNode } from '../types';

export type FilterStatus = 'all' | 'todo' | 'in-progress' | 'done' | 'blocked';
export type FilterType = 'all' | 'task' | 'topic' | 'video' | 'person' | 'project';

export const useSearch = () => {
  const { nodes, selectNode, setViewMode } = useStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [results, setResults] = useState<BaseNode[]>([]);

  useEffect(() => {
    if (!query && statusFilter === 'all' && typeFilter === 'all') {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    const filtered = nodes.filter(node => {
      const matchesQuery = !query || 
        node.title.toLowerCase().includes(lowerQuery) ||
        node.description?.toLowerCase().includes(lowerQuery) ||
        node.tags?.some(t => t.toLowerCase().includes(lowerQuery));

      const matchesStatus = statusFilter === 'all' || node.status === statusFilter;
      const matchesType = typeFilter === 'all' || node.type === typeFilter;

      return matchesQuery && matchesStatus && matchesType;
    });

    setResults(filtered);
  }, [query, statusFilter, typeFilter, nodes]);

  const focusResult = (nodeId: string) => {
    selectNode(nodeId);
    // Optional: Logic to pan view to node could go here if we had access to ReactFlow instance
  };

  const clearSearch = () => {
    setQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return {
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    results,
    focusResult,
    clearSearch
  };
};
