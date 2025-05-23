import { QuickTapsType } from "../constants/quickTaps";

import { useClickTapQuestion } from "../hooks/useClickTapQuestion";

import styled from "styled-components";

function QuickTaps({ title, items, icon }: QuickTapsType) {
  const { handleClickTapQuestion } = useClickTapQuestion();

  return (
    <S.QuickTaps>
      <S.QuickTapHeader>
        <S.QuickTapIcon as={icon} />
        <S.QuickTapsTitle>{title}</S.QuickTapsTitle>
      </S.QuickTapHeader>

      {items.map((item) => (
        <S.QuickTap
          key={item.text}
          onClick={() => handleClickTapQuestion(item.text)}
        >
          {/* <S.QuickTapIcon as={item.icon} /> */}
          <S.QuickTapText>{item.text}</S.QuickTapText>
        </S.QuickTap>
      ))}
    </S.QuickTaps>
  );
}

export default QuickTaps;

const S = {
  QuickTaps: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    align-self: stretch;
  `,

  QuickTapsTitle: styled.span`
    color: #97999b;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
  `,

  QuickTap: styled.div`
    display: flex;
    padding: 8px;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background-color: #e7e8e9;
      border-radius: 8px;
    }
  `,

  QuickTapIcon: styled.svg`
    width: 18px;
    height: 18px;
    color: #51a1ca;
  `,

  QuickTapText: styled.span`
    color: #171b1f;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  `,

  QuickTapHeader: styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
  `,
};
