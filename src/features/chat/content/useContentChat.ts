import { EnglishCourses, KoreanCourses } from "@/features/chat";
import { useUserInfo } from "@/features/userInfo";
import { functionChat, streamChat } from "../apis/chat.api";
import { useChatStore } from "../useChat";
import { referenceFunctions, referenceFunctionsEnglish } from "./functionCall";
import {
  courseGeneralChatUserPrompt,
  courseGeneralChatUserPromptEnglish,
  generalQuestionSystemPrompt,
  generalQuestionSystemPromptEnglish,
  referenceGenerateSystemPrompt,
  referenceGenerateSystemPromptEnglish,
  referenceGenerateUserPrompt,
  referenceGenerateUserPromptEnglish,
} from "./prompt";

import { CourseInfo, MessageType } from "../type";

export const runGeneralStreaming = async (
  userMessage: string,
  setMessages: (
    messages: MessageType[] | ((prevMessages: MessageType[]) => MessageType[])
  ) => void,
  course: CourseInfo,
  name: string,
  job: string,
  year: string,
  currentLanguage: string
) => {
  const enhancedUserMessage =
    currentLanguage === "한국어"
      ? courseGeneralChatUserPrompt(
          userMessage,
          course,
          currentLanguage === "한국어"
        )
      : courseGeneralChatUserPromptEnglish(userMessage, course);

  const response = await streamChat(
    enhancedUserMessage,
    currentLanguage === "한국어"
      ? generalQuestionSystemPrompt(
          name,
          job,
          year,
          currentLanguage === "한국어"
        )
      : generalQuestionSystemPromptEnglish(name, job, year)
  );

  if (!response.ok || !response.body) {
    throw new Error("네트워크 응답 실패");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let assistantMessage = "";

  setMessages((prevMessages) => {
    const updatedMessages = [...prevMessages];
    updatedMessages[updatedMessages.length - 1].isLoading = false;
    return updatedMessages;
  });

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      if (line === "data: [DONE]") {
        // 스트리밍 종료
        break;
      }

      if (line.startsWith("data: ")) {
        const jsonStr = line.replace("data: ", "").trim();

        try {
          const parsed = JSON.parse(jsonStr);
          const delta = parsed.choices[0].delta;

          // 일반 응답 텍스트 처리
          if (delta?.content) {
            assistantMessage += delta.content;
            setMessages((prevMessages) => {
              const updated = [...prevMessages];
              updated[updated.length - 1].content = assistantMessage;
              return updated;
            });
          }
        } catch (error) {
          console.error("JSON 파싱 에러", error);
        }
      }
    }
  }

  const previousQuestion = userMessage;
  const previousAnswer = assistantMessage;

  setMessages((prevMessages) => {
    const updated = [...prevMessages];
    updated[updated.length - 1].reference = {
      isLoading: true,
      reference: null,
    };
    return updated;
  });

  const referenceResponse = await functionChat(
    currentLanguage === "한국어"
      ? referenceGenerateUserPrompt(
          previousAnswer,
          currentLanguage === "한국어"
        )
      : referenceGenerateUserPromptEnglish(previousAnswer),
    currentLanguage === "한국어"
      ? referenceGenerateSystemPrompt(
          course,
          previousQuestion,
          previousAnswer,
          currentLanguage === "한국어"
        )
      : referenceGenerateSystemPromptEnglish(
          course,
          previousQuestion,
          previousAnswer
        ),

    currentLanguage === "한국어"
      ? referenceFunctions(currentLanguage)
      : referenceFunctionsEnglish()
  );

  const responseData = await referenceResponse.json();
  const functionCall = responseData.choices[0]?.message?.function_call;

  if (!functionCall) {
    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].reference = {
        isLoading: false,
        reference: null,
      };
      return updated;
    });
    return;
  }

  const args = JSON.parse(functionCall.arguments || "{}");

  setMessages((prevMessages) => {
    const updated = [...prevMessages];
    updated[updated.length - 1].reference = {
      ...args,
      isLoading: false,
    };
    return updated;
  });
};

export const useContentChat = () => {
  const { setMessages, setIsLoading } = useChatStore();
  const { courseCategory, courseName, name, job, year, currentLanguage } =
    useUserInfo();

  const courses = currentLanguage === "한국어" ? KoreanCourses : EnglishCourses;

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  const sendChatCallback = async (text: string) => {
    const currentText = text;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: currentText, isLoading: false },
    ]);

    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", isLoading: true },
    ]);

    await runGeneralStreaming(
      currentText,
      setMessages,
      course as unknown as CourseInfo,
      name,
      job,
      year,
      currentLanguage
    );
    setIsLoading(false);
  };

  return { sendChatCallback };
};
