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
              minItems: 4,
              maxItems: 4,
              description:
                "객관식 보기 4개. 정답이 혼동되지 않도록 명확히 구분되어야 합니다.",
            },
            answerIndex: {
              type: "number",
              minimum: 0,
              maximum: 3,
              description:
                "정답인 보기의 인덱스 (0~3). quiz 내용과 일치해야 합니다.",
            },
          },
          required: ["question", "choices", "answerIndex"],
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
  {
    name: "course_quiz",
    description: "현재 수강 중인 강의에 대한 단답형 퀴즈 문제를 생성합니다.",
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "object",
          description:
            "하나의 퀴즈 문제와 그에 따른 보기 및 정답 정보. 문제와 답은 정확해야 하며, 출제 오류가 없어야 합니다.",
          properties: {
            question: {
              type: "string",
              description:
                "퀴즈 문제. 명확하고 수강 내용을 기반으로 해야 합니다.",
            },
            answerText: {
              type: "string",
              description:
                "정답에 대한 단답 내용. quiz 내용과 일치해야 합니다.",
            },
          },
          required: ["question", "answerText"],
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

export const courseQuizAnswerFunctions = [
  {
    name: "quiz_correct",
    description:
      "퀴즈 정답 확인합니다. 정답인 경우, 이후 사용자의 다음 의사를 묻습니다.",
    parameters: {
      type: "object",
      properties: {
        isCorrect: {
          type: "boolean",
          description: "퀴즈 정답 여부",
        },
        nextQuiz: {
          type: "string",
          description:
            "더 어려운 퀴즈를 풀지 의사를 물어봅니다.  (예시: 조금 더 어려운 문제를 풀어볼래요.)",
        },
        nextCourse: {
          type: "string",
          description:
            "다음 강의를 들을지 의사를 물어봅니다.  (예시: 다음 강의를 들어볼래요.)",
        },
        // introMessage: {
        //   type: "string",
        //   description:
        //     "퀴즈 시작 전 수강생을 격려하는 메시지. 수강률이나 최근 학습 내용을 반영해야 합니다.",
        // },
      },
      required: ["isCorrect", "nextQuiz", "nextCourse"],
    },
  },
  {
    name: "quiz_incorrect",
    description:
      "퀴즈 정답 확인합니다. 오답인 경우, 이후 사용자의 다음 의사를 묻습니다.",
    parameters: {
      type: "object",
      properties: {
        isCorrect: {
          type: "boolean",
          description: "퀴즈 정답 여부",
        },
        nextQuiz: {
          type: "string",
          description:
            "더 쉬운 퀴즈를 풀지 의사를 물어봅니다.  (예시: 조금 더 쉬운 문제를 풀어볼래요.)",
        },
        referenceNeeded: {
          type: "string",
          description:
            "관련 자료를 제공받고 싶은지 물어봅니다.  (예시: 관련 자료를 받고 싶어요.)",
        },

        // introMessage: {
        //   type: "string",
        //   description:
        //     "퀴즈 시작 전 수강생을 격려하는 메시지. 수강률이나 최근 학습 내용을 반영해야 합니다.",
        // },
      },
      required: ["isCorrect", "nextQuiz", "referenceNeeded"],
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