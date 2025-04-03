import { useNextQuiz, useQuizReference } from "@/features/chat";

import styled from "styled-components";

function NextSteps({ nextSteps }: { nextSteps: any }) {
  const nextQuizCallback = useNextQuiz();
  const quizReferenceCallback = useQuizReference();

  console.log("nextSteps", nextSteps);

  return (
    <S.Container>
      {nextSteps.nextQuiz && (
        <S.Button
          onClick={async () => {
            await nextQuizCallback(nextSteps.nextQuiz);
          }}
        >
          {nextSteps.nextQuiz}
        </S.Button>
      )}
      {nextSteps.referenceNeeded && (
        <S.Button
          onClick={async () => {
            await quizReferenceCallback(nextSteps.referenceNeeded);
          }}
        >
          {nextSteps.referenceNeeded}
        </S.Button>
      )}
      {nextSteps.nextCourse && (
        <S.Button
          onClick={() => {
            console.log("nextCourse");
          }}
        >
          {nextSteps.nextCourse}
        </S.Button>
      )}
    </S.Container>
  );
}

export default NextSteps;

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  `,

  Button: styled.button`
    display: flex;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 2px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid #d9dadb;
    background: #fff;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      background: #f5f5f5;
    }
  `,
};
