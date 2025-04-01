import { Loading } from "@/shared/ui";
import ReferenceToggle from "./ReferenceToggle";
import TailQuestions from "./TailQuestion";
import TextEditor from "./TextEditor";

import { useChatStore } from "@/features/chat";
import { useAutoScroll } from "../hooks/useAutoScroll";

import styled from "styled-components";

function ChatPage() {
  const { messages, isLoading } = useChatStore();
  const { containerRef } = useAutoScroll({ data: messages });

  const lastMessage = messages[messages.length - 1];

  console.log(lastMessage);

  return (
    <S.Container ref={containerRef}>
      {messages.map((message, index) =>
        message.role && message.role === "assistant" ? (
          message.isLoading ? (
            <Loading />
          ) : (
            <S.MessagePosition key={index} $isChatbot={true}>
              <S.MessageWithUnderObjects>
                <S.MessageWithProfile>
                  {/* <S.Profile /> */}
                  <S.MessageContainer $isChatbot={true}>
                    <TextEditor text={message.content} />
                    {message.reference && message.reference.isLoading ? (
                      <Loading />
                    ) : (
                      <ReferenceToggle
                        reference={message.reference?.reference}
                      />
                    )}
                  </S.MessageContainer>
                </S.MessageWithProfile>

                {message.recommendationCourses &&
                  message.recommendationCourses.isLoading ? (
                    <Loading />
                  ) : (
                    <div>
                      {message.recommendationCourses?.courses.map(
                        (course) => (
                          <div key={course.name}>{course.name}</div>
                        )
                      )}
                    </div>
                  )}
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
      {!isLoading && lastMessage && !lastMessage.isCourseRecommendation && (
        <TailQuestions lastMessage={lastMessage} />
      )}
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

  // Profile: styled(CamiProfile)`
  //   flex-shrink: 0;
  //   width: 24px;
  //   height: 24px;
  // `,

  FileContainer: styled.div`
    display: flex;
    flex-direction: column;
  `,
};
