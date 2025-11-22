
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStore } from '../store';
import { BaseNode, BaseEdge } from '../types';

// Mock Persistence
vi.mock('zustand/middleware', () => ({
  persist: (config: any) => (set: any, get: any, api: any) => config(set, get, api),
  createJSONStorage: () => ({ getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() }),
}));

describe('Jirai Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.setGraph([], []);
    });
  });

  it('should add a node', () => {
    const { result } = renderHook(() => useStore());
    const newNode: BaseNode = {
      id: '1',
      type: 'topic',
      title: 'Test Node',
      position: { x: 0, y: 0 },
      visual: { shape: 'circle' }
    };

    act(() => {
      result.current.addNode(newNode);
    });

    expect(result.current.nodes).toHaveLength(1);
    expect(result.current.nodes[0].title).toBe('Test Node');
    // Should auto-select and edit new node
    expect(result.current.selectedNodeIds).toContain('1');
    expect(result.current.editingNodeId).toBe('1');
  });

  it('should delete selected nodes and connected edges', () => {
    const { result } = renderHook(() => useStore());
    
    const node1: BaseNode = { id: '1', type: 'topic', title: 'N1', position: {x:0,y:0}, visual: {} };
    const node2: BaseNode = { id: '2', type: 'topic', title: 'N2', position: {x:10,y:10}, visual: {} };
    const edge: BaseEdge = { id: 'e1', from: '1', to: '2', kind: 'solid', style: 'solid', weight: 1, opacity: 1 };

    act(() => {
      result.current.setGraph([node1, node2], [edge]);
      result.current.selectNode('1');
      result.current.deleteSelectedNodes();
    });

    expect(result.current.nodes).toHaveLength(1);
    expect(result.current.nodes[0].id).toBe('2');
    expect(result.current.edges).toHaveLength(0); // Edge should be removed
  });

  it('should handle undo/redo', () => {
    const { result } = renderHook(() => useStore());
    const node: BaseNode = { id: '1', type: 'topic', title: 'Original', position: {x:0,y:0}, visual: {} };

    act(() => {
      result.current.addNode(node);
    });
    expect(result.current.nodes).toHaveLength(1);

    act(() => {
      result.current.updateNode('1', { title: 'Updated' });
    });
    expect(result.current.nodes[0].title).toBe('Updated');

    act(() => {
      result.current.undo();
    });
    expect(result.current.nodes[0].title).toBe('Original');

    act(() => {
      result.current.redo();
    });
    expect(result.current.nodes[0].title).toBe('Updated');
  });
});
