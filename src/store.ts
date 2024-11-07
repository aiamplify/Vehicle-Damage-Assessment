import create from 'zustand';
import { persist } from 'zustand/middleware';
import type { Store } from './types';

export const useStore = create<Store>()(
  persist(
    (set) => ({
      reports: [],
      apiConfig: {},
      addReport: (report) =>
        set((state) => ({ reports: [report, ...state.reports] })),
      setApiConfig: (config) => set({ apiConfig: config }),
    }),
    {
      name: 'damage-assessment-storage',
    }
  )
);