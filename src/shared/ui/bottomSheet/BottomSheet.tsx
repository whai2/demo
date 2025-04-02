import { createPortal } from "react-dom";
import { create } from "zustand";

import { ReactComponent as CloseIcon } from "@/shared/assets/close.svg";

import styled from "styled-components";

function BottomSheet({ children }: { children: React.ReactNode }) {
  const { portalElement } = useBottomSheetPortal();

  if (!portalElement) return null;

  return createPortal(
    <>
      <S.Wrapper>{children}</S.Wrapper>
      <S.BackDrop />
    </>,
    portalElement
  );
}

export default BottomSheet;

interface BottomSheetPortalStore {
  portalElement: HTMLElement | null;
  setPortalElement: (element: HTMLElement | null) => void;
}

export const useBottomSheetPortal = create<BottomSheetPortalStore>((set) => ({
  portalElement: null,
  setPortalElement: (element) => set({ portalElement: element }),
}));

const S = {
  Wrapper: styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    overflow: hidden;
    z-index: 1000;
  `,

  Container: styled.div`
    display: flex;
    bottom: 0;
    padding: 20px;
    width: 340px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 14px;
    border-radius: 8px;
    background: ${({ theme }) => theme.components?.backgroundColor ?? "#fff"};
    z-index: 1000;
    animation: slide-up 0.5s ease-out forwards;
    @keyframes slide-up {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  `,

  BackDrop: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.5);
  `,

  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;
  `,

  Title: styled.div`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    color: #090909;
    text-overflow: ellipsis;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    opacity: 0;
    animation: fade-in 0.5s ease-out forwards;

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,

  CloseIcon: styled(CloseIcon)`
    cursor: pointer;
    width: 14px;
    height: 14px;
    overflow: visible;
    animation: fade-in 0.5s ease-out forwards;
    color: #1e1e1e;

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
};
