export * from './node.types';
export * from './edge.types';
export * from './board.types';
export * from './template.types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}
