import { functionChat, streamChat } from "../apis/chat.api";
import { CourseCategory, CourseInfo, MessageType } from "../type";
import { userIntentClassificationFunctions } from "./functionCall";
import {
  userIntentClassificationSystemPrompt,
  userIntentClassificationFunctionPrompt,
  courseRecommendationUserPrompt,
} from "./prompt";

export const runRecommendationFlow = async (
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
  const enhancedUserMessage = courseRecommendationUserPrompt(
    course,
    currentCourses,
    userMessage
  );

  const response = await streamChat(
    enhancedUserMessage,
    userIntentClassificationSystemPrompt(name, job, year, courseAttendanceRate)
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
      userIntentClassificationFunctionPrompt(name, job, year, generatedAnswer),
      userIntentClassificationFunctions
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
          contents: [],
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
        contents: args.contents || [],
      };
      return updated;
    });
  }
};
