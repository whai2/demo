import { useEffect, useRef, useState } from "react";

import { getTailQuestion, useSendTailQuestion } from "@/features/chat";
import { MessageType } from "@/features/chat/type";

import { ReactComponent as CoxwaveLogo } from "../assets/logo.svg";

import styled from "styled-components";

function TailQuestions({ lastMessage }: { lastMessage: MessageType }) {
  const [tailQuestions, setTailQuestions] = useState<string[]>([]);

  const sendTailQuestion = useSendTailQuestion();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastMessage.isCourseRecommendation) return;

    const fetchTailQuestion = async () => {
      const tailQuestion = await getTailQuestion([lastMessage]);
      setTailQuestions(tailQuestion);
    };

    fetchTailQuestion();
  }, [lastMessage]);

  useEffect(() => {
    if (tailQuestions.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [tailQuestions]);

  if (tailQuestions.length === 0) return null;

  return (
    <S.Container>
      <S.TitleContainer>
        <S.CoxwaveLogo as={CoxwaveLogo} />
        <S.Title>AI 추천 질문</S.Title>
      </S.TitleContainer>
      {tailQuestions.map((question) => (
        <S.TailQuestion
          key={question}
          onClick={async () => {
            await sendTailQuestion(question);
          }}
        >
          {question}
        </S.TailQuestion>
      ))}
      <div ref={bottomRef} />
    </S.Container>
  );
}

export default TailQuestions;

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    align-self: stretch;
    padding-left: 50px;
  `,

  CoxwaveLogo: styled.svg`
    display: flex;
    color: black;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  `,

  TitleContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  `,

  Title: styled.div`
    color: #171b1f;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    padding-top: 2px;
  `,

  TailQuestion: styled.div`
    display: flex;
    padding: 8px 12px;
    align-items: center;
    // gap: 10px;
    border-radius: 12px;
    border: 1px solid var(--Semantic-Color-Border-border-primary, #d9dadb);
    background: var(--Miscellaneous-Sidebar-Fill---Selected, #fff);
    cursor: pointer;

    color: var(--Semantic-Color-Fill-fill-primary, #171b1f);

    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 142.857% */

    &:hover {
      background: #f5f5f5;
    }
  `,
};
