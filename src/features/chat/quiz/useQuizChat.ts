import { functionChat, streamChat } from "@/features/chat/apis/chat.api";

import { useChatStore } from "@/features/chat";
import { CourseInfo, MessageType, Quiz, Quiz2 } from "@/features/chat/type";
import { useUserInfo } from "@/features/userInfo";
import { EnglishCourses, KoreanCourses } from "../constants/constants";

import {
  courseQuizAnswerFunctions,
  courseQuizAnswerFunctionsEnglish,
  courseQuizFunctions,
  courseQuizFunctionsEnglish,
  referenceFunctions,
  referenceFunctionsEnglish,
} from "./functionCall";
import {
  courseQuizSystemPrompt,
  courseQuizSystemPromptEnglish,
  currentCoursePrompt,
  currentCoursePromptEnglish,
  nextQuizSystemPrompt,
  nextQuizSystemPromptEnglish,
  quizAnswerSystemPrompt,
  quizAnswerUserPrompt,
  quizAnswerUserPromptEnglish,
  quizMarkdownPrompt,
  quizMarkdownPromptEnglish,
  referenceGenerateSystemPrompt,
  referenceGenerateSystemPromptEnglish,
  referenceGenerateUserPrompt,
} from "./prompt";

export const runCourseQuizFlow = async (
  userMessage: string,
  setMessages: (
    messages: MessageType[] | ((prevMessages: MessageType[]) => MessageType[])
  ) => void,
  setIsQuiz: (isQuiz: boolean) => void,
  setLastQuiz: (lastQuiz: Quiz | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  course: CourseInfo,
  name: string,
  job: string,
  year: string,
  currentLanguage: string,
  progressPercentage?: number
) => {
  const prompt =
    currentLanguage === "한국어"
      ? currentCoursePrompt(course)
      : currentCoursePromptEnglish(course);

  const types = ["객관식", "단답형"];
  const randomType = types[Math.floor(Math.random() * types.length)];

  const enhancedUserMessage = `
    # very important
    ${currentLanguage === "English" ? "you must say english\n" : ""}

    [사용자 질문]
    ${userMessage}
    
    [퀴즈 제공 기준]
    특히, 퀴즈를 통해 복습 방법을 알고 싶은 경우, 퀴즈를 제공해주세요.
    또한, 이해도를 확인하고자 하는 경우, 퀴즈를 제공해주세요.

    [문제 유형]
    ${randomType}

    [현재 수강 중인 강의 목록 정보]
    ${prompt}

    ${currentLanguage === "English" ? "you must say english\n" : ""}
  `;

  const enhancedUserMessageEnglish = `
  # Very Important  
  You must respond in English only.

  [User Question]  
  ${userMessage}

  [Quiz Guidelines]  
  Please provide a quiz if the user is looking for a way to review through questions.  
  Also, provide a quiz if the user wants to assess their understanding of the content.

  [Question Type]  
  ${randomType}

  [Current Course Information]  
  ${prompt}

  You must respond in English only.
`;

  const response = await functionChat(
    currentLanguage === "한국어"
      ? enhancedUserMessage
      : enhancedUserMessageEnglish,

    currentLanguage === "한국어"
      ? courseQuizSystemPrompt(prompt, name, job, year, progressPercentage)
      : courseQuizSystemPromptEnglish(
          prompt,
          name,
          job,
          year,
          progressPercentage
        ),

    currentLanguage === "한국어"
      ? courseQuizFunctions(currentLanguage)
      : courseQuizFunctionsEnglish
  );

  if (!response.ok || !response.body) {
    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].isLoading = false;
      return updated;
    });
    setIsLoading(false);
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
      setIsLoading(false);
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
  setLastQuiz(args.question);
  setIsQuiz(true);
};

