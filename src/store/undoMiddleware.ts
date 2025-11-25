import { StateCreator, StoreMutatorIdentifier } from 'zustand';

type UndoRedoOptions = {
  limit?: number;
  exclude?: (string | RegExp)[];
  debounce?: number;
};

export interface UndoRedoState {
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  pastStates: any[];
  futureStates: any[];
}

type UndoRedo = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  initializer: StateCreator<T, Mps, Mcs>,
  options?: UndoRedoOptions
) => StateCreator<T, Mps, Mcs>;

export const undoMiddleware: UndoRedo = (config, options = {}) => (set, get, api) => {
  const limit = options.limit || 50;

  const debounce = options.debounce || 300;

  let past: any[] = [];
  let future: any[] = [];
  let timeout: any = null;
  let isUndoRedoAction = false;

  const undo = () => {
    const state = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    future = [state, ...future];
    past = newPast;
    
    isUndoRedoAction = true;
    // FIX: Cast `set` to `any` to resolve the complex union type error caused by multiple middlewares.
    (set as any)(previous, true); // Replace state
    isUndoRedoAction = false;
  };

  const redo = () => {
    const state = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    past = [...past, state];
    future = newFuture;

    isUndoRedoAction = true;
    // FIX: Cast `set` to `any` to resolve the complex union type error.
    (set as any)(next, true); // Replace state
    isUndoRedoAction = false;
  };

  const clearHistory = () => {
    past = [];
    future = [];
  };

  // Monkey patch the API to expose history
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).undo = undo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).redo = redo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).clearHistory = clearHistory;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).getPastStates = () => past;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api as any).getFutureStates = () => future;

  // FIX: Using a rest parameter `...args` is more robust for middleware that wraps `set`.
  // It avoids issues with TypeScript's overload resolution for Zustand's `set` function.
  return config(
// FIX: Reverted from `Parameters<typeof set>` to `any[]`. The `Parameters<T>` utility type does not work correctly with overloaded function signatures, which Zustand's `set` function has, causing a type mismatch. `any[]` correctly accepts all possible argument combinations.
    ((...args: any[]) => {
      const currentState = get();
      
      (set as any)(...args);
      
      if (isUndoRedoAction) return;

      const nextState = get();
      
      // Check if changes are excluded
      // Note: This is a simplified check. In a real robust middleware, 
      // we'd diff the changes against the exclude list.
      // For Jirai, we primarily care about nodes and edges.
      const changesImportant = 
        JSON.stringify((currentState as any).nodes) !== JSON.stringify((nextState as any).nodes) ||
        JSON.stringify((currentState as any).edges) !== JSON.stringify((nextState as any).edges);

      if (!changesImportant) return;

      // Debounce history push
      if (timeout) clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        past = [...past, currentState].slice(-limit);
        future = []; // Clear future on new action
      }, debounce);
    }) as any,
    get,
    api
  );
};