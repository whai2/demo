import { useCourseRecommendChat } from "@/features/chat";

import styled from "styled-components";

function IntentQuestionButton({
  contents,
}: {
  contents?: { content: string }[];
}) {
  const { callback } = useCourseRecommendChat();

  if (!contents) return null;

  return (
    <S.Container>
      {contents.map((content, index) => (
        <S.Button key={index} onClick={() => callback(content.content)}>
          {content.content}
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
