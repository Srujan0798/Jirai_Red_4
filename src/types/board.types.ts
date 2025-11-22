
import { BaseNode, NodePosition } from './node.types';

export type ViewMode = 'analysis' | 'management' | 'workflow';
export type LayoutPreference = 'ORGANIC' | 'HORIZONTAL' | 'VERTICAL';
export type CalendarView = 'WEEK' | 'MONTH';

export interface Board {
  id: string;
  title: string;
  mode: ViewMode;
  orientation: 'horizontal' | 'vertical';
  zoom: number;
  viewport: { x: number; y: number };
  preferences: {
    preferredLanguage?: string;
    contentMode?: 'video' | 'text' | 'mixed';
    videosPerTopic?: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  collaborators: string[];
}

export interface ContextMenuState {
  id: string;
  top: number;
  left: number;
  type: 'node' | 'pane';
  data: BaseNode | NodePosition;
}
