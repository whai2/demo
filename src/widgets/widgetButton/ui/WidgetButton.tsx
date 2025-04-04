import Alarm from "./Alarm";

import { useAlarmStore, useTriggerInterval } from "@/features/alarm";
import {
  runCourseQuizFlow,
  runRecommendationFlow,
  useChatStore,
} from "@/features/chat";
import { courses } from "@/features/chat/constants/constants";
import { CourseCategory, CourseInfo } from "@/features/chat/type";
import { ROUTES, useNavigate } from "@/features/navigate";
import { usePopUpOpen } from "@/features/popUpOpen";
import { useUserInfo } from "@/features/userInfo";

import { ReactComponent as CloseIcon } from "../assets/close.svg";
import { ReactComponent as ChatIcon } from "../assets/logo.svg";

import styled from "styled-components";

function WidgetButton({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { isTriggered, data, setTriggered, isQuiz } = useAlarmStore();
  const { setCurrentPage } = useNavigate();
  const { setOpen } = usePopUpOpen();
  const { setMessages, setIsLoading, setIsQuiz, setLastQuiz } = useChatStore();
  const { courseCategory, courseName, name, job, year, courseAttendanceRate } =
    useUserInfo();

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  const { clipIdRef } = useTriggerInterval();
  const isCallToAction = data?.type === "callToAction";

  // const sendChatCallback = useSendChat();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <S.ChatContainer>
      <S.ChatButton onClick={handleClick} $isOpen={isOpen}>
        {isOpen ? (
          <>
            <S.Text $isOpen={isOpen}>닫기</S.Text>
            <CloseIcon />
          </>
        ) : (
          <>
            <S.ChatIcon />
            <S.Text $isOpen={isOpen}>AI 챗봇</S.Text>
          </>
        )}
      </S.ChatButton>

      {isTriggered ? (
        <Alarm
          key={clipIdRef.current}
          onClick={async () => {
            if (data.question) {
              setOpen();
              setTriggered(false);
              setCurrentPage(ROUTES.CHAT);

              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  role: "user",
                  content: data.question as string,
                  isLoading: false,
                },
              ]);

              setIsLoading(true);

              setMessages((prevMessages) => [
                ...prevMessages,
                { role: "assistant", content: "", isLoading: true },
              ]);

              if (isQuiz) {
                await runCourseQuizFlow(
                  data.question,
                  setMessages,
                  setIsQuiz,
                  setLastQuiz,
                  setIsLoading,
                  course as unknown as CourseInfo,
                  name,
                  job,
                  year,
                  courseAttendanceRate
                );

                return;
              }

              await runRecommendationFlow(
                data.question,
                setMessages,
                currentCourses as unknown as CourseCategory,
                course as unknown as CourseInfo,
                name,
                job,
                year,
                courseAttendanceRate
              );

              setIsLoading(false);
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
      $isOpen ? "10px 12px 10px 22px;" : "10px 12px 10px 10px"};
    gap: ${({ $isOpen }) => ($isOpen ? "10px" : "10px")};

    background-color: ${({ theme, $isOpen }) =>
      $isOpen
        ? theme.floatingButton?.openChat?.backgroundColor ?? "#000"
        : theme.floatingButton?.closeChat?.backgroundColor ?? "#1A2A9C"};

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

  ChatIcon: styled(ChatIcon)`
    width: 24px;
    height: 24px;
  `,
};
