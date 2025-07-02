import CoxwaveChatSDK from "ax-sdk-chatbot";
import { useEffect } from "react";

import { useUserInfo } from "@/features/userInfo";

import { ReactComponent as ChatIcon } from "../assets/logo.svg";

import styled from "styled-components";

const sdk = new CoxwaveChatSDK({
  hostClientUrl: import.meta.env.VITE_CLIENT_URL,
  pluginKey: import.meta.env.VITE_FIRSTBRAIN_PLUGIN_KEY,
  isProd: import.meta.env.VITE_IS_PROD === "true",
});

const testCourseId = import.meta.env.VITE_FIRSTBRAIN_TEST_COURSE_ID;
const testClipId = import.meta.env.VITE_FIRSTBRAIN_TEST_CLIP_ID;

function TutorButton() {
  const { currentLanguage } = useUserInfo();

  useEffect(() => {
    sdk.initChat({
      chatApiParams: {
        userId: "fc_2271729",
        courseId: testCourseId,
        courseName: "유니티 게임 포트폴리오 완성 올인원 패키지 Online.",
        courseCategory: "프로그래밍",
        courseSubCategory: "게임 개발",
        clipId: testClipId,
        clipPlayHead: 0,
      },
      customStyles: {
        floatingButton: {
          isInElement: true,
          parentElementId: "root-button",
        },
        chatBody: {
          position: {
            top: "66px",
          }
        },
        theme: {
          AIRecommendGradient: {
            base: "#9C47F7",
            move: "#FF75E4",
          },
        },
      },
    });

    return () => {
      sdk.removeChat();
    };
  }, []);

  return (
    <S.ChatContainer id="root-button">
      <S.ChatButton>
        <S.ChatIcon />
        <S.Text>
          {currentLanguage === "한국어" ? "AI 챗봇" : "AI Chatbot"}
        </S.Text>
      </S.ChatButton>
    </S.ChatContainer>
  );
}

export default TutorButton;

const S = {
  ChatContainer: styled.div``,

  ChatButton: styled.button`
    cursor: pointer;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 8px;
    justify-content: center;

    padding: 10px 12px 10px 10px;
    gap: 10px;

    background-color: ${({ theme }) =>
      theme.floatingButton?.closeChat?.backgroundColor ?? "#1A2A9C"};

    @supports (-webkit-touch-callout: none) {
      width: 100px;
    }
  `,

  Text: styled.div`
    padding-top: 3px;
    color: ${({ theme }) => theme.floatingButton?.closeChat?.color ?? "#fff"};
    text-align: center;
    font-feature-settings: "liga" off, "clig" off;

    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  `,

  ChatIcon: styled(ChatIcon)`
    width: 24px;
    height: 24px;
  `,
};
