export const metaFunctions = [
  {
    name: "determine_user_intent",
    description: "사용자의 질문이 강의 추천인지 일반 질문인지 분류합니다.",
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

export const followupQuestionFunctions = [
  {
    name: "generate_tail_questions",
    description:
      "챗봇의 이전 답변을 참고해, 다음 흐름에서 유저가 자연스럽게 이어서 할 수 있는 꼬리 질문 2개를 생성합니다.",
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "string",
            description: "유저가 이어서 던지기 좋은 질문",
          },
          description: "생성된 꼬리 질문 리스트 (총 2개)",
        },
      },
      required: ["questions"],
    },
  },
];

export const courseQuizFunctions = [
  {
    name: "course_quiz",
    description: "현재 수강 중인 강의에 대한 객관식 퀴즈 문제를 생성합니다.",
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "object",
          description:
            "하나의 퀴즈 문제와 그에 따른 보기 및 정답 정보. 문제와 답은 정확해야 하며, 출제 오류가 없어야 합니다. (잘못 된 예: 정답이 1개라고 제시했는데, 실제는 복수 정답이 가능한 경우)",
          properties: {
            question: {
              type: "string",
              description:
                "퀴즈 문제. 명확하고 수강 내용을 기반으로 해야 합니다.",
            },
            choices: {
              type: "array",
              items: {
                type: "string",
              },
              minItems: 5,
              maxItems: 5,
              description:
                "객관식 보기 5개. 정답이 혼동되지 않도록 명확히 구분되어야 합니다.",
            },
            answerIndex: {
              type: "number",
              minimum: 0,
              maximum: 4,
              description:
                "정답인 보기의 인덱스 (0~4). quiz 내용과 일치해야 합니다.",
            },
          },
          required: ["quiz", "choices", "answerIndex"],
        },
        introMessage: {
          type: "string",
          description:
            "퀴즈 시작 전 수강생을 격려하는 메시지. 수강률이나 최근 학습 내용을 반영해야 합니다.",
        },
      },
      required: ["question", "introMessage"],
    },
  },
];
