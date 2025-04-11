import { ReactComponent as AlarmCorner } from "@/shared/assets/alarmCorner.svg";

import styled from "styled-components";

function Alarm({
  title,
  isHighPriority,
  onClick,
}: {
  title: string;
  onClick: () => void;
  isHighPriority: boolean;
}) {
  const formattedTitle = title.replace(/\\n/g, "\n");

  return (
    <S.Container onClick={onClick}>
      <S.AlarmContainer>
        <S.AlarmCorner $isHighPriority={isHighPriority} />
      </S.AlarmContainer>
      <S.TextContainer $isHighPriority={isHighPriority}>
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
    animation: fadeOutInAlarm 15s forwards;

    @keyframes fadeOutInAlarm {
      0% {
        opacity: 1;
      }
      66% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `,

  TextContainer: styled.div<{ $isHighPriority: boolean }>`
    display: flex;
    padding: 6px 12px;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    border-radius: var(--Radius-radiusSM, 8px);
    background: ${(props) => (props.$isHighPriority ? "#51A1CA" : "#171B1F")};
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

  AlarmCorner: styled(AlarmCorner)<{ $isHighPriority: boolean }>`
    path {
      color: ${(props) => (props.$isHighPriority ? "#51A1CA" : "#171B1F")};
    }
  `,
};
