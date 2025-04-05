// import { useState } from "react";

import { Loading } from "@/shared/ui";
import ReferenceToggle from "./ReferenceToggle";
import TailQuestions from "./TailQuestion";
import TextEditor from "./TextEditor";
import IntentQuestionButton from "./courseRecommend/IntentQuestionButton";
import RecommendCourse from "./courseRecommend/RecommendCourse";
import NextSteps from "./quiz/NextSteps";
import Quiz from "./quiz/Quiz";
import Quiz2 from "./quiz/Quiz2";
// import QuizBottomSheet from "./quiz/QuizBottomSheet";

import { useChatStore } from "@/features/chat";
import { useAutoScroll } from "../hooks/useAutoScroll";

import { ReactComponent as CoxwaveLogo } from "../assets/profile.svg";

import styled from "styled-components";

function ChatPage() {
  const { messages, isLoading } = useChatStore();
  // const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const { containerRef } = useAutoScroll({ data: messages });

  const lastMessage = messages[messages.length - 1];

  return (
    <S.Container ref={containerRef}>
      {messages.map((message, index) =>
        message.role && message.role === "assistant" ? (
          message.isLoading ? (
            <S.MessageWithProfile>
              <S.Profile />
              <Loading />
            </S.MessageWithProfile>
          ) : (
            <S.MessagePosition key={index} $isChatbot={true}>
              <S.MessageWithUnderObjects>
                <S.MessageWithProfile>
                  <S.Profile />
                  <S.MessageContainer $isChatbot={true}>
                    <TextEditor text={message.content} />
                    {message.reference && message.reference.isLoading ? (
                      <Loading />
                    ) : (
                      <ReferenceToggle
                        reference={message.reference?.reference}
                        isQuizReference={message.reference?.isQuizReference}
                      />
                    )}
                    {(() => {
                      if (!message.courseQuiz) return null;

                      if (message.courseQuiz.isLoading) {
                        return <Loading />;
                      }

                      if (message.courseQuiz.quiz) {
                        if ("choices" in message.courseQuiz.quiz) {
                          return <Quiz quiz={message.courseQuiz.quiz} />;
                        } else if ("answerText" in message.courseQuiz.quiz) {
                          return (
                            <Quiz2 quiz={message.courseQuiz.quiz as Quiz2} />
                          );
                        }
                      }

                      return null;
                    })()}

                    {(() => {
                      const data = message.recommendationCourses;

                      if (!data) return null;

                      if (data.isLoading) {
                        return <Loading />;
                      }

                      if (data.contents) {
                        return (
                          <IntentQuestionButton contents={data.contents} />
                        );
                      }

                      if (data.courses) {
                        return (
                          <S.CoursesContainer>
                            {data.courses.map((course) => (
                              <RecommendCourse
                                key={course.name}
                                course={course}
                              />
                            ))}
                          </S.CoursesContainer>
                        );
                      }

                      return null;
                    })()}

                    {(() => {
                      if (!message.userResult) return null;

                      if (message.userResult.isLoading) {
                        return <Loading />;
                      }

                      if (message.userResult) {
                        return <NextSteps nextSteps={message.userResult} />;
                      }

                      return null;
                    })()}
                  </S.MessageContainer>
                </S.MessageWithProfile>
              </S.MessageWithUnderObjects>
            </S.MessagePosition>
          )
        ) : (
          <S.MessagePosition key={index} $isChatbot={false}>
            <S.MessageContainer $isChatbot={false}>
              <S.Text $isChatbot={false}>{message.content}</S.Text>
            </S.MessageContainer>
          </S.MessagePosition>
        )
      )}
      {!isLoading &&
        lastMessage &&
        lastMessage.role &&
        lastMessage.role === "assistant" &&
        !lastMessage.isCourseRecommendation &&
        !lastMessage.courseQuiz &&
        !lastMessage.reference?.isQuizReference &&
        !lastMessage.userResult && <TailQuestions lastMessage={lastMessage} />}

      {/* <BottomSheet>
        <QuizBottomSheet handleClose={() => setIsBottomSheetOpen(false)} />
      </BottomSheet> */}
    </S.Container>
  );
}

export default ChatPage;

const S = {
  Container: styled.div`
    display: flex;
    padding: 20px;
    flex-direction: column;
    flex: 1 0 0;
    align-self: stretch;
    background: ${({ theme }) => theme.chatBody?.backgroundColor ?? "#f5f5f5"};
    overflow-y: auto;
    height: 100%;
  `,

  MessagePosition: styled.div<{ $isChatbot: boolean }>`
    display: flex;
    width: 100%;
    padding-bottom: 20px;
    justify-content: ${(props) =>
      props.$isChatbot ? "flex-start" : "flex-end"};
  `,

  ObserverDiv: styled.div`
    margin: 0;
    padding: 0;
    height: 0;
  `,

  MessageContainer: styled.div<{ $isChatbot: boolean }>`
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    align-self: flex-end;
    gap: 10px;
    border-radius: ${(props) =>
      props.$isChatbot ? "4px 12px 12px 12px" : "12px 4px 12px 12px"};
    background: ${({ theme, $isChatbot }) =>
      $isChatbot
        ? theme.chatBubble?.Assistant?.backgroundColor ?? "#FFF"
        : theme.chatBubble?.User?.backgroundColor ?? "#e7e8e9"};
    max-width: 270px;
  `,

  Text: styled.span<{ $isChatbot: boolean }>`
    color: ${({ theme, $isChatbot }) =>
      $isChatbot
        ? theme.chatBubble?.Assistant?.color ?? "#090909"
        : theme.chatBubble?.User?.color ?? "#090909"};
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    white-space: normal;
    word-break: break-word;
    // overflow-wrap: break-word;
  `,

  MessageWithUnderObjects: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    align-self: stretch;
    min-width: 130px;
  `,

  MessageWithProfile: styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
  `,

  ProfileWrapper: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #000;
  `,

  Profile: styled(CoxwaveLogo)`
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  `,

  FileContainer: styled.div`
    display: flex;
    flex-direction: column;
  `,

  CoursesContainer: styled.div`
    display: flex;
    flex-direction: row;
    padding: 8px;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    overflow-x: auto;
  `,

  ContinuedMessageList: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    overflow-y: hidden;
  `,
};
