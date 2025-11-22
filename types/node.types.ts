
export type NodeType = 
  | 'topic' | 'task' | 'video' | 'link' 
  | 'person' | 'document' | 'note' | 'project' | 'root';

export type NodeStatus = 'todo' | 'in-progress' | 'done' | 'blocked';

export interface NodeVisual {
  color?: string;
  icon?: string;
  shape?: 'rounded-rect' | 'circle' | 'diamond';
  sizeMultiplier?: number;
  collapsed?: boolean;
  width?: number;
  height?: number;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeWorkflow {
  start?: string; // ISO Date
  end?: string;   // ISO Date
  allDay?: boolean;
  columnIndex?: number;
  durationMinutes?: number;
}

export interface NodeResource {
  id: string;
  type: 'link' | 'video' | 'file';
  url: string;
  title: string;
}

export interface NodeComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface BaseNode {
  id: string;
  type: NodeType;
  title: string;
  description?: string;
  visual: NodeVisual;
  position: NodePosition;
  workflow?: NodeWorkflow;
  tags?: string[];
  status?: NodeStatus;
  progress?: number;
  parentId?: string;
  childrenIds?: string[];
  
  // Auxiliary
  resources?: NodeResource[];
  comments?: NodeComment[];

  // Type Specific Data
  video?: {
    platform: 'youtube' | 'vimeo' | 'custom';
    videoId: string;
    url: string;
    thumbnailUrl?: string;
    durationSeconds?: number;
  };
  person?: {
    role?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    instagram?: string;
    notes?: string;
    avatar?: string;
  };
  task?: {
    checklist?: Array<{ id: string; text: string; done: boolean }>;
    estimatedMinutes?: number;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  };

  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}
