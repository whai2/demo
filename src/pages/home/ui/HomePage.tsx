import QuickTaps from "./QuickTaps";

import {
  courseLoadMaps,
  oftenQuestionsTaps,
  othersQuestionsTaps,
} from "../constants/quickTaps";

import { ReactComponent as CoxwaveLogo } from "../assets/coxwave.svg";

import styled from "styled-components";

function HomePage() {
  return (
    <S.Container>
      <S.Header>
        <S.CoxwaveLogo />
        <S.Title>
          안녕하세요! 콕스웨이브님
          <br />
          무엇을 도와드릴까요?
        </S.Title>
      </S.Header>
      <QuickTaps {...oftenQuestionsTaps} />
      <QuickTaps {...othersQuestionsTaps} />
      <QuickTaps {...courseLoadMaps} />
    </S.Container>
  );
}

export default HomePage;

const S = {
  Container: styled.div`
    display: flex;
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    flex: 1 0 0;
    width: 100%;
  `,

  CoxwaveLogo: styled(CoxwaveLogo)`
    width: 76px;
    height: auto;
    flex-shrink: 0;
  `,

  Header: styled.div`
    display: flex;
    width: 100%;
    height: 48px;
    align-items: flex-start;
    gap: 24px;
  `,

  Title: styled.span`
    color: #171b1f;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  `,
};
