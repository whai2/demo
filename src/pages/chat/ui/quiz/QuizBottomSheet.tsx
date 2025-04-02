import { ReactComponent as CloseIcon } from "@/shared/assets/close.svg";

import styled from "styled-components";

function QuizBottomSheet({ handleClose }: { handleClose: () => void }) {
  return (
    <S.Container>
      <S.Header>
        <S.Title>강의 퀴즈</S.Title>
        <S.CloseIcon onClick={handleClose} />
      </S.Header>
      <BottomSheetButton isSelected={true} handleClick={() => {}}>
        제출
      </BottomSheetButton>
    </S.Container>
  );
}

export default QuizBottomSheet;

function BottomSheetButton({
  children,
  isSelected,
  handleClick,
}: {
  children: React.ReactNode;
  isSelected: boolean;
  handleClick: () => void;
}) {
  return (
    <S.Button onClick={() => handleClick()} $isSelected={isSelected}>
      <S.ButtonTitle>{children}</S.ButtonTitle>
    </S.Button>
  );
}

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
    border-radius: 0 0 8px 8px;
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

  Button: styled.button<{ $isSelected: boolean }>`
    display: flex;
    height: 40px;
    padding: 7px;
    justify-content: center;
    align-items: center;
    gap: 9px;
    align-self: stretch;
    border: none;
    border-radius: 8px;
    &:hover {
      background: #51A1CA;
    }

    background: ${({ $isSelected }) => ($isSelected ? "#51A1CA" : "#999")};
  `,

  ButtonTitle: styled.div`
    color: #fff;

    font-family: var(--Body-Medium-Font, Roboto);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: var(--Body-Medium-Line-Height, 20px);
    letter-spacing: var(--Body-Medium-Tracking, 0.25px);
  `,
};
