
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NodeDetailsPanel } from '../components/NodeDetailsPanel';
import { BaseNode } from '../types';

describe('NodeDetailsPanel', () => {
  const mockNode: BaseNode = { 
    id: '1', 
    type: 'topic', 
    title: 'Test Node', 
    description: 'Desc',
    position: { x: 0, y: 0 }, 
    visual: {} 
  };
  
  const mockUpdate = vi.fn();
  const mockClose = vi.fn();

  it('does not render when node is null', () => {
    const { container } = render(<NodeDetailsPanel node={null} onUpdateNode={mockUpdate} onClose={mockClose} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders node details', () => {
    render(<NodeDetailsPanel node={mockNode} onUpdateNode={mockUpdate} onClose={mockClose} />);
    expect(screen.getByDisplayValue('Test Node')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Desc')).toBeInTheDocument();
  });

  it('updates title on change', () => {
    render(<NodeDetailsPanel node={mockNode} onUpdateNode={mockUpdate} onClose={mockClose} />);
    const input = screen.getByDisplayValue('Test Node');
    fireEvent.change(input, { target: { value: 'New Title' } });
    expect(mockUpdate).toHaveBeenCalledWith('1', { title: 'New Title' });
  });

  it('calls onClose when close button is clicked', () => {
    render(<NodeDetailsPanel node={mockNode} onUpdateNode={mockUpdate} onClose={mockClose} />);
    const closeBtn = screen.getByRole('button', { name: '' }); // X icon button usually has no text, usually found by testid or svg
    // Simplified finding by just clicking the first button which is usually X in the header
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); 
    expect(mockClose).toHaveBeenCalled();
  });
});
