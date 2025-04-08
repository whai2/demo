import { useContentChat } from "@/features/chat";
import { useUserInfo } from "@/features/userInfo";
import QuickTaps from "./QuickTaps";
import QuickTaps2 from "./QuickTaps2";

import {
  courseLoadMaps,
  courseLoadMapsEnglish,
  courseSummationTaps,
  courseSummationTapsEnglish,
  oftenQuestionsTaps,
  oftenQuestionsTapsEnglish,
  othersQuestionsTaps,
  othersQuestionsTapsEnglish,
} from "../constants/quickTaps";

import { ReactComponent as CoxwaveLogo } from "@/shared/assets/coxwave.svg";

import styled from "styled-components";

function HomePage() {
  const { name, currentLanguage } = useUserInfo();
  const { sendChatCallback } = useContentChat();

  return (
    <S.Container>
      <S.Header>
        <S.CoxwaveLogo />
        <S.Title>
          {currentLanguage === "한국어"
            ? `안녕하세요! ${name}님`
            : `Hi there, ${name}`!}
          <br />
          {currentLanguage === "한국어"
            ? "무엇을 도와드릴까요?"
            : "How can I help you today?"}
        </S.Title>
      </S.Header>
      {currentLanguage === "한국어" ? (
        <QuickTaps {...courseSummationTaps} />
      ) : (
        <QuickTaps {...courseSummationTapsEnglish} />
      )}
      {currentLanguage === "한국어" ? (
        <QuickTaps2
          {...oftenQuestionsTaps}
          handleClickTapQuestion={sendChatCallback}
        />
      ) : (
        <QuickTaps2
          {...oftenQuestionsTapsEnglish}
          handleClickTapQuestion={sendChatCallback}
        />
      )}
      {currentLanguage === "한국어" ? (
        <QuickTaps {...othersQuestionsTaps} />
      ) : (
        <QuickTaps {...othersQuestionsTapsEnglish} />
      )}
      {currentLanguage === "한국어" ? (
        <QuickTaps {...courseLoadMaps} />
      ) : (
        <QuickTaps {...courseLoadMapsEnglish} />
      )}
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
    height: 100%;
  `,

  CoxwaveLogo: styled(CoxwaveLogo)`
    width: 76px;
    height: auto;
    flex-shrink: 0;
  `,

  Header: styled.div`
    display: flex;
    width: 100%;
    height: 137px;
    padding: 0px 6px 0px 8px;
    flex-direction: column;
    justify-content: center;
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
