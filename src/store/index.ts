import { create } from 'zustand';
import { type PersistOptions, createJSONStorage, persist } from 'zustand/middleware';

import { processRecordFromStorage, createMemberSlice, MemberSlice } from './memberSlice';

export type State = MemberSlice;

const storage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Ignore remove errors
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // Ignore write errors
    }
  },
};

const persistOptions: PersistOptions<MemberSlice> = {
  name: 'member-storage',
  partialize: (state) => state,
  onRehydrateStorage: () => (state) => {
    if (state) {
      state.records = state.records.map(processRecordFromStorage);
    }
  },
  storage:
    import.meta.env.STORAGE === 'local-storage'
      ? createJSONStorage(() => storage)
      : createJSONStorage(() => ({
          setItem: () => {},
          getItem: () => null,
          removeItem: () => {},
        })),
};

export const useStore = create<MemberSlice>()(
  persist(
    (...args) => ({
      ...createMemberSlice(...args),
    }),
    persistOptions,
  ),
);
