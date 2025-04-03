import type { Quiz } from "@/features/chat";
import { useSendQuizAnswer } from "@/features/chat";

import styled from "styled-components";

function Quiz({ quiz }: { quiz: Quiz }) {
  const sendQuizAnswerCallback = useSendQuizAnswer(quiz);
  return (
    <S.Container>
      <div>{quiz.question}</div>
      {quiz.choices && quiz.choices.map((choice, index) => (
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
  return (
    <S.Item onClick={() => sendQuizAnswerCallback(choice)}>
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

  Item: styled.div`
    display: flex;
    padding: 8px;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border-radius: 8px;
    background: var(--Miscellaneous-_Kit-Section-Fill, #f5f5f5);
    font-size: 13px;
    cursor: pointer;
    &:hover {
      background: var(--Miscellaneous-_Kit-Section-Fill, #e0e0e0);
    }
  `,
};
