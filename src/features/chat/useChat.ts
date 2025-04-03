import { create } from "zustand";

import { functionChat } from "./apis/chat.api";
import { followupQuestionFunctions, metaFunctions, metaQuizFunctions } from "./functions";
import {
  currentCoursePrompt,
  followupQuestionPrompt,
  metaIntentClassificationSystemPrompt,
  quizIntentClassificationSystemPrompt,
  userEnhancePrompt,
  userEnhanceQuizPrompt,
} from "./prompt";

import { useUserInfo } from "@/features/userInfo";
import { courses } from "./constants/constants";

import { runRecommendationFlow } from "./courseRecommend/useIntentClassification";
import { runGeneralStreaming } from "./generalChat/useGeneralChat";
import { runCourseQuizAnswerFlow, runCourseQuizFlow } from "./quiz/useQuizChat";
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
  isQuiz: false,
  lastQuiz: null,
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),

  setIsLoading: (isLoading) => set({ isLoading }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setIsQuiz: (isQuiz) => set({ isQuiz }),
  setLastQuiz: (lastQuiz) => set({ lastQuiz }),
}));

export const useSendChat = () => {
  const { setMessages, setIsLoading, setIsQuiz, setLastQuiz } = useChatStore();
  const { courseCategory, courseName, name, job, year, courseAttendanceRate } =
    useUserInfo();

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  const sendChatCallback = async (
    text: string,
    setText?: (text: string) => void
  ) => {
    const prompt = currentCoursePrompt(course as unknown as CourseInfo);

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
          setIsQuiz,
          setLastQuiz,
          course as unknown as CourseInfo,
          name,
          job,
          year,
          courseAttendanceRate
        );
      } else {
        await runGeneralStreaming(
          currentText,
          setMessages,
          course as unknown as CourseInfo,
          name,
          job,
          year
        );
      }
    } catch (error) {
      console.error("Failed to generate follow-up questions:", error);
      // await runGeneralStreaming(
      //   currentText,
      //   setMessages,
      //   course as unknown as CourseInfo,
      //   name,
      //   job,
      //   year
      // );
      setIsLoading(false);
    }
  };

  const sendQuizAnswer = async (answer: string, quiz: Quiz, setText?: (text: string) => void) => {
    const enhancedUserMessage = userEnhanceQuizPrompt(answer);
    const currentText = answer;
    // setIsQuiz(false);

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
        quizIntentClassificationSystemPrompt(answer, quiz),
        metaQuizFunctions
      );

      const metaData = await metaResponse.json();

      const intent = JSON.parse(
        metaData.choices[0].message.function_call.arguments
      ).intent;

      if (intent === "quiz_answer") {
        console.log("퀴즈 정답 확인");
        await runCourseQuizAnswerFlow(quiz, currentText, setMessages, name, true);
      } else if (intent === "others") {
        // ✅ 강의 추천 흐름 (2단계)
        console.log("일반 질문");
        await runGeneralStreaming(
          currentText,
          setMessages,
          course as unknown as CourseInfo,
          name,
          job,
          year
        );
      } else {
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
      setIsQuiz(false);
    } catch (error) {
      console.error("Failed to generate follow-up questions:", error);
      // await runGeneralStreaming(
      //   currentText,
      //   setMessages,
      //   course as unknown as CourseInfo,
      //   name,
      //   job,
      //   year
      // );
      setIsLoading(false);
      setIsQuiz(false);
    }
  };

  return { sendChatCallback, sendQuizAnswer };
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
