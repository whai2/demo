import { create } from "zustand";

import { functionChat, streamChat } from "./apis/chat.api";
import {
  courseQuizFunctions,
  followupQuestionFunctions,
  metaFunctions,
} from "./functions";
import {
  courseQuizSystemPrompt,
  currentCoursePrompt,
  followupQuestionPrompt,
  metaIntentClassificationSystemPrompt,
  quizAnswerSystemPrompt,
  quizAnswerUserPrompt,
  userEnhancePrompt,
} from "./prompt";

import { useUserInfo } from "@/features/userInfo";
import { courses } from "./constants/constants";

import { runRecommendationFlow } from "./courseRecommend/useIntentClassification";
import { runGeneralStreaming } from "./generalChat/useGeneralChat";
import {
  ChatState,
  CourseCategory,
  CourseInfo,
  MessageType,
  Quiz,
} from "./type";

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

export const useSendChat = () => {
  const { setMessages, setIsLoading } = useChatStore();
  const { courseCategory, courseName, name, job, year, courseAttendanceRate } =
    useUserInfo();

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  const prompt = currentCoursePrompt(course as unknown as CourseInfo);

  const sendChatCallback = async (
    text: string,
    setText?: (text: string) => void
  ) => {
    const enhancedUserMessage = userEnhancePrompt(text);
    const currentText = text;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: currentText, isLoading: false },
    ]);

    setText && setText("");
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
          year
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
      } else if (intent === "course_quiz") {
        // ✅ 강의 퀴즈 흐름
        console.log("강의 퀴즈");
        await runCourseQuizFlow(
          currentText,
          setMessages,
          course as unknown as CourseInfo,
          name,
          job,
          year
        );
      } else {
        console.log("일반 질문", "예외 상황");
        await runGeneralStreaming(
          currentText,
          setMessages,
          course as unknown as CourseInfo,
          name,
          job,
          year
        );
      }

      setIsLoading(false);
    } catch (error) {
      await runGeneralStreaming(
        currentText,
        setMessages,
        course as unknown as CourseInfo,
        name,
        job,
        year
      );
      setIsLoading(false);
    }
  };

  return sendChatCallback;
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
      return [];
    }

    const args = JSON.parse(functionCall.arguments || "{}");
    return args.questions || [];
  } catch (error) {
    console.error("Failed to generate follow-up questions:", error);
    return [];
  }
};

const runCourseQuizFlow = async (
  userMessage: string,
  setMessages: (
    messages: MessageType[] | ((prevMessages: MessageType[]) => MessageType[])
  ) => void,
  course: CourseInfo,
  name: string,
  job: string,
  year: string
) => {
  const prompt = currentCoursePrompt(course);

  const enhancedUserMessage = `
    [사용자 질문]
    ${userMessage}
    
    [퀴즈 제공 기준]
    특히, 퀴즈를 통해 복습 방법을 알고 싶은 경우, 퀴즈를 제공해주세요.
    또한, 이해도를 확인하고자 하는 경우, 퀴즈를 제공해주세요.

    [현재 수강 중인 강의 목록 정보]
    ${prompt}
  `;

  const response = await functionChat(
    enhancedUserMessage,
    courseQuizSystemPrompt(prompt, name, job, year),
    courseQuizFunctions
  );

  if (!response.ok || !response.body) {
    throw new Error("네트워크 응답 실패");
  }

  const responseData = await response.json();
  const functionCall = responseData.choices[0]?.message?.function_call;

  if (!functionCall) {
    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].courseQuiz = {
        isLoading: false,
        quiz: {
          question: "",
          choices: [],
          answerIndex: 0,
        },
      };
      return updated;
    });
    return;
  }

  const args = await JSON.parse(functionCall.arguments || "{}");

  // 먼저 isLoading을 false로 설정
  setMessages((prevMessages) => {
    const updated = [...prevMessages];
    updated[updated.length - 1].isLoading = false;
    return updated;
  });

  // introMessage가 있으면 스트리밍 효과로 표시
  if (args.introMessage) {
    let displayedMessage = "";
    const introMessage = args.introMessage;

    // 글자 단위로 스트리밍 효과 구현
    for (let i = 0; i < introMessage.length; i++) {
      displayedMessage += introMessage[i];

      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        updated[updated.length - 1].content = displayedMessage;
        return updated;
      });

      // 타이핑 효과를 위한 딜레이 (10-30ms)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.random() * 20 + 10)
      );
    }
  }

  setMessages((prevMessages) => {
    const updated = [...prevMessages];
    updated[updated.length - 1].courseQuiz = {
      isLoading: true,
      quiz: {
        question: "",
        choices: [],
        answerIndex: 0,
      },
    };
    return updated;
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 퀴즈 정보 설정
  setMessages((prevMessages) => {
    const updated = [...prevMessages];
    updated[updated.length - 1].courseQuiz = {
      quiz: args.question,
      isLoading: false,
    };
    return updated;
  });
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

export const useSendQuizAnswer = (quiz: Quiz) => {
  const { setMessages } = useChatStore();
  const { name } = useUserInfo();

  // const currentCourses = courses.category.find(
  //   (cat) => cat.name === courseCategory
  // );

  // const course = currentCourses?.courses.find(
  //   (course) => course.name === courseName
  // );

  const sendQuizAnswerCallback = async (answer: string) => {
    const userMessage = quizAnswerUserPrompt(name, answer);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: answer, isLoading: false },
    ]);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", isLoading: true },
    ]);

    const response = await streamChat(
      userMessage,
      quizAnswerSystemPrompt(quiz, answer)
    );

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1].isLoading = false;
      return updatedMessages;
    });

    if (!response.ok || !response.body) {
      throw new Error("네트워크 응답 실패");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let assistantMessage = "";

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
            console.log("delta", delta);

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

  return sendQuizAnswerCallback;
};
