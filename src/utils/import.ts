
import { BaseNode, BaseEdge } from '../types';
import { readFile } from './fileHelpers';

export interface ImportResult {
  nodes: BaseNode[];
  edges: BaseEdge[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateWorkspaceJSON = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) return false;
  return true;
};

export const importFromJSON = async (file: File): Promise<ImportResult> => {
  const content = await readFile(file);
  let data;
  try {
    data = JSON.parse(content);
  } catch {
    throw new Error('Invalid JSON file');
  }

  if (!validateWorkspaceJSON(data)) {
    throw new Error('Invalid Jirai workspace format');
  }

  return {
    nodes: data.nodes,
    edges: data.edges
  };
};
