export const metaFunctions = (currentLanguage: string) => [
  {
    name: "determine_user_intent",
    description: `${
      currentLanguage === "English" ? "you must say english\n" : ""
    }
    사용자의 질문이 일반 질문인지, 강의 추천인지, 퀴즈 문제 제공인지 분류합니다.
    ${currentLanguage === "English" ? "you must say english\n" : ""}
    `,
    parameters: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          enum: ["general_question", "course_recommendation", "course_quiz"],
          description: "질문의 목적 유형",
        },
      },
      required: ["intent"],
    },
  },
];

export const metaFunctionsEnglish = () => [
  {
    name: "determine_user_intent",
    description: `
      You must respond in English only.

      Classify the user's message as either a general question, course recommendation, or course quiz request.

      You must respond in English only.
    `,
    parameters: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          enum: ["general_question", "course_recommendation", "course_quiz"],
          description: "Type of intent behind the user's message",
        },
      },
      required: ["intent"],
    },
  },
];

export const metaQuizFunctions = (currentLanguage: string) => [
  {
    name: "determine_user_intent",
    description: `${
      currentLanguage === "English" ? "you must say english\n" : ""
    }
    사용자의 질문이 퀴즈 정답 확인인지 일반 질문인지 분류합니다.
    ${currentLanguage === "English" ? "you must say english\n" : ""}
    `,
    parameters: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          enum: ["quiz_answer", "others"],
          description: "질문의 목적 유형",
        },
      },
      required: ["intent"],
    },
  },
];

export const metaQuizFunctionsEnglish = () => [
  {
    name: "determine_user_intent",
    description: `
      You must respond in English only.

      Determine whether the user's message is asking for a quiz answer check or a general question.

      You must respond in English only.
    `,
    parameters: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          enum: ["quiz_answer", "others"],
          description: "Type of intent behind the user's message",
        },
      },
      required: ["intent"],
    },
  },
];

export const followupQuestionFunctions = (currentLanguage: string) => [
  {
    name: "generate_tail_questions",
    description: `${
      currentLanguage === "English" ? "you must say english\n" : ""
    }
    챗봇의 이전 답변을 참고해, 다음 흐름에서 유저가 자연스럽게 이어서 할 수 있는 꼬리 질문 2개를 생성합니다.
    ${currentLanguage === "English" ? "you must say english\n" : ""}
    `,
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "string",
            description: `유저가 이어서 던지기 좋은 질문
            ${currentLanguage === "English" ? "you must say english\n" : ""}`,
          },
          description: `생성된 꼬리 질문 리스트 (총 2개)
          ${currentLanguage === "English" ? "you must say english\n" : ""}`,
        },
      },
      required: ["questions"],
    },
  },
];

export const followupQuestionFunctionsEnglish = () => [
  {
    name: "generate_tail_questions",
    description: `
      You must respond in English only.

      Based on the chatbot's previous response, generate 2 natural follow-up questions the user might ask next.

      You must respond in English only.
    `,
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "string",
            description:
              "A follow-up question that the user may naturally ask next",
          },
          description: "List of 2 generated follow-up questions",
        },
      },
      required: ["questions"],
    },
  },
];
