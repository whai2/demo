import { ReactComponent as LoadingDot } from "../../assets/loadingDot.svg";

import styled from "styled-components";

function Loading() {
  return (
    <S.Loading>
      <S.LoadingDot />
      <S.LoadingDot />
      <S.LoadingDot />
    </S.Loading>
  );
}

export default Loading;

const S = {
  Loading: styled.div`
    display: flex;
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
    gap: 3px;
  `,

  LoadingDot: styled(LoadingDot)`
    width: 4px;
    height: 4px;
    color: #e5e5e5;

    animation: colorChange 0.6s infinite;

    @keyframes colorChange {
      0%,
      33.33% {
        fill: #898989;
      }
      33.34%,
      66.66% {
        fill: currentColor;
      }
      66.67%,
      100% {
        fill: currentColor;
      }
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  `,
};