export const useSendQuizAnswer = (quiz: Quiz | Quiz2) => {
  const { setMessages, setIsQuiz, setIsLoading } = useChatStore();
  const { name, currentLanguage } = useUserInfo();

  // const currentCourses = courses.category.find(
  //   (cat) => cat.name === courseCategory
  // );

  // const course = currentCourses?.courses.find(
  //   (course) => course.name === courseName
  // );

  const sendQuizAnswerCallback = async (answer: string) => {
    const userMessage =
      currentLanguage === "한국어"
        ? quizAnswerUserPrompt(name, answer)
        : quizAnswerUserPromptEnglish(name, answer);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: answer, isLoading: false },
    ]);

    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", isLoading: true },
    ]);

    const response = await streamChat(
      userMessage,
      quizAnswerSystemPrompt(quiz, answer, name, currentLanguage === "English")
    );

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1].isLoading = false;
      return updatedMessages;
    });

    if (!response.ok || !response.body) {
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        updated[updated.length - 1].isLoading = false;
        return updated;
      });
      setIsLoading(false);
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

            // 일반 응답 텍스트 처리
            if (delta?.content) {
              assistantMessage += delta.content;

              setMessages((prevMessages) => {
                const updated = [...prevMessages];
                updated[updated.length - 1].content = assistantMessage;
                return updated;
              });
              setIsQuiz(false);
            }
          } catch (error) {
            console.error("JSON 파싱 에러", error);
            setIsQuiz(false);
            setIsLoading(false);
          }
        }
      }
    }

    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].userResult = {
        isLoading: true,
      };
      return updated;
    });

    const answerResponse = await functionChat(
      userMessage,
      quizAnswerSystemPrompt(quiz, answer, name, currentLanguage === "English"),
      currentLanguage === "English"
        ? courseQuizAnswerFunctionsEnglish()
        : courseQuizAnswerFunctions(currentLanguage)
    );

    if (!answerResponse.ok || !answerResponse.body) {
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        updated[updated.length - 1].userResult = {
          isLoading: false,
        };
        return updated;
      });
      setIsLoading(false);
      throw new Error("네트워크 응답 실패");
    }

    const answerResponseData = await answerResponse.json();
    const functionCall = answerResponseData.choices[0]?.message?.function_call;

    if (!functionCall) {
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        updated[updated.length - 1].userResult = {
          isLoading: false,
        };
        return updated;
      });
      setIsLoading(false);
      return;
    }

    const args = await JSON.parse(functionCall.arguments || "{}");

    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].userResult = {
        ...args,
        isLoading: false,
      };
      return updated;
    });

    setIsLoading(false);
  };

  return sendQuizAnswerCallback;
};

export const runCourseQuizAnswerFlow = async (
  quiz: Quiz,
  currentText: string,
  setMessages: (
    messages: MessageType[] | ((prevMessages: MessageType[]) => MessageType[])
  ) => void,
  setIsLoading: (isLoading: boolean) => void,
  name: string,
  currentLanguage: string,
  isInput?: boolean
) => {
  const userMessage =
    currentLanguage === "한국어"
      ? quizAnswerUserPrompt(name, currentText)
      : quizAnswerUserPromptEnglish(name, currentText);

  if (!isInput) {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: currentText, isLoading: false },
    ]);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", isLoading: true },
    ]);
  }

  const response = await streamChat(
    userMessage,
    quizAnswerSystemPrompt(
      quiz,
      currentText,
      name,
      currentLanguage === "English"
    )
  );

  setMessages((prevMessages) => {
    const updatedMessages = [...prevMessages];
    updatedMessages[updatedMessages.length - 1].isLoading = false;
    return updatedMessages;
  });

  if (!response.ok || !response.body) {
    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].isLoading = false;
      return updated;
    });
    setIsLoading(false);
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

  setMessages((prevMessages) => {
    const updated = [...prevMessages];
    updated[updated.length - 1].userResult = {
      isLoading: true,
    };
    return updated;
  });

  const answerResponse = await functionChat(
    userMessage,
    quizAnswerSystemPrompt(
      quiz,
      userMessage,
      name,
      currentLanguage === "English"
    ),
    currentLanguage === "한국어"
      ? courseQuizAnswerFunctions(currentLanguage)
      : courseQuizAnswerFunctionsEnglish()
  );

  if (!answerResponse.ok || !answerResponse.body) {
    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].userResult = {
        isLoading: false,
      };
      return updated;
    });
    setIsLoading(false);
    throw new Error("네트워크 응답 실패");
  }

  const answerResponseData = await answerResponse.json();
  const functionCall = answerResponseData.choices[0]?.message?.function_call;

  if (!functionCall) {
    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].userResult = {
        isLoading: false,
      };
      return updated;
    });
    setIsLoading(false);
    return;
  }

  const args = await JSON.parse(functionCall.arguments || "{}");

  setMessages((prevMessages) => {
    const updated = [...prevMessages];
    updated[updated.length - 1].userResult = {
      ...args,
      isLoading: false,
    };
    return updated;
  });

  setIsLoading(false);
};

