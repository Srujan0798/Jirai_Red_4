
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
        description: 'Central Hub',
        visual: { color: '#FF4F5E', shape: 'circle', sizeMultiplier: 1.2 },
        position: { x: 0, y: 0 },
        tags: [], status: 'in-progress', progress: 0, childrenIds: []
    },
    {
        id: child1,
        type: 'topic',
        title: 'Analysis Mode',
        description: 'Mind Maps',
        visual: { color: '#4A9EFF', shape: 'rounded-rect', sizeMultiplier: 1 },
        position: { x: -250, y: 150 },
        tags: [], status: 'todo', progress: 0, childrenIds: []
    },
    {
        id: child2,
        type: 'task',
        title: 'Workflow Mode',
        description: 'Timeline & Calendar',
        visual: { color: '#10B981', shape: 'rounded-rect', sizeMultiplier: 1 },
        position: { x: 250, y: 150 },
        tags: [], status: 'todo', progress: 0, childrenIds: [],
        workflow: { start: new Date().toISOString() }
    }
  ];

  const edges: BaseEdge[] = [
    { id: 'e1', from: rootId, to: child1, kind: 'solid', style: 'solid', weight: 2, opacity: 1, color: '#4A9EFF' },
    { id: 'e2', from: rootId, to: child2, kind: 'solid', style: 'solid', weight: 2, opacity: 1, color: '#10B981' },
    { id: 'e3', from: child1, to: child2, kind: 'related', style: 'dashed', weight: 2, opacity: 0.6, color: '#888888' }
  ];

  return { nodes, edges };
};
