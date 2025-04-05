import type { Quiz } from "@/features/chat";
import { useChatStore, useSendQuizAnswer } from "@/features/chat";

import styled from "styled-components";

function Quiz({ quiz }: { quiz: Quiz }) {
  const sendQuizAnswerCallback = useSendQuizAnswer(quiz);

  return (
    <S.Container>
      <S.Question>Q. {quiz.question}</S.Question>
      {quiz.choices &&
        quiz.choices.map((choice, index) => (
          <QuizItem
            key={index}
            choice={choice}
            index={index}
            sendQuizAnswerCallback={sendQuizAnswerCallback}
          />
        ))}
    </S.Container>
  );
}

export default Quiz;

function QuizItem({
  choice,
  index,
  sendQuizAnswerCallback,
}: {
  choice: string;
  index: number;
  sendQuizAnswerCallback: (answer: string) => Promise<void>;
}) {
  const { isLoading } = useChatStore();

  return (
    <S.Item
      $disabled={isLoading}
      onClick={() => {
        if (isLoading) return;
        sendQuizAnswerCallback(choice);
      }}
    >
      {index + 1}) {choice}
    </S.Item>
  );
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    gap: 7px;
  `,

  Item: styled.div<{ $disabled?: boolean }>`
    display: flex;
    padding: 8px;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border-radius: 8px;
    background: var(--Miscellaneous-_Kit-Section-Fill, #f5f5f5);
    font-size: 13px;
    cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
    &:hover {
      background: ${({ $disabled }) => ($disabled ? "#f5f5f5" : "#e0e0e0")};
    }
  `,

  Question: styled.span`
    color: #1a2a9c;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
  `,
};
