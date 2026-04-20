import { create } from 'zustand';

interface UIState {
  isShortcutOpen: boolean;
  openShortcuts:  () => void;
  closeShortcuts: () => void;
  toggleShortcuts: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isShortcutOpen:  false,
  openShortcuts:   () => set({ isShortcutOpen: true }),
  closeShortcuts:  () => set({ isShortcutOpen: false }),
  toggleShortcuts: () => set((s) => ({ isShortcutOpen: !s.isShortcutOpen })),
}));
