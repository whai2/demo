import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PopUpOpenState {
  isOpen: boolean;
  isFirstOpen: boolean;
  lastClosedTime: number | null;
  setOpen: () => void;
  setClose: () => void;
  setToggle: () => void;
}

const usePopUpOpen = create<PopUpOpenState>()(
  persist(
    (set) => ({
      isOpen: false,
      isFirstOpen: true,
      lastClosedTime: null,
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
    }),
    {
      name: "popup-storage", // 로컬 스토리지에 저장될 키 이름
      partialize: (state) => ({
        lastClosedTime: state.lastClosedTime,
        isFirstOpen: state.isFirstOpen,
      }), // 저장할 상태 필드만 선택
    }
  )
);

export default usePopUpOpen;
