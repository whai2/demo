import { create } from "zustand";
import { persist } from "zustand/middleware";

import ROUTES from "./route";

interface NavigateState {
  currentPage: (typeof ROUTES)[keyof typeof ROUTES];
  setCurrentPage: (page: (typeof ROUTES)[keyof typeof ROUTES]) => void;
  isFrontGenerate: boolean | null | undefined;
  params: string | null;
  lastParams: string | null;
  setParams: (params: string | null) => void;
  setIsFrontGenerate: (isFrontGenerate: boolean | null | undefined) => void;
  reset: () => void;
}

const initialState = {
  currentPage: ROUTES.HOME,
  params: null,
  lastParams: null,
  isFrontGenerate: null,
  history: [],
};

const useNavigate = create<
  NavigateState & { history: string[]; goBack: () => void }
>()(
  persist(
    (set) => ({
      currentPage: ROUTES.HOME,
      setCurrentPage: (page) => {
        const pageString = typeof page === "function" ? page("") : page;

        let params = null;
        let isFrontGenerate = null;

        if (typeof pageString === "string") {
          const sessionIdMatch = pageString.split("sessionId=")[1];
          if (sessionIdMatch) {
            params = sessionIdMatch.split("&")[0];
            isFrontGenerate =
              pageString.split("isFrontGenerate=")[1] === "true";
          }
        }

        set((state) => {
          const isSameAsLast =
            state.history[state.history.length - 1] === pageString;
          return {
            currentPage: page,
            params,
            lastParams: params,
            isFrontGenerate,
            history: isSameAsLast
              ? state.history
              : [...state.history, pageString],
          };
        });
      },
      params: null,
      lastParams: null,
      isFrontGenerate: null,
      setParams: (params) => set({ params }),
      history: [],
      goBack: () =>
        set((state) => {
          const newHistory = [...state.history];
          newHistory.pop();

          const previousPage = newHistory[newHistory.length - 1] || ROUTES.HOME;
          const params =
            typeof previousPage === "string"
              ? previousPage.split("sessionId=")[1]?.split("&")[0] || null
              : null;
          const isFrontGenerate =
            typeof previousPage === "string"
              ? previousPage.split("isFrontGenerate=")[1] === "true"
              : null;

          return {
            currentPage: previousPage,
            params,
            isFrontGenerate,
            history: newHistory,
          };
        }),
      setIsFrontGenerate: (isFrontGenerate: boolean | null | undefined) =>
        set({ isFrontGenerate }),

      reset: () => set(initialState),
    }),
    {
      name: "navigate-store",
    }
  )
);

export default useNavigate;
