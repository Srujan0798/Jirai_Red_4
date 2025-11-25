
import dagre from '@dagrejs/dagre';
import { BaseNode, BaseEdge } from '../types';

export const getLayoutedElements = (nodes: BaseNode[], edges: BaseEdge[], direction = 'TB'): BaseNode[] => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction });
  g.setDefaultEdgeLabel(() => ({}));

  // Set nodes with fallback dimensions if visual properties are missing
  nodes.forEach((node) => {
    g.setNode(node.id, { 
        width: node.visual.width || 180, 
        height: node.visual.height || 100 
    });
  });

  // Set edges
  edges.forEach((edge) => {
    g.setEdge(edge.from, edge.to);
  });

  // Calculate layout
  dagre.layout(g);

  // Apply calculated positions back to nodes
  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        // Dagre gives center point, React Flow needs top-left
        x: nodeWithPosition.x - (node.visual.width || 180) / 2,
        y: nodeWithPosition.y - (node.visual.height || 100) / 2,
      },
    };
  });
};
