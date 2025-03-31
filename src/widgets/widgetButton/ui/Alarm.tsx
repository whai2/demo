import { ReactComponent as AlarmCorner } from "@/shared/assets/alarmCorner.svg";

import styled from "styled-components";

function Alarm({
  title,
  isCallToAction,
  onClick,
}: {
  title: string;
  onClick: () => void;
  isCallToAction: boolean;
}) {
  const formattedTitle = title.replace(/\\n/g, "\n");

  return (
    <S.Container onClick={onClick}>
      <S.AlarmContainer>
        <S.AlarmCorner $isCallToAction={isCallToAction} />
      </S.AlarmContainer>
      <S.TextContainer $isCallToAction={isCallToAction}>
        <S.Text>{formattedTitle}</S.Text>
      </S.TextContainer>
    </S.Container>
  );
}

export default Alarm;

const S = {
  Container: styled.div`
    display: flex;
    position: fixed;

    top: ${({ theme }) => {
      const rawTop = theme.floatingButton?.position?.top;
      if (rawTop) {
        const numeric = parseInt(rawTop, 10);
        return isNaN(numeric) ? rawTop : `${numeric + 41}px`;
      }
      return "55px";
    }};
    right: ${({ theme }) => {
      const rawTop = theme.floatingButton?.position?.top;
      if (rawTop) {
        const numeric = parseInt(rawTop, 10);
        return isNaN(numeric) ? rawTop : `${numeric - 19}px`;
      }
      return "15px";
    }};
    left: ${({ theme }) => theme.floatingButton?.position?.left ?? ""};
    bottom: ${({ theme }) => theme.floatingButton?.position?.bottom ?? ""};

    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding-top: 10px;
    padding-right: 10px;
    cursor: pointer;
    animation: fadeOutInAlarm 8s forwards;

    @keyframes fadeOutInAlarm {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `,

  TextContainer: styled.div<{ $isCallToAction: boolean }>`
    display: flex;
    padding: 6px 12px;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    border-radius: var(--Radius-radiusSM, 8px);
    background: ${(props) => (props.$isCallToAction ? "#4072FF" : "#171B1F")};
    max-width: 300px;
  `,

  Text: styled.span`
    color: #fff;
    text-align: right;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
  `,

  AlarmContainer: styled.div`
    display: flex;
    padding: 0px 17px;
    align-items: flex-start;
    gap: 10px;
  `,

  AlarmCorner: styled(AlarmCorner)<{ $isCallToAction: boolean }>`
    path {
      color: ${(props) => (props.$isCallToAction ? "#4072FF" : "#171B1F")};
    }
  `,
};
