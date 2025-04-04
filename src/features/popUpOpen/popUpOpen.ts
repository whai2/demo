import { create } from "zustand";

interface PopUpOpenState {
  isOpen: boolean;
  isFirstOpen: boolean;
  lastClosedTime: number | null;
  isFristModalOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
  setToggle: () => void;
  setFirstModalOpen: () => void;
  setFirstModalClose: () => void;
}

const usePopUpOpen = create<PopUpOpenState>()((set) => ({
  isOpen: false,
  isFirstOpen: true,
  lastClosedTime: null,
  isFristModalOpen: false,
  setOpen: () => {
    set((state) => ({
      isOpen: true,
      isFirstOpen: state.isFirstOpen ? false : state.isFirstOpen,
    }));
  },
  setClose: () => {
    const currentTime = Date.now();
    set({ isOpen: false, lastClosedTime: currentTime });
  },
  setToggle: () => {
    set((state) => {
      // isOpen이 true에서 false로 변경될 때만 시간 기록
      if (state.isOpen) {
        return {
          isOpen: false,
          isFirstOpen: state.isFirstOpen ? false : state.isFirstOpen,
          lastClosedTime: Date.now(),
        };
      }
      return {
        isOpen: true,
        isFirstOpen: state.isFirstOpen ? false : state.isFirstOpen,
      };
    });
  },
  setFirstModalOpen: () => {
    set({ isFristModalOpen: true });
  },
  setFirstModalClose: () => {
    set({ isFristModalOpen: false });
  },
}));

export default usePopUpOpen;
