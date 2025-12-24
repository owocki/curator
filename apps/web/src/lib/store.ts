import { create } from 'zustand';
import type { Strategy } from '@/types';

interface StrategyStore {
  strategies: Strategy[];
  setStrategies: (strategies: Strategy[]) => void;
  addStrategy: (strategy: Strategy) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStrategyStore = create<StrategyStore>((set) => ({
  strategies: [],
  setStrategies: (strategies) => set({ strategies }),
  addStrategy: (strategy) =>
    set((state) => ({ strategies: [...state.strategies, strategy] })),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

interface UIStore {
  isFundModalOpen: boolean;
  selectedStrategy: Strategy | null;
  openFundModal: (strategy: Strategy) => void;
  closeFundModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isFundModalOpen: false,
  selectedStrategy: null,
  openFundModal: (strategy) => set({ isFundModalOpen: true, selectedStrategy: strategy }),
  closeFundModal: () => set({ isFundModalOpen: false, selectedStrategy: null }),
}));
