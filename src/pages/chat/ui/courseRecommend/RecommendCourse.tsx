import type { RecommendationCourse } from "@/features/chat/type";

import styled from "styled-components";

function RecommendCourse({ course }: { course: RecommendationCourse }) {
  return (
    <S.Container onClick={() => {
      window.open("https://coxwave.com");
    }}>
      <S.Wrapper>
        <S.TitleContainer>
          <S.Category>{course.category} &gt; </S.Category>
          <S.Title>{course.name}</S.Title>
        </S.TitleContainer>

        <S.PriceContainer>
          <S.Year>
            {course.duration} | {course.target}
          </S.Year>
          <S.Price>{course.price}</S.Price>
        </S.PriceContainer>
      </S.Wrapper>
    </S.Container>
  );
}

export default RecommendCourse;

const S = {
  Container: styled.div`
    display: flex;
    padding: 4px 4px 8px 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    width: 150px;
    flex-shrink: 0;
    display: flex;
    padding: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 12px;
    background: #edf5f9;
    cursor: pointer;
    height: 150px;

    &:hover {
      background: #e0f2f7;
    }
  `,

  Wrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
  `,

  TitleContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    align-self: stretch;
  `,

  Category: styled.span`
    color: var(--Color-11, #979fad);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 132%; /* 6.316px */
    letter-spacing: -0.096px;
  `,

  Title: styled.span`
    color: var(--Color-2, #000);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 136%; /* 8.459px */
    letter-spacing: -0.124px;
  `,

  PriceContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    align-self: stretch;
  `,

  Year: styled.span`
    color: var(--Color-10, #979fad);
    font-family: Pretendard;
    font-size: 11px;
    font-style: normal;
    font-weight: 300;
    line-height: 132%; /* 6.316px */
    letter-spacing: -0.096px;
    align-self: stretch;
  `,

  Price: styled.span`
    color: var(--Black, #000);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 132%; /* 6.316px */
    letter-spacing: -0.096px;
    align-self: stretch;
  `,
};
