export * from './types/node.types';
export * from './types/edge.types';
export * from './types/board.types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}