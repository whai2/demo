import { create } from "zustand";

import { functionChat, streamChat } from "./apis/chat.api";
import { functions, metaFunctions } from "./functions";
import {
  courseRecommendationSystemPrompt,
  currentCoursePrompt,
  formatCoursesToMarkdown,
  generalQuestionSystemPrompt,
  metaIntentClassificationSystemPrompt,
  userEnhancePrompt,
} from "./prompt";

import { aiCourses } from "./constants/constants";

import { ChatState, Course, MessageType } from "./type";

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  recommendations: [],
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setRecommendations: (recommendations) => set({ recommendations }),
}));

export const useSendChat = (text: string, setText: (text: string) => void) => {
  const { setMessages, setIsLoading } = useChatStore();

  const course = aiCourses["인공지능"][0] as unknown as Course;
  const prompt = currentCoursePrompt(course);

  const enhancedUserMessage = userEnhancePrompt(text);

  const sendChatCallback = async () => {
    const currentText = text;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: currentText, isLoading: false },
    ]);

    setText("");
    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", isLoading: true },
    ]);

    try {
      const metaResponse = await functionChat(
        enhancedUserMessage,
        metaIntentClassificationSystemPrompt(prompt),
        metaFunctions
      );

      const metaData = await metaResponse.json();
      const intent = JSON.parse(
        metaData.choices[0].message.function_call.arguments
      ).intent;

      if (intent === "general_question") {
        // ✅ 일반 스트리밍 LLM 응답
        console.log("일반 질문");
        await runGeneralStreaming(currentText, setMessages);
      } else if (intent === "course_recommendation") {
        // ✅ 강의 추천 흐름 (2단계)
        console.log("강의 추천");
        await runRecommendationFlow(currentText, setMessages);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return sendChatCallback;
};

const runGeneralStreaming = async (
  userMessage: string,
  setMessages: (
    messages: MessageType[] | ((prevMessages: MessageType[]) => MessageType[])
  ) => void
) => {
  const course = aiCourses["인공지능"][0] as unknown as Course;
  const prompt = currentCoursePrompt(course);

  const enhancedUserMessage = userEnhancePrompt(userMessage);

  const response = await streamChat(
    enhancedUserMessage,
    generalQuestionSystemPrompt(prompt)
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
};

const runRecommendationFlow = async (
  userMessage: string,
  setMessages: (
    messages: MessageType[] | ((prevMessages: MessageType[]) => MessageType[])
  ) => void
) => {
  const courses = aiCourses["인공지능"] as unknown as Course[];

  const currentCourse = aiCourses["인공지능"][0] as unknown as Course;
  const prompt = currentCoursePrompt(currentCourse);

  const coursesMarkdown = formatCoursesToMarkdown(courses);

  const enhancedUserMessage = `
    [사용자 질문]
    ${userMessage}

    [현재 수강 중인 강의 목록 정보]
    ${prompt}

    [다음 강의 목록 정보]
    ${coursesMarkdown}
  `;

  const response = await streamChat(
    enhancedUserMessage,
    courseRecommendationSystemPrompt
  );

  if (!response.ok || !response.body) {
    throw new Error("네트워크 응답 실패");
  }

  setMessages((prevMessages) => {
    const updatedMessages = [...prevMessages];
    updatedMessages[updatedMessages.length - 1].isLoading = false;
    return updatedMessages;
  });

  while (true) {
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

    let functionName = "";
    let functionArguments = "";
    let functionCallFinished = false;

    const response2 = await functionChat(
      assistantMessage,
      courseRecommendationSystemPrompt,
      functions
    );

    if (!response2.ok || !response2.body) {
      throw new Error("네트워크 응답 실패");
    }

    const reader2 = response2.body.getReader();
    const decoder2 = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader2.read();
      if (done) break;

      const chunk = decoder2.decode(value, { stream: true });
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

            if (delta?.function_call?.name) {
              functionName = delta.function_call.name;
            }

            if (delta?.function_call?.arguments) {
              functionArguments += delta.function_call.arguments;
            }

            if (parsed.choices[0].finish_reason === "function_call") {
              if (functionName === "recommend_course") {
                try {
                  const args = JSON.parse(functionArguments);

                  console.log(args);
                } catch (error) {
                  console.error(
                    "❌ function_call arguments 파싱 실패:",
                    functionArguments,
                    error
                  );
                }

                return;
              }
            }
          } catch (error) {
            console.error("JSON 파싱 에러", error);
          }
        }
      }

      if (functionCallFinished) break;
    }
  }
};
