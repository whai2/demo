import { useEffect } from "react";

import { Router } from "@/app/routers";
import { Video } from "@/pages/background/video";
import { LoginPage } from "@/pages/login";
// import { Loading } from "@/shared/ui";
import { WidgetButton } from "@/widgets/widgetButton";

import { useChatStore } from "@/features/chat";
import { ROUTES, useNavigate } from "@/features/navigate";
import { usePopUpOpen } from "@/features/popUpOpen";
import { useUserInfo } from "@/features/userInfo";

import styled from "styled-components";

function App() {
  const { isLogin, courseCategory, courseName } = useUserInfo();
  const { isOpen, setToggle } = usePopUpOpen();
  const { setCurrentPage } = useNavigate();
  const { setMessages } = useChatStore();
  // const { isSummationLoading } = useCourseSummationStore();

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
  }, [isLogin]);

  useEffect(() => {
    setMessages([]);
  }, [courseCategory, courseName]);

  return (
    <>
      {isLogin ? (
        <S.Container>
          {/* {isSummationLoading ? (
            <S.LoadingContainer>
              <Loading />
            </S.LoadingContainer>
          ) : (
            <>
              <Video />
              <WidgetButton isOpen={isOpen} setIsOpen={setToggle} />
              {isOpen && <Router />}
            </>
          )} */}
          <>
              <Video />
              <WidgetButton isOpen={isOpen} setIsOpen={setToggle} />
              {isOpen && <Router />}
            </>
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

  LoadingContainer: styled.div`
    padding-top: 450px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
};
