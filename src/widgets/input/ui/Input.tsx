import { useEffect, useState } from "react";

import AnswerStyles from "./answerStyle/AnswerStyles";

import { ROUTES, useNavigate } from "@/features/navigate";
import { BackDrop } from "@/shared/ui";
import { useHandleAnswerStyle } from "../hooks/useHandleAnswerStyle";
import { useHandleInputSize } from "../hooks/useHandleInputSize";

import { useChatStore, useSendChat } from "@/features/chat";
import { usePopUpOpen } from "@/features/popUpOpen";

import { ReactComponent as LogoIcon } from "../assets/logo.svg";
import { ReactComponent as SendIcon } from "../assets/send.svg";
import { ReactComponent as ArrowDown } from "../assets/arrowDown.svg";

import styled from "styled-components";

function Input() {
  const [text, setText] = useState("");
  const { textareaRef } = useHandleInputSize(text);
  const { isOpen } = usePopUpOpen();
  const { setCurrentPage } = useNavigate();

  const { sendChatCallback, sendQuizAnswer } = useSendChat();
  const { isQuiz, lastQuiz, isLoading } = useChatStore();

  const {
    answerStyleTitle,
    isAnswerStylesOpen,
    selectedOption,
    handleAnswerStyleToggle,
    handleAnswerStyleClose,
    handleSelectAnswerStyle,
  } = useHandleAnswerStyle();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (isLoading) return;
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();

      if (text.trim() !== "") {
        setCurrentPage(ROUTES.CHAT);
        if (isQuiz && lastQuiz) {
          await sendQuizAnswer(text, lastQuiz, setText);
        } else {
          await sendChatCallback(text, setText);
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  return (
    <S.Container>
      <S.ChatInputContainer $isHome={true}>
        <S.ChatTextArea
          ref={textareaRef}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={text}
          placeholder="질문을 입력하세요"
        />

        <S.ChatSendContainer>
          <S.LogoContainer>
            <S.LogoIcon />
            <S.AnswerStylesBox
              $disabled={isLoading}
              onClick={handleAnswerStyleToggle}
            >
              <S.Text
                $isTextInput={text !== ""}
                $isAnswerStylesOpen={isAnswerStylesOpen}
                $disabled={isLoading}
              >
                {answerStyleTitle}
              </S.Text>
              <S.BottomChervron
                // $isTextInput={isTextInput}
                $isAnswerStylesOpen={isAnswerStylesOpen}
                $disabled={isLoading}
              />
            </S.AnswerStylesBox>
          </S.LogoContainer>
          <S.SendIcon
            $isTextInput={text !== ""}
            $disabled={isLoading}
            onClick={async () => {
              if (text.trim() === "") return;
              if (isLoading) return;

              setCurrentPage(ROUTES.CHAT);
              await sendChatCallback(text, setText);
            }}
          />

          {isAnswerStylesOpen && (
            <>
              <AnswerStyles
                handleSelectAnswerStyle={(event) => {
                  handleSelectAnswerStyle(event);
                  handleAnswerStyleClose();
                }}
                selectedOption={selectedOption}
              />
              <BackDrop onClose={handleAnswerStyleClose} />
            </>
          )}
        </S.ChatSendContainer>
      </S.ChatInputContainer>
    </S.Container>
  );
}

export default Input;

const S = {
  Container: styled.label`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0 14px 20px 14px;
    align-items: center;
    align-self: stretch;
    z-index: 20;
    width: 100%;
  `,

  ChatInputContainer: styled.div<{ $isHome: boolean }>`
    display: flex;
    padding: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1 0 0;
    border-radius: 8px;
    background: #fff;
    width: 100%;
    padding-left: 15px;
  `,

  ChatTextArea: styled.textarea`
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: var(--Grays-Black, var(--Grays-Black, #000));

    justify-content: center;
    align-items: center;

    width: 100%;
    border: none;
    outline: none;
    resize: none;

    background: transparent;

    padding: 3px 0 0;
    min-height: 43px;
    height: auto;
    max-height: 200px;
    transition: height 0.2s ease;

    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")};

    &:focus {
      outline: none;
    }
  `,

  ChatSendContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
  `,

  AnswerStylesBox: styled.div<{ $disabled?: boolean }>`
    display: flex;
    align-items: center;
    gap: 2px;
    cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  `,

  // CamiLogo: styled(CamiLogo)<{
  //   $isTextInput: boolean;
  //   $disabled?: boolean;
  //   $isAnswerStylesOpen: boolean;
  // }>`
  //   width: 16px;
  //   height: 16px;
  //   color: ${({ $isTextInput, $disabled, $isAnswerStylesOpen }) =>
  //     $disabled
  //       ? "gray"
  //       : $isTextInput || $isAnswerStylesOpen
  //       ? "#FC1C49"
  //       : "gray"};
  //   flex-shrink: 0;
  // `,

  // BottomChervron: styled(ArrowDowm)<{
  //   // $isTextInput: boolean;
  //   $disabled?: boolean;
  //   $isAnswerStylesOpen: boolean;
  // }>`
  //   width: 16px;
  //   height: 16px;
  //   color: ${({ $disabled, $isAnswerStylesOpen }) =>
  //     $disabled ? "gray" : $isAnswerStylesOpen ? "#FC1C49" : "gray"};
  // `,

  Text: styled.span<{
    $isTextInput: boolean;
    $disabled?: boolean;
    $isAnswerStylesOpen: boolean;
  }>`
    color: ${({ $isTextInput, $disabled, $isAnswerStylesOpen }) =>
      $disabled
        ? "gray"
        : $isTextInput || $isAnswerStylesOpen
        ? "#51A1CA"
        : "gray"};
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    padding-top: 3px;
    text-align: center;
  `,

  SendIcon: styled(SendIcon)<{ $isTextInput: boolean; $disabled?: boolean }>`
    width: 16px;
    height: 16px;
    color: ${({ $isTextInput, $disabled }) =>
      $disabled ? "gray" : $isTextInput ? "#51A1CA" : "gray"};
    cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};

    flex-shrink: 0;
  `,

  LogoContainer: styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
  `,

  LogoIcon: styled(LogoIcon)`
    width: 16px;
    height: 16px;
    transform: translate(0, 1.2px);
  `,

  BottomChervron: styled(ArrowDown)<{
    // $isTextInput: boolean;
    $disabled?: boolean;
    $isAnswerStylesOpen: boolean;
  }>`
    width: 16px;
    height: 16px;
    color: ${({ $disabled, $isAnswerStylesOpen }) =>
      $disabled ? "#97999B" : $isAnswerStylesOpen ? "#51A1CA" : "#97999B"};

    transition: transform 0.3s ease;
    transform: ${(props) =>
      props.$isAnswerStylesOpen ? "rotate(180deg)" : "rotate(0deg)"};
  `,

};
