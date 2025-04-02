import { create } from "zustand";

interface QuizOpenState {
  isQuizOpen: boolean;
  setIsQuizOpen: (isQuizOpen: boolean) => void;
}

export const useQuizOpen = create<QuizOpenState>((set) => ({
  isQuizOpen: false,
  setIsQuizOpen: (isQuizOpen) => set({ isQuizOpen }),
}));
