
import { Connection, Edge } from 'reactflow';

export const isValidConnection = (connection: Connection, edges: Edge[]) => {
  // Prevent self-loops
  if (connection.source === connection.target) return false;

  // Prevent duplicate edges
  const duplicate = edges.find(
    e => e.source === connection.source && e.target === connection.target
  );
  if (duplicate) return false;

  return true;
};
