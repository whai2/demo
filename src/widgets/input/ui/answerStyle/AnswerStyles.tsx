import AnswerStyle from "./AnswerStyle";

import answerStyleList from "../../constant/constant";

import styled from "styled-components";

type AnswerStylesProps = {
  selectedOption: number;
  handleSelectAnswerStyle: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function AnswerStyles({
  selectedOption,
  handleSelectAnswerStyle,
}: AnswerStylesProps) {
  return (
    <S.Container>
      <S.Header>
        <S.HeaderTitle>답변스타일</S.HeaderTitle>
      </S.Header>
      {answerStyleList.map((item) => (
        <AnswerStyle
          key={item.id}
          title={item.title}
          subTitle={item.subTitle}
          value={item.id}
          selectedOption={selectedOption}
          handleChange={handleSelectAnswerStyle}
        />
      ))}
    </S.Container>
  );
}

export default AnswerStyles;

const S = {
  Container: styled.div`
    display: flex;
    position: absolute;
    bottom: 58px;
    width: auto;
    padding: 8px 0px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-radius: 8px;
    border: 1px solid var(--Semantic-Color-Border-border-primary, #d9dadb);
    background: ${({ theme }) => theme.components?.backgroundColor ?? "#fff"};

    box-shadow: var(--sds-size-depth-0) var(--sds-size-depth-025)
        var(--sds-size-depth-100) var(--sds-size-depth-0)
        var(--sds-color-black-200),
      var(--sds-size-depth-0) var(--sds-size-depth-025)
        var(--sds-size-depth-100) var(--sds-size-depth-0)
        var(--sds-color-black-100);

    z-index: 20;
  `,

  Header: styled.div`
    display: flex;
    padding: 4px 16px;
    align-items: center;
    gap: 4px;
    align-self: stretch;
  `,

  HeaderTitle: styled.div`
    color: #97999b;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px; /* 150% */
  `,
};
