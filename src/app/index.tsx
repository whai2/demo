import { useEffect } from "react";

import { Video } from "@/pages/background/video";
import { LoginPage } from "@/pages/login";
// import { HomePage } from "@/pages/home";
import { ChatPage } from "@/pages/chat";
import ChatPopUpLayout from "@/pages/layout/Layout";
import { WidgetButton } from "@/widgets/widgetButton";

import { usePopUpOpen } from "@/features/popUpOpen";
import { useUserInfo } from "@/features/userInfo";

import styled from "styled-components";

function App() {
  const { isLogin } = useUserInfo();
  const { isOpen, setToggle } = usePopUpOpen();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        setToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {isLogin ? (
        <S.Container>
          <Video />
          <WidgetButton isOpen={isOpen} setIsOpen={setToggle} />
          {isOpen && (
            <ChatPopUpLayout>
              <ChatPage />
            </ChatPopUpLayout>
          )}
        </S.Container>
      ) : (
        <S.LoginLayout>
          <LoginPage />
        </S.LoginLayout>
      )}
    </>
  );
}

export default App;

const S = {
  LoginLayout: styled.div`
    padding-top: 266px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,

  Container: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
};
