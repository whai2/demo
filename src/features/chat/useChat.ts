import { create } from "zustand";

import { functionChat } from "./apis/chat.api";
import {
  followupQuestionFunctions,
  metaFunctions,
  metaQuizFunctions,
} from "./functions";
import {
  currentCoursePrompt,
  followupQuestionPrompt,
  metaIntentClassificationSystemPrompt,
  quizIntentClassificationSystemPrompt,
  userEnhancePrompt,
  userEnhanceQuizPrompt,
} from "./prompt";

import { useUserInfo } from "@/features/userInfo";
import { parseDurationToSeconds, videoStore } from "@/features/video";
import { EnglishCourses, KoreanCourses } from "./constants/constants";

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
  answerStyle: "",
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),

  setIsLoading: (isLoading) => set({ isLoading }),
  setRecommendations: (recommendations) => set({ recommendations }),
  setIsQuiz: (isQuiz) => set({ isQuiz }),
  setLastQuiz: (lastQuiz) => set({ lastQuiz }),
  setAnswerStyle: (answerStyle) => set({ answerStyle }),
}));

export const useSendChat = () => {
  const { setMessages, setIsLoading, setIsQuiz, setLastQuiz, answerStyle } =
    useChatStore();
  const {
    courseCategory,
    courseName,
    name,
    job,
    year,
    courseAttendanceRate,
    currentLanguage,
  } = useUserInfo();
  const { progress, currentVideo } = videoStore();

  const courses = currentLanguage === "한국어" ? KoreanCourses : EnglishCourses;

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  const currentVideoDuration = parseDurationToSeconds(
    currentVideo?.duration ?? ""
  );

  const currentVideoId = currentVideo?.id;
  const currentVideoProgress = progress[currentVideoId ?? ""];

  const progressPercentage = currentVideoDuration
    ? (currentVideoProgress / currentVideoDuration) * 100
    : 0;

  const sendChatCallback = async (
    text: string,
    setText?: (text: string) => void
  ) => {
    const prompt = currentCoursePrompt(course as unknown as CourseInfo);

    const enhancedUserMessage = userEnhancePrompt(
      text,
      currentLanguage === "English"
    );
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
        metaIntentClassificationSystemPrompt(
          prompt,
          currentLanguage === "English"
        ),
        metaFunctions(currentLanguage)
      );

      const metaData = await metaResponse.json();

      const intent = JSON.parse(
        metaData.choices[0].message.function_call.arguments
      ).intent;

      if (intent === "general_question") {
        // ✅ 일반 스트리밍 LLM 응답
        await runGeneralStreaming(
          currentText,
          setMessages,
          course as unknown as CourseInfo,
          name,
          job,
          year,
          answerStyle,
          currentLanguage
        );
      } else if (intent === "course_recommendation") {
        // ✅ 강의 추천 흐름 (2단계)
        await runRecommendationFlow(
          currentText,
          setMessages,
          setIsLoading,
          currentCourses as unknown as CourseCategory,
          course as unknown as CourseInfo,
          courseCategory,
          name,
          job,
          year,
          courseAttendanceRate,
          currentLanguage
        );
      } else if (intent === "course_quiz") {
        // ✅ 강의 퀴즈 흐름
        await runCourseQuizFlow(
          currentText,
          setMessages,
          setIsQuiz,
          setLastQuiz,
          setIsLoading,
          course as unknown as CourseInfo,
          name,
          job,
          year,
          currentLanguage,
          parseInt(progressPercentage.toFixed(0))
        );
      } else {
        await runGeneralStreaming(
          currentText,
          setMessages,
          course as unknown as CourseInfo,
          name,
          job,
          year,
          answerStyle,
          currentLanguage
        );
      }

      setIsLoading(false);
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

  const sendQuizAnswer = async (
    answer: string,
    quiz: Quiz,
    setText?: (text: string) => void
  ) => {
    const enhancedUserMessage = userEnhanceQuizPrompt(
      answer,
      currentLanguage === "English"
    );
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
        quizIntentClassificationSystemPrompt(
          answer,
          quiz,
          currentLanguage === "English"
        ),
        metaQuizFunctions(currentLanguage)
      );

      const metaData = await metaResponse.json();

      const intent = JSON.parse(
        metaData.choices[0].message.function_call.arguments
      ).intent;

      if (intent === "quiz_answer") {
        await runCourseQuizAnswerFlow(
          quiz,
          currentText,
          setMessages,
          setIsLoading,
          name,
          currentLanguage,
          true
        );
      } else if (intent === "others") {
        // ✅ 강의 추천 흐름 (2단계)
        await runGeneralStreaming(
          currentText,
          setMessages,
          course as unknown as CourseInfo,
          name,
          job,
          year,
          answerStyle,
          currentLanguage
        );
      } else {
        await runGeneralStreaming(
          currentText,
          setMessages,
          course as unknown as CourseInfo,
          name,
          job,
          year,
          answerStyle,
          currentLanguage
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

export const getTailQuestion = async (
  messages: MessageType[],
  currentLanguage: string
) => {
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");

  if (!lastAssistantMessage) {
    return null;
  }

  try {
    const followupResponse = await functionChat(
      followupQuestionPrompt(
        lastAssistantMessage.content,
        currentLanguage === "English"
      ),
      followupQuestionPrompt(
        lastAssistantMessage.content,
        currentLanguage === "English"
      ),
      followupQuestionFunctions(currentLanguage)
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
  const { setMessages, setIsLoading, answerStyle } = useChatStore();
  const { courseCategory, courseName, name, job, year, currentLanguage } =
    useUserInfo();

    const courses = currentLanguage === "한국어" ? KoreanCourses : EnglishCourses;

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
      year,
      answerStyle,
      currentLanguage
    );

    setIsLoading(false);
  };

  return sendTailQuestionCallback;
};
