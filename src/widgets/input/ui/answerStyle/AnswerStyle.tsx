import styled from "styled-components";

type AnswerStyleType = {
  value: number;
  selectedOption: number;
  title: string;
  subTitle: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function AnswerStyle({
  title,
  subTitle,
  value,
  selectedOption,
  handleChange,
}: AnswerStyleType) {
  const isChecked = selectedOption === value;

  return (
    <S.Wrapper $isChecked={isChecked}>
      <S.RadioInput
        type="radio"
        name="options"
        value={value}
        checked={selectedOption === value}
        onChange={handleChange}
      />
      <div>
        <S.Title>{title}</S.Title>
        <S.SubTitle>{subTitle}</S.SubTitle>
      </div>
      {isChecked && value === 1 && <S.DefaultAlert>기본</S.DefaultAlert>}
    </S.Wrapper>
  );
}

export default AnswerStyle;

const S = {
  Wrapper: styled.label<{ $isChecked: boolean }>`
    display: flex;
    flex-direction: row;
    padding: 4px 16px 0px 12.5px;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    background: ${({ $isChecked, theme }) =>
      $isChecked
        ? "var(--Basic-Color-Neutral-neutral-1, #F5F5F6)"
        : theme.components?.backgroundColor ?? "#fff"};
    transition: background 0.3s ease;

    &:hover {
      background: ${({ $isChecked }) =>
        $isChecked
          ? "var(--Basic-Color-Neutral-neutral-1, #F5F5F6)"
          : "var(--Basic-Color-Neutral-neutral-hover, #EFEFEF)"};
    }
  `,

  Title: styled.div`
    color: var(--Miscellaneous-Floating-Tab---Text-Unselected, #090909);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px; /* 150% */
  `,

  SubTitle: styled.div`
    color: var(--Semantic-Color-Fill-fill-placeholder, #97999b);

    /* ETC/caption-2 */
    font-family: Pretendard;
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px; /* 145.455% */
  `,

  RadioInput: styled.input`
    width: 16px;
    accent-color: black;
  `,

  DefaultAlert: styled.div`
    padding-left: 8px;
    color: #51a1ca;
    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px; /* 150% */
  `,
};
