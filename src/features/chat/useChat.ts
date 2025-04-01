import { create } from "zustand";

import { functionChat, streamChat } from "./apis/chat.api";
import {
  followupQuestionFunctions,
  functions,
  metaFunctions,
  referenceFunctions,
} from "./functions";
import {
  courseRecommendationSystemPrompt,
  currentCoursePrompt,
  followupQuestionPrompt,
  formatCoursesToMarkdown,
  generalQuestionSystemPrompt,
  metaIntentClassificationSystemPrompt,
  referenceGeneratePrompt,
  referenceQuestionPrompt,
  userEnhancePrompt,
  courseFunctionPrompt,
} from "./prompt";

import { useUserInfo } from "@/features/userInfo";
import { courses } from "./constants/constants";

import { ChatState, CourseCategory, CourseInfo, MessageType } from "./type";

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
  const { courseCategory, courseName, name, job, year, courseAttendanceRate } = useUserInfo();
  console.log(courseAttendanceRate);

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  const prompt = currentCoursePrompt(course as unknown as CourseInfo);

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
        await runGeneralStreaming(
          currentText,
          setMessages,
          course as unknown as CourseInfo,
          name,
          job,
          year,
        );
      } else if (intent === "course_recommendation") {
        // ✅ 강의 추천 흐름 (2단계)
        console.log("강의 추천");
        await runRecommendationFlow(
          currentText,
          setMessages,
          currentCourses as unknown as CourseCategory,
          course as unknown as CourseInfo,
          name,
          job,
          year,
          courseAttendanceRate
        );
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
  ) => void,
  course: CourseInfo,
  name: string,
  job: string,
  year: string,
) => {
  const prompt = currentCoursePrompt(course);

  const enhancedUserMessage = userEnhancePrompt(userMessage);

  const response = await streamChat(
    enhancedUserMessage,
    generalQuestionSystemPrompt(prompt, name, job, year)
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
    referenceQuestionPrompt(previousAnswer),
    referenceGeneratePrompt(
      currentCoursePrompt(course),
      previousQuestion,
      previousAnswer
    ),
    referenceFunctions
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

const runRecommendationFlow = async (
  userMessage: string,
  setMessages: (
    messages: MessageType[] | ((prevMessages: MessageType[]) => MessageType[])
  ) => void,
  currentCourses: CourseCategory,
  course: CourseInfo,
  name: string,
  job: string,
  year: string,
  courseAttendanceRate: number
) => {
  const prompt = currentCoursePrompt(course);

  const coursesMarkdown = formatCoursesToMarkdown(currentCourses);

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
    courseRecommendationSystemPrompt(name, job, year, courseAttendanceRate)
  );

  if (!response.ok || !response.body) {
    throw new Error("네트워크 응답 실패");
  }

  setMessages((prevMessages) => {
    const updatedMessages = [...prevMessages];
    updatedMessages[updatedMessages.length - 1].isLoading = false;
    updatedMessages[updatedMessages.length - 1].isCourseRecommendation = true;
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

    let generatedAnswer = '';
    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      generatedAnswer = updated[updated.length - 1].content;
      updated[updated.length - 1].recommendationCourses = {
        isLoading: true,
        courses: [],
      };
      return updated;
    });

    const getRecommendationCoursesResponse = await functionChat(
      enhancedUserMessage,
      courseFunctionPrompt(name, job, year, generatedAnswer),
      functions
    );

    if (
      !getRecommendationCoursesResponse.ok ||
      !getRecommendationCoursesResponse.body
    ) {
      throw new Error("네트워크 응답 실패");
    }

    const getRecommendationCoursesResponseData =
      await getRecommendationCoursesResponse.json();
    const functionCall =
      getRecommendationCoursesResponseData.choices[0]?.message?.function_call;

    if (!functionCall) {
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        updated[updated.length - 1].recommendationCourses = {
          isLoading: false,
          courses: [],
        };
        return updated;
      });
      return;
    }

    const args = JSON.parse(functionCall.arguments || "{}");

    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].recommendationCourses = {
        isLoading: false,
        courses: args.courses || [],
      };
      return updated;
    });
  }
};

export const getTailQuestion = async (messages: MessageType[]) => {
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");

  if (!lastAssistantMessage) {
    return null;
  }

  try {
    const followupResponse = await functionChat(
      followupQuestionPrompt(lastAssistantMessage.content),
      followupQuestionPrompt(lastAssistantMessage.content),
      followupQuestionFunctions
    );

    const responseData = await followupResponse.json();
    const functionCall = responseData.choices[0]?.message?.function_call;

    if (!functionCall) {
      return null;
    }

    const args = JSON.parse(functionCall.arguments || "{}");
    return args.questions || [];
  } catch (error) {
    console.error("Failed to generate follow-up questions:", error);
    return null;
  }
};

export const useSendTailQuestion = () => {
  const { setMessages, setIsLoading } = useChatStore();
  const { courseCategory, courseName, name, job, year } = useUserInfo();

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  const sendTailQuestionCallback = async (question: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: question, isLoading: false },
    ]);

    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", isLoading: true },
    ]);

    await runGeneralStreaming(
      question,
      setMessages,
      course as unknown as CourseInfo,
      name,
      job,
      year
    );

    setIsLoading(false);
  };

  return sendTailQuestionCallback;
};
