
import { BaseNode } from './node.types';

export interface NodeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'planning' | 'research' | 'personal' | 'custom';
  icon?: string; // Lucide icon name
  data: Partial<BaseNode>; // The node data to clone
  isCustom?: boolean;
}
