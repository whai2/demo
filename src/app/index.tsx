import { useEffect } from "react";

import { Router } from "@/app/routers";
import { Video } from "@/pages/background/video";
import { LoginPage } from "@/pages/login";
import { WidgetButton } from "@/widgets/widgetButton";

import { usePopUpOpen } from "@/features/popUpOpen";
import { useUserInfo } from "@/features/userInfo";
import { useNavigate, ROUTES } from "@/features/navigate";
import styled from "styled-components";

function App() {
  const { isLogin } = useUserInfo();
  const { isOpen, setToggle } = usePopUpOpen();
  const { setCurrentPage } = useNavigate();
  
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

  useEffect(() => {
    setCurrentPage(ROUTES.HOME);
  }, []);

  return (
    <>
      {isLogin ? (
        <S.Container>
          <Video />
          <WidgetButton isOpen={isOpen} setIsOpen={setToggle} />
          {isOpen && <Router />}
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
    padding-top: 133px;
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
