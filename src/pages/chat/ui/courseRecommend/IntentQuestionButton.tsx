import { useCourseRecommendChat, useChatStore } from "@/features/chat";

import styled from "styled-components";

function IntentQuestionButton({
  contents,
}: {
  contents?: { content: string }[];
}) {
  const { callback } = useCourseRecommendChat();
  const { isLoading } = useChatStore();
  if (!contents) return null;

  return (
    <S.Container>
      {contents.map((content, index) => (
        <S.Button
          key={index}
          $disabled={isLoading}
          onClick={() => {
            if (isLoading) return;
            callback(content.content);
          }}
        >
          <S.ButtonText>{content.content}</S.ButtonText>
        </S.Button>
      ))}
    </S.Container>
  );
}

export default IntentQuestionButton;

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
      background: ${({ $disabled }) => ($disabled ? "#fff" : "#f5f5f5")}  ;
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
