import { PropsWithChildren } from "react";

import { Input } from "@/widgets/input";
import { TopBar } from "@/widgets/topBar";

import styled from "styled-components";

function ChatPopUpLayout({ children }: PropsWithChildren) {
  return (
    <S.ChatLayout $isOpen={true} $isFirstOpen={true}>
      <S.ChatContainer>
        <TopBar />
        <S.ChatBodyContainer>{children}</S.ChatBodyContainer>
        <Input />
      </S.ChatContainer>
    </S.ChatLayout>
  );
}

export default ChatPopUpLayout;

const S = {
  ChatLayout: styled.div<{ $isOpen: boolean; $isFirstOpen: boolean }>`
    position: fixed;
    top: ${({ theme }) => {
      const rawTop = theme.floatingButton?.position?.top;
      if (rawTop) {
        const numeric = parseInt(rawTop, 10);
        return isNaN(numeric) ? rawTop : `${numeric + 64}px`;
      }
      return "70px";
    }};
    right: ${({ theme }) => theme.floatingButton?.position?.right ?? "24px"};
    left: ${({ theme }) => theme.floatingButton?.position?.left ?? ""};
    bottom: ${({ theme }) => theme.floatingButton?.position?.bottom ?? ""};

    z-index: 1000;
    height: calc(100vh - 140px);
    animation: ${({ $isOpen }) =>
      $isOpen ? "fadeIn 0.4s ease forwards" : "fadeOut 0.4s ease forwards"};
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};

    @keyframes fadeIn {
      0% {
        transform: translateY(-10px);
        opacity: 0;
      }
      100% {
        transform: translateY(0); /* 10px 떠오름 */
        opacity: 1;
      }
    }

    @keyframes fadeOut {
      0% {
        transform: translateY(0); /* 10px 떠오름 */
        opacity: 1;
      }
      100% {
        transform: translateY(-10px);
        opacity: 0;
        display: none;
        visibility: hidden !important;
      }
    }
  `,

  ChatContainer: styled.div`
    display: flex;
    width: 340px;
    height: 100%;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    background: ${({ theme }) => theme.chatBody?.backgroundColor ?? "#f5f5f5"};

    box-shadow: 0px 8px 12px 6px rgba(0, 0, 0, 0.15),
      0px 4px 4px 0px rgba(0, 0, 0, 0.3);
  `,

  ChatBodyContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 0 0;
    align-self: stretch;
    background: ${({ theme }) => theme.chatBody?.backgroundColor ?? "#f5f5f5"};
    overflow-y: auto;
    height: 100%;
  `,

  EmptyChatInput: styled.div`
    width: 100%;
    height: 20px;
    border-radius: 20px;
    background: ${({ theme }) => theme.chatBody?.backgroundColor ?? "#f5f5f5"};
  `,
};
