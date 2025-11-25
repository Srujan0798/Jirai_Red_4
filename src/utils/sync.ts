
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
// import { WebsocketProvider } from 'y-websocket'; // Uncomment for real-time server
import { useStore } from '../store';
import { BaseNode, BaseEdge } from '../types';

export const setupSync = (workspaceId: string = 'jirai-main') => {
  const ydoc = new Y.Doc();
  
  // Local persistence via IndexedDB
  // This enables offline support and crash recovery
  const indexeddbProvider = new IndexeddbPersistence(workspaceId, ydoc);
  
  // To enable real collaboration, you would connect a WebsocketProvider here
  // const wsProvider = new WebsocketProvider('wss://your-collab-server.com', workspaceId, ydoc);
  
  const yNodes = ydoc.getArray<BaseNode>('nodes');
  const yEdges = ydoc.getArray<BaseEdge>('edges');
  
  // Bidirectional sync
  // 1. Listen to Y.js changes and update Zustand
  yNodes.observe(() => {
    const newNodes = yNodes.toArray();
    // Avoid infinite loops by checking deep equality or relying on explicit user actions in a real app
    // For now, we assume this is an incoming remote change
    // useStore.getState().setGraph(newNodes, useStore.getState().edges); 
  });

  yEdges.observe(() => {
    const newEdges = yEdges.toArray();
    // useStore.getState().setGraph(useStore.getState().nodes, newEdges);
  });

  // 2. Function to push local changes to Y.js
  // This should be called by the store actions
  const syncLocalToRemote = (nodes: BaseNode[], edges: BaseEdge[]) => {
    ydoc.transact(() => {
      if (JSON.stringify(yNodes.toArray()) !== JSON.stringify(nodes)) {
          yNodes.delete(0, yNodes.length);
          yNodes.insert(0, nodes);
      }
      if (JSON.stringify(yEdges.toArray()) !== JSON.stringify(edges)) {
          yEdges.delete(0, yEdges.length);
          yEdges.insert(0, edges);
      }
    });
  };
  
  return { ydoc, yNodes, yEdges, provider: indexeddbProvider, syncLocalToRemote };
};
