
import { create } from 'zustand';
import { Board, ViewMode } from '../types/board.types';

interface BoardState {
  currentBoard: Board | null;
  
  // Actions
  setCurrentBoard: (board: Board) => void;
  createBoard: (title: string, mode: ViewMode) => void;
  switchMode: (mode: ViewMode) => void;
  setZoom: (zoom: number) => void;
  setViewport: (x: number, y: number) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  currentBoard: null,
  
  setCurrentBoard: (board) => set({ currentBoard: board }),

  createBoard: (title, mode) => set({
    currentBoard: {
      id: `board-${Date.now()}`,
      title,
      mode,
      orientation: 'horizontal',
      zoom: 1,
      viewport: { x: 0, y: 0 },
      preferences: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user',
      collaborators: []
    }
  }),

  switchMode: (mode) => set((state) => {
    if (state.currentBoard) {
      return { currentBoard: { ...state.currentBoard, mode } };
    }
    return {};
  }),
  
  setZoom: (zoom) => set((state) => {
    if (state.currentBoard) {
      return { currentBoard: { ...state.currentBoard, zoom } };
    }
    return {};
  }),
  
  setViewport: (x, y) => set((state) => {
    if (state.currentBoard) {
      return { currentBoard: { ...state.currentBoard, viewport: { x, y } } };
    }
    return {};
  }),
}));