export const useNextQuiz = () => {
  const { setMessages, setLastQuiz, setIsQuiz, lastQuiz, setIsLoading } =
    useChatStore();
  const { courseCategory, courseName, name, job, year, currentLanguage } =
    useUserInfo();

  const courses = currentLanguage === "한국어" ? KoreanCourses : EnglishCourses;

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  const prompt =
    currentLanguage === "한국어"
      ? currentCoursePrompt(course as unknown as CourseInfo)
      : currentCoursePromptEnglish(course as unknown as CourseInfo);

  const types = ["객관식", "단답형"];
  const randomType = types[Math.floor(Math.random() * types.length)];

  const nextQuizCallback = async (nextQuiz: string) => {
    const userMessage =
      currentLanguage === "한국어"
        ? quizAnswerUserPrompt(name, nextQuiz)
        : quizAnswerUserPromptEnglish(name, nextQuiz);

    const enhancedUserMessage = `
    # very important
    ${currentLanguage === "English" ? "you must say english\n" : ""}

    [사용자 질문]
    ${userMessage}
    
    [이전 퀴즈]
    ${quizMarkdownPrompt(lastQuiz as Quiz | Quiz2)}

    [문제 유형]
    ${randomType}

    [현재 수강 중인 강의 목록 정보]
    ${prompt}

    [이전 퀴즈]와 비교하여, 사용자 수준에 맞는 퀴즈를 제공해주세요. "반드시 문제가 달라야 합니다".
    사용자가 쉬운 퀴즈를 요구하면, 쉬운 퀴즈를, 어려운 퀴즈를 요구하면, 어려운 퀴즈를 제공해주세요.

    ${currentLanguage === "English" ? "you must say english\n" : ""}
  `;

    const enhancedUserMessageEnglish = `
      [User Question]  
      ${userMessage}

      [Previous Quiz]  
      ${quizMarkdownPromptEnglish(lastQuiz as Quiz | Quiz2)}

      [Question Type]  
      ${randomType}

      [List of Courses Currently Being Taken]  
      ${prompt}

      Please generate a new quiz appropriate for the user's level, based on the [Previous Quiz].  
      **The new question must be different from the previous one.**

      If the user asks for an easy question, provide an easy one.  
      If they request a hard question, provide a more difficult one.
    `;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: nextQuiz, isLoading: false },
    ]);

    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", isLoading: true },
    ]);

    const response = await functionChat(
      currentLanguage === "English"
        ? enhancedUserMessageEnglish
        : enhancedUserMessage,
      currentLanguage === "English"
        ? nextQuizSystemPromptEnglish(prompt, name, job, year)
        : nextQuizSystemPrompt(
            prompt,
            name,
            job,
            year,
            currentLanguage === "English"
          ),
      currentLanguage === "한국어"
        ? courseQuizFunctions(currentLanguage)
        : courseQuizFunctionsEnglish
    );

    if (!response.ok || !response.body) {
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        updated[updated.length - 1].isLoading = false;
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
      setIsLoading(false);
      throw new Error("네트워크 응답 실패");
    }

    const responseData = await response.json();
    const functionCall = responseData.choices[0]?.message?.function_call;

    if (!functionCall) {
      setMessages((prevMessages) => {
        const updated = [...prevMessages];
        updated[updated.length - 1].isLoading = false;
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
      setIsLoading(false);
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

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 퀴즈 정보 설정
    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].courseQuiz = {
        quiz: args.question,
        isLoading: false,
      };
      return updated;
    });
    setLastQuiz(args.question);
    setIsQuiz(true);
    setIsLoading(false);
  };

  return nextQuizCallback;
};

export const useQuizReference = () => {
  const { setMessages, lastQuiz, setIsLoading } = useChatStore();
  const { courseCategory, courseName, currentLanguage } = useUserInfo();

  const courses = currentLanguage === "한국어" ? KoreanCourses : EnglishCourses;

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  const quizReferenceCallback = async (question: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: question, isLoading: false },
    ]);

    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: "", isLoading: true },
    ]);

    const previousQuestion = question;
    // const previousAnswer = assistantMessage;
    const introMessage =
      currentLanguage === "한국어"
        ? "퀴즈에 대한 참고 자료를 보여드릴게요!\n 아래의 참고 자료로 돌아가 복습해보는 것도 좋을 것 같아요!"
        : "I will show you the reference material for the quiz!\n You can also review by going back to the reference material below!";

    let displayedMessage = "";

    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 20 + 10)
    );

    // 글자 단위로 스트리밍 효과 구현
    for (let i = 0; i < introMessage.length; i++) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].isLoading = false;
        return updatedMessages;
      });

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

    setMessages((prevMessages) => {
      const updated = [...prevMessages];
      updated[updated.length - 1].reference = {
        isLoading: true,
        reference: null,
      };
      return updated;
    });

    const referenceResponse = await functionChat(
      referenceGenerateUserPrompt(
        previousQuestion,
        lastQuiz as Quiz | Quiz2,
        course as unknown as CourseInfo,
        currentLanguage === "English"
      ),
      currentLanguage === "한국어"
        ? referenceGenerateSystemPrompt(
            course as unknown as CourseInfo,
            previousQuestion,
            lastQuiz as Quiz | Quiz2
          )
        : referenceGenerateSystemPromptEnglish(
            course as unknown as CourseInfo,
            previousQuestion,
            lastQuiz as Quiz | Quiz2
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
        isQuizReference: true,
      };
      return updated;
    });

    setIsLoading(false);
  };

  return quizReferenceCallback;
};
