import { useChatStore, useNextQuiz, useQuizReference } from "@/features/chat";
import { useUserInfo } from "@/features/userInfo";

import styled from "styled-components";

function NextSteps({ nextSteps }: { nextSteps: any }) {
  const nextQuizCallback = useNextQuiz();
  const quizReferenceCallback = useQuizReference();
  const { setMessages, setIsLoading, isLoading, lastQuiz } = useChatStore();
  const { currentLanguage } = useUserInfo();

  return (
    <S.Container>
      {!nextSteps.isCorrect && lastQuiz && (
        <S.Button
          $disabled={isLoading}
          onClick={async () => {
            if (isLoading) return;
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                role: "user",
                content:
                  currentLanguage === "English"
                    ? "I want to try the question again."
                    : "문제를 다시 풀어볼래요.",
                isLoading: false,
              },
            ]);

            setIsLoading(true);

            setMessages((prevMessages) => [
              ...prevMessages,
              { role: "assistant", content: "", isLoading: true },
            ]);

            await new Promise((resolve) =>
              setTimeout(resolve, Math.random() * 20 + 10)
            );

            setMessages((prevMessages) => {
              const updated = [...prevMessages];
              updated[updated.length - 1].isLoading = false;
              return updated;
            });

            const introMessage = lastQuiz?.question;

            let displayedMessage = "";

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

            setMessages((prevMessages) => {
              const updated = [...prevMessages];
              updated[updated.length - 1].courseQuiz = {
                isLoading: true,
                quiz: {
                  question: "",
                  choices: [],
                  answerIndex: 0,
                },
              };
              return updated;
            });

            await new Promise((resolve) => setTimeout(resolve, 500));

            setMessages((prevMessages) => {
              const updated = [...prevMessages];
              updated[updated.length - 1].courseQuiz = {
                quiz: lastQuiz,
                isLoading: false,
              };
              return updated;
            });

            setIsLoading(false);
          }}
        >
          <S.ButtonText>
            {currentLanguage === "English"
              ? "I want to try the question again."
              : "문제를 다시 풀어볼래요."}
          </S.ButtonText>
        </S.Button>
      )}
      {nextSteps.nextQuiz && (
        <S.Button
          $disabled={isLoading}
          onClick={async () => {
            if (isLoading) return;
            await nextQuizCallback(
              nextSteps.isCorrect
                ? currentLanguage === "English"
                  ? "I want a more difficult question."
                  : "좀 더 어려운 문제를 풀고 싶어요."
                : currentLanguage === "English"
                ? "I want an easier question."
                : "좀 더 쉬운 문제를 풀고 싶어요."
            );
          }}
        >
          <S.ButtonText>
            {nextSteps.isCorrect
              ? currentLanguage === "English"
                ? "I want a more difficult question."
                : "좀 더 어려운 문제를 풀고 싶어요."
              : currentLanguage === "English"
              ? "I want an easier question."
              : "좀 더 쉬운 문제를 풀고 싶어요."}
          </S.ButtonText>
        </S.Button>
      )}
      {nextSteps.referenceNeeded && (
        <S.Button
          $disabled={isLoading}
          onClick={async () => {
            if (isLoading) return;

            await quizReferenceCallback(
              currentLanguage === "English"
                ? "I want materials to review."
                : "복습할 수 있는 자료를 받고 싶어요."
            );
          }}
        >
          <S.ButtonText>
            {currentLanguage === "English"
              ? "I want materials to review."
              : "복습할 수 있는 자료를 받고 싶어요."}
          </S.ButtonText>
        </S.Button>
      )}

      {nextSteps.nextCourse && (
        <S.Button
          $disabled={isLoading}
          onClick={async () => {
            if (isLoading) return;

            setMessages((prevMessages) => [
              ...prevMessages,
              {
                role: "user",
                content:
                  currentLanguage === "English"
                    ? "I want to move on to the next course."
                    : nextSteps.nextCourse,
                isLoading: false,
              },
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
              currentLanguage === "English"
                ? `Alright, let's move on to the next course! 📚✨

Every small step you take adds up to something big.

Take a deep breath—and let's take one more step forward.

**We’re cheering for your growth!** 💪🌱`
                : `네 다음 강의로 넘어갈게요!\n\n조금씩 쌓이는 노력은 결국 큰 성과로 돌아옵니다.\n\n잠깐 숨 고르고, 다시 한 발짝 나아가볼까요?\n\n**당신의 성장을 응원해요!** 💪🌱`;

            let displayedMessage = "";

            await new Promise((resolve) =>
              setTimeout(resolve, Math.random() * 20 + 100)
            );

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
                updated[updated.length - 1].nextCourseStart = true;
                return updated;
              });

              await new Promise((resolve) =>
                setTimeout(resolve, Math.random() * 20 + 10)
              );
            }

            setIsLoading(false);
          }}
        >
          <S.ButtonText>
            {currentLanguage === "English"
              ? "I want to move on to the next course."
              : "다음 강의로 넘어가고 싶어요."}
          </S.ButtonText>
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
