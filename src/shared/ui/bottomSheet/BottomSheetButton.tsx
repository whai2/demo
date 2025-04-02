import styled from "styled-components";

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
      <S.Title>{children}</S.Title>
    </S.Button>
  );
}

export default BottomSheetButton;

const S = {
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
      background: #d60039;
    }

    background: ${({ $isSelected }) => ($isSelected ? "#FF2D55" : "#999")};
  `,

  Title: styled.div`
    color: #fff;

    font-family: var(--Body-Medium-Font, Roboto);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: var(--Body-Medium-Line-Height, 20px);
    letter-spacing: var(--Body-Medium-Tracking, 0.25px);
  `,
};
