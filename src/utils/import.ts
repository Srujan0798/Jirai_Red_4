
import { BaseNode, BaseEdge } from '../types';
import { readFile } from './fileHelpers';
import { parseFromTOON } from './toon';

export interface ImportResult {
  nodes: BaseNode[];
  edges: BaseEdge[];
}

export const validateWorkspaceJSON = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) return false;
  return true;
};

export const importWorkspace = async (file: File): Promise<ImportResult> => {
  const content = await readFile(file);
  
  // Strategy: Check file extension or sniff content
  const isTOON = file.name.endsWith('.toon') || content.startsWith('# TOON');

  if (isTOON) {
      try {
          return parseFromTOON(content);
      } catch (e) {
          throw new Error('Invalid TOON file format');
      }
  }

  // Default to JSON
  let data;
  try {
    data = JSON.parse(content);
  } catch (e) {
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

// Legacy export for backward compatibility if needed, though we prefer importWorkspace
export const importFromJSON = importWorkspace;
