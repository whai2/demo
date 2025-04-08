import { functionChat, streamChat } from "../apis/chat.api";
import { functions } from "./functionCall";
import {
  courseFunctionSystemPrompt,
  courseRecommendationSystemPrompt,
  courseRecommendationUserPrompt,
} from "./prompt";

import { useUserInfo } from "@/features/userInfo";
import { EnglishCourses, KoreanCourses } from "../constants/constants";
import { CourseCategory, CourseInfo } from "../type";
import { useChatStore } from "../useChat";

export const useCourseRecommendChat = () => {
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

  const callback = async (userMessage: string) => {
    const enhancedUserMessage = courseRecommendationUserPrompt(
      course as unknown as CourseInfo,
      currentCourses as unknown as CourseCategory,
      userMessage,
      courseCategory,
      currentLanguage === "English"
    );

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage, isLoading: false },
    ]);

    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", isLoading: true },
    ]);

    const response = await streamChat(
      enhancedUserMessage,
      courseRecommendationSystemPrompt(
        name,
        job,
        year,
        course as unknown as CourseInfo,
        currentCourses as unknown as CourseCategory,
        courseCategory,
        currentLanguage === "English"
      )
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

      let generatedAnswer = "";
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
        courseFunctionSystemPrompt(
          name,
          job,
          year,
          generatedAnswer,
          courseCategory,
          currentLanguage === "English"
        ),
        functions(currentLanguage)
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

      setIsLoading(false);
    }
  };

  return { callback };
};
