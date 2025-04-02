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

export const functions = [
  {
    name: "recommend_course",
    description:
      "수강 중인 강의, 제공된 전체 강의를 기반으로 다음 학습 과정 3개를 추천합니다.",
    parameters: {
      type: "object",
      properties: {
        courses: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "추천 강의 이름",
              },
              price: {
                type: "string",
                description: "추천 강의 가격",
              },
              duration: {
                type: "string",
                description: "추천 강의 시간",
              },
              target: {
                type: "string",
                description: "추천 강의 대상",
              },
            },
          },
        },
      },
      required: ["courses"],
    },
  },
];

export const referenceFunctions = [
  {
    name: "generate_reference",
    description:
      "사용자의 이전 질문과 답변을 참고해, 현재 강의에서 참고했을 법한 자료(영상, 문서 등)를 실감나게 생성합니다.",
    parameters: {
      type: "object",
      properties: {
        reference: {
          type: "object",
          properties: {
            time: {
              type: "string",
              description:
                "강의 영상에서 해당 참고 자료가 언급되는 시간 (예: 5:15)",
            },
            title: {
              type: "string",
              description: "참고 자료의 제목 (예: 데이터 사이언스와 기초)",
            },
            file: {
              type: "string",
              description:
                "자료 파일 이름 및 확장자 (예: 데이터 사이언스 소개.pdf)",
            },
            pages: {
              type: "string",
              description:
                "해당 자료에서 참고한 페이지 수 또는 범위 (예: 24page, 10-12p)",
            },
          },
          required: ["time", "title", "file", "pages"],
        },
      },
      required: ["reference"],
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
