import { useEffect, useRef, useState } from "react";

import type { Quiz2 } from "@/features/chat";
import { useSendQuizAnswer } from "@/features/chat";

import { ReactComponent as SendIcon } from "../../assets/sendIcon.svg";

import styled from "styled-components";

function Quiz2({ quiz }: { quiz: Quiz2 }) {
  const [text, setText] = useState("");
  const sendQuizAnswerCallback = useSendQuizAnswer(quiz);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  return (
    <S.Container>
      <S.Question>Q. {quiz.question}</S.Question>
      <S.TextArea
        ref={textareaRef}
        placeholder="답변을 작성하고 'Ctrl + Enter'를 눌러주세요."
        value={text}
        onChange={handleInputChange}
        onKeyDown={async (e) => {
          if (e.key === "Enter" && e.ctrlKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            if (text === "") return;
            setText("");
            await sendQuizAnswerCallback(text);
          }
        }}
      />
    </S.Container>
  );
}

export default Quiz2;

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

  InputContainer: styled.div`
    position: relative;
    width: 100%;
  `,

  Input: styled.input`
    width: 100%;
    padding: 8px;
    padding-right: 36px; /* 아이콘을 위한 공간 확보 */
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  `,

  SendIcon: styled(SendIcon)<{ $isTextInput: boolean }>`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    cursor: pointer;
    color: var(--Miscellaneous-_Kit-Section-Fill, #e0e0e0);
    &:hover {
      color: #999; /* 호버 시 색상 변경 */
    }

    ${({ $isTextInput }) =>
      $isTextInput &&
      `
      color: var(--Miscellaneous-_Kit-Section-Fill, #999);
    `}
  `,

  Question: styled.span`
    color: #1a2a9c;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
  `,

  ControlEnter: styled.span`
    color: #f5f5f5;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 200;
  `,

  TextArea: styled.textarea`
    display: flex;
    height: 80px;
    padding: 8px;
    align-items: flex-start;
    gap: 10px;
    flex-shrink: 0;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid #f5f5f5;
    background: #f5f5f5;

    resize: none;

    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")};

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #a1abba;

      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px; /* 166.667% */
    }
  `,
};
