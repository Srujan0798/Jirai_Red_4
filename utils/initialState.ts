
import { BaseNode, BaseEdge } from '../types';

export const getInitialState = (): { nodes: BaseNode[], edges: BaseEdge[] } => {
  const rootId = 'root-1';
  const child1 = 'child-1';
  const child2 = 'child-2';

  const nodes: BaseNode[] = [
    {
        id: rootId,
        type: 'root',
        title: 'Jirai Workspace',
        description: 'Double-click a node to edit it!',
        visual: { color: '#FF4F5E', shape: 'circle', sizeMultiplier: 1.2, width: 180, height: 180 },
        position: { x: 0, y: 0 },
        tags: [], status: 'in-progress', progress: 0, childrenIds: []
    },
    {
        id: child1,
        type: 'topic',
        title: 'Double-click the canvas',
        description: 'This will create a new node for you to edit.',
        visual: { color: '#4A9EFF', shape: 'rounded-rect', sizeMultiplier: 1 },
        position: { x: -300, y: 180 },
        tags: [], status: 'todo', progress: 0, childrenIds: []
    },
    {
        id: child2,
        type: 'task',
        title: 'Ask the AI Assistant',
        description: 'Use the bar below to generate a mind map. Try "Plan a trip to Tokyo"',
        visual: { color: '#10B981', shape: 'rounded-rect', sizeMultiplier: 1 },
        position: { x: 300, y: 180 },
        tags: [], status: 'todo', progress: 0, childrenIds: [],
        workflow: { start: new Date().toISOString() }
    }
  ];

  const edges: BaseEdge[] = [
    { id: 'e1', from: rootId, to: child1, kind: 'solid', style: 'solid', weight: 2, opacity: 1, color: '#3b82f6' },
    { id: 'e2', from: rootId, to: child2, kind: 'solid', style: 'solid', weight: 2, opacity: 1, color: '#10b981' },
  ];

  return { nodes, edges };
};
