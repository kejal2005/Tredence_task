import type { StateCreator } from 'zustand';
import type { HistoryState, HistorySnapshot } from '@types-app/store';
import type { RootStore } from './index';

const MAX_HISTORY = 50;

export const createHistorySlice: StateCreator<
  RootStore,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  HistoryState
> = (set, get) => ({
  past:    [],
  future:  [],
  canUndo: false,
  canRedo: false,

  pushSnapshot: (snapshot: HistorySnapshot) =>
    set(
      (state) => {
        // Cap history at MAX_HISTORY entries
        const past = [...state.past, snapshot].slice(-MAX_HISTORY);
        state.past    = past;
        state.future  = [];          // new action clears redo stack
        state.canUndo = past.length > 1;
        state.canRedo = false;
      },
      false,
      'history/pushSnapshot'
    ),

  undo: () => {
    const { past, future } = get();
    // Need at least 2 snapshots: current + one to go back to
    if (past.length < 2) return null;

    const current  = past[past.length - 1];
    const previous = past[past.length - 2];
    const newPast  = past.slice(0, -1);

    set(
      (state) => {
        state.past    = newPast;
        state.future  = [current, ...future].slice(0, MAX_HISTORY);
        state.canUndo = newPast.length > 1;
        state.canRedo = true;
      },
      false,
      'history/undo'
    );

    return previous;
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return null;

    const next       = future[0];
    const newFuture  = future.slice(1);

    set(
      (state) => {
        state.past    = [...past, next].slice(-MAX_HISTORY);
        state.future  = newFuture;
        state.canUndo = true;
        state.canRedo = newFuture.length > 0;
      },
      false,
      'history/redo'
    );

    return next;
  },

  clearHistory: () =>
    set(
      (state) => {
        state.past    = [];
        state.future  = [];
        state.canUndo = false;
        state.canRedo = false;
      },
      false,
      'history/clear'
    ),
});
