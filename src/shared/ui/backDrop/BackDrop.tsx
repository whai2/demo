import styled from "styled-components";

function BackDrop({ onClose }: { onClose: () => void }) {
  return <S.BackDrop onClick={onClose} />;
}

export function TransparentBackDrop({ onClose, transparent }: { onClose: () => void, transparent?: boolean }) {
  return (
    <S.TransparentBackDrop
      onClick={(event) => {
        event.stopPropagation();
        onClose();
      }}
      $transparent={transparent}
    />
  );
}

export function ImageBackDrop({ onClose }: { onClose: () => void }) {
  return <S.ImageBackDrop onClick={onClose} />;
}

export default BackDrop;

const S = {
  BackDrop: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  `,

  TransparentBackDrop: styled.div<{ $transparent?: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1001; // 1000은 채팅 전체
    border-radius: 10px;
    background-color: ${({ $transparent }) => $transparent ? "transparent" : "rgba(72, 72, 72, 0.5)"};
  `,

  ImageBackDrop: styled.div`
    position: fixed;
    top: -100px;
    right: -100px;
    width: 10000px;
    height: 10000px;
    background-color: rgba(72, 72, 72, 0.5);
    z-index: 1001;
  `,
};
