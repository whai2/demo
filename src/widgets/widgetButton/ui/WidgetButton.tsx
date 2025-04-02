import Alarm from "./Alarm";

import { useAlarmStore, useTriggerInterval } from "@/features/alarm";
import { useSendChat } from "@/features/chat";
import { usePopUpOpen } from "@/features/popUpOpen";
import { useNavigate, ROUTES } from "@/features/navigate";

import styled from "styled-components";

function WidgetButton({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { isTriggered, data, setTriggered } = useAlarmStore();
  const { setCurrentPage } = useNavigate();
  const { setOpen } = usePopUpOpen();

  const { clipIdRef } = useTriggerInterval();
  const isCallToAction = data?.type === "callToAction";

  const sendChatCallback = useSendChat();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <S.ChatContainer>
      <S.ChatButton onClick={handleClick} $isOpen={isOpen}>
        <S.Text $isOpen={isOpen}>AI 챗봇</S.Text>
      </S.ChatButton>

      {isTriggered ? (
        <Alarm
          key={clipIdRef.current}
          onClick={async () => {
            if (data.question) {
              setOpen();
              setTriggered(false);
              setCurrentPage(ROUTES.CHAT);
              await sendChatCallback(data.question, () => {
              });
            }
          }}
          isCallToAction={isCallToAction}
          title={data.message}
        />
      ) : null}
    </S.ChatContainer>
  );
}

export default WidgetButton;

const S = {
  ChatContainer: styled.div`
    position: fixed;
    top: ${({ theme }) => theme.floatingButton?.position?.top ?? "15px"};
    right: ${({ theme }) => theme.floatingButton?.position?.right ?? "24px"};
    left: ${({ theme }) => theme.floatingButton?.position?.left ?? ""};
    bottom: ${({ theme }) => theme.floatingButton?.position?.bottom ?? ""};
  `,

  ChatButton: styled.button<{ $isOpen: boolean }>`
    cursor: pointer;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 8px;
    justify-content: center;

    padding: ${({ $isOpen }) =>
      $isOpen ? "10px 12px 10px 18px;" : "10px 12px 10px 10px"};
    gap: ${({ $isOpen }) => ($isOpen ? "10px" : "2px")};

    background-color: ${({ theme, $isOpen }) =>
      $isOpen
        ? theme.floatingButton?.openChat?.backgroundColor ?? "#000"
        : theme.floatingButton?.closeChat?.backgroundColor ?? "#51A1CA"};

    @supports (-webkit-touch-callout: none) {
      width: 100px;
    }
  `,

  Text: styled.div<{ $isOpen: boolean }>`
    padding-top: 3px;
    color: ${({ theme, $isOpen }) =>
      $isOpen
        ? theme.floatingButton?.openChat?.color ?? "#fff"
        : theme.floatingButton?.closeChat?.color ?? "#fff"};
    text-align: center;
    font-feature-settings: "liga" off, "clig" off;

    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  `,
};
