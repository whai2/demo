import { useChatStore, useNextQuiz, useQuizReference } from "@/features/chat";

import styled from "styled-components";

function NextSteps({ nextSteps }: { nextSteps: any }) {
  const nextQuizCallback = useNextQuiz();
  const quizReferenceCallback = useQuizReference();
  const { setMessages, setIsLoading, isLoading } = useChatStore();

  console.log(nextSteps);

  return (
    <S.Container>
      {nextSteps.nextQuiz && (
        <S.Button
          $disabled={isLoading}
          onClick={async () => {
            if (isLoading) return;
            await nextQuizCallback(
              nextSteps.isCorrect
                ? "좀 더 어려운 문제를 풀고 싶어요."
                : "좀 더 쉬운 문제를 풀고 싶어요."
            );
          }}
        >
          <S.ButtonText>{nextSteps.isCorrect ? "좀 더 어려운 문제를 풀고 싶어요.": "좀 더 쉬운 문제를 풀고 싶어요."}</S.ButtonText>
        </S.Button>
      )}
      {nextSteps.referenceNeeded && (
        <S.Button
          $disabled={isLoading}
          onClick={async () => {
            if (isLoading) return;
            await quizReferenceCallback("관련 자료를 받고 싶어요.");
          }}
        >
          <S.ButtonText>관련 자료를 받고 싶어요.</S.ButtonText>
        </S.Button>
      )}
      {nextSteps.nextCourse && (
        <S.Button
          $disabled={isLoading}
          onClick={async () => {
            if (isLoading) return;
            setMessages((prevMessages) => [
              ...prevMessages,
              { role: "user", content: nextSteps.nextCourse, isLoading: false },
            ]);

            setIsLoading(true);

            setMessages((prevMessages) => [
              ...prevMessages,
              { role: "assistant", content: "", isLoading: true },
            ]);

            setMessages((prevMessages) => {
              const updated = [...prevMessages];
              updated[updated.length - 1].isLoading = false;
              return updated;
            });

            const introMessage =
              "네 다음 강의로 넘어갈게요!\n\n조금씩 쌓이는 노력은 결국 큰 성과로 돌아옵니다.\n\n잠깐 숨 고르고, 다시 한 발짝 나아가볼까요?\n\n**당신의 성장을 응원해요!** 💪🌱";

            let displayedMessage = "";

            await new Promise((resolve) =>
              setTimeout(resolve, Math.random() * 20 + 100)
            );

            // 글자 단위로 스트리밍 효과 구현
            for (let i = 0; i < introMessage.length; i++) {
              setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].isLoading = false;
                return updatedMessages;
              });

              displayedMessage += introMessage[i];

              setMessages((prevMessages) => {
                const updated = [...prevMessages];
                updated[updated.length - 1].content = displayedMessage;
                return updated;
              });

              // 타이핑 효과를 위한 딜레이 (10-30ms)
              await new Promise((resolve) =>
                setTimeout(resolve, Math.random() * 20 + 10)
              );
            }
          }}
        >
          <S.ButtonText>다음 강의로 넘어가고 싶어요.</S.ButtonText>
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

  Button: styled.button<{ $disabled?: boolean }>`
    display: flex;
    padding: 8px;
    justify-content: center;
    align-items: center;
    gap: 2px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid #d9dadb;
    background: #fff;
    cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};

    &:hover {
      background: ${({ $disabled }) => ($disabled ? "#fff" : "#f5f5f5")};
    }
  `,

  ButtonText: styled.span`
    font-size: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: left;
  `,
};
