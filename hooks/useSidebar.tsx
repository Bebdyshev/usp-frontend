import { create } from 'zustand';

interface SidebarStore {
  isMinimized: boolean;
  toggle: () => void;
}

export const useSidebar = create<SidebarStore>((set: (fn: (state: SidebarStore) => Partial<SidebarStore>) => void) => ({
  isMinimized: false,
  toggle: () => set((state: SidebarStore) => ({ isMinimized: !state.isMinimized }))
}));
