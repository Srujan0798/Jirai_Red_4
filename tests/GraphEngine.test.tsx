
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GraphEngine } from '../components/GraphEngine';
import { BaseNode, BaseEdge } from '../types';

describe('GraphEngine', () => {
  const mockNodes: BaseNode[] = [
    { id: '1', type: 'topic', title: 'Node 1', position: { x: 100, y: 100 }, visual: { width: 100, height: 50 } },
    { id: '2', type: 'task', title: 'Node 2', position: { x: 300, y: 300 }, visual: { width: 100, height: 50 }, status: 'todo' }
  ];
  const mockEdges: BaseEdge[] = [
    { id: 'e1', from: '1', to: '2', kind: 'solid', style: 'solid', weight: 1, opacity: 1 }
  ];

  const defaultProps = {
    nodes: mockNodes,
    edges: mockEdges,
    onNodeMove: vi.fn(),
    onNodeResize: vi.fn(),
    onNodeClick: vi.fn(),
    onCreateEdge: vi.fn(),
    onCreateNode: vi.fn(),
    onToggleTask: vi.fn(),
    viewMode: 'analysis' as const
  };

  it('renders nodes correctly', () => {
    render(<GraphEngine {...defaultProps} />);
    expect(screen.getByText('Node 1')).toBeInTheDocument();
    expect(screen.getByText('Node 2')).toBeInTheDocument();
  });

  it('handles node clicks', () => {
    render(<GraphEngine {...defaultProps} />);
    const nodeElement = screen.getByText('Node 1').closest('div');
    // The parent div of content has the click handler
    fireEvent.click(nodeElement!.parentElement!); 
    expect(defaultProps.onNodeClick).toHaveBeenCalled();
  });

  it('handles node double click to create node', () => {
    render(<GraphEngine {...defaultProps} />);
    const container = screen.getByText('Node 1').closest('.overflow-hidden.relative.bg-[#0F1115]');
    fireEvent.doubleClick(container!);
    expect(defaultProps.onCreateNode).toHaveBeenCalled();
  });
});
