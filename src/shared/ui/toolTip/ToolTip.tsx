import { PropsWithChildren } from "react";

import { ReactComponent as AlarmCorner } from "@/shared/assets/alarmCorner.svg";

import styled from "styled-components";

function ToolTip({ children }: PropsWithChildren) {
  return (
    <S.Container>
      <S.AlarmContainer>
        <S.AlarmCorner />
      </S.AlarmContainer>
      <S.TextContainer>
        <S.Text>{children}</S.Text>
      </S.TextContainer>
    </S.Container>
  );
}

export default ToolTip;

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    cursor: pointer;
  `,

  TextContainer: styled.div`
    display: flex;
    padding: 6px 12px;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    border-radius: var(--Radius-radiusSM, 4px);
    background: #171b1f;
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
    white-space: nowrap;
  `,

  AlarmContainer: styled.div`
    display: flex;
    padding: 0px 8px;
    align-items: flex-start;
    gap: 10px;
  `,

  AlarmCorner: styled(AlarmCorner)`
    path {
      color: #171b1f;
    }
  `,
};
