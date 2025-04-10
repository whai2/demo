export const courseQuizFunctionsEnglish = [
  {
    name: "course_quiz",
    description: `
      You must answer in English.
      Generates a multiple-choice quiz question based on the course the user is currently enrolled in.
      You must answer in English.
    `,
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "object",
          description: `
            You must answer in English.
            A single quiz question with four answer choices and a correct answer index. The question and answer must be accurate and error-free. (Incorrect example: stating that there's one correct answer when multiple answers are actually possible.)
            You must answer in English.
          `,
          properties: {
            question: {
              type: "string",
              description:
                "The quiz question. It should be clear and based on the course content.",
            },
            choices: {
              type: "array",
              items: {
                type: "string",
              },
              minItems: 4,
              maxItems: 4,
              description:
                "Four multiple-choice answers. They must be clearly distinguishable and unambiguous. Do not number them; just provide the sentence for each choice.",
            },
            answerIndex: {
              type: "number",
              minimum: 0,
              maximum: 3,
              description:
                "The index (0–3) of the correct answer. It must match the content of the quiz.",
            },
          },
          required: ["question", "choices", "answerIndex"],
        },
        introMessage: {
          type: "string",
          description:
            "An encouraging message before the quiz begins. It should include the user’s name, years of experience, job role, and the current session's progress percentage. Format example: '**You're doing great at XX%!**'",
        },
      },
      required: ["question", "introMessage"],
    },
  },
];

export const courseQuizFunctions = (currentLanguage: string) => [
  {
    name: "course_quiz",
    description: `${
      currentLanguage === "English" ? "you must say english\n" : ""
    }
      현재 수강 중인 강의에 대한 객관식 퀴즈 문제를 생성합니다.
      ${currentLanguage === "English" ? "you must say english\n" : ""}
      `,
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "object",
          description: `${
            currentLanguage === "English" ? "you must say english\n" : ""
          }
            하나의 퀴즈 문제와 그에 따른 보기 및 정답 정보. 문제와 답은 정확해야 하며, 출제 오류가 없어야 합니다. (잘못 된 예: 정답이 1개라고 제시했는데, 실제는 복수 정답이 가능한 경우)
            ${currentLanguage === "English" ? "you must say english\n" : ""}
            `,
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
                "객관식 보기 4개. 정답이 혼동되지 않도록 명확히 구분되어야 합니다. 넘버링은 금지이며, 문제 문장만 제시해야 합니다.",
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
            "퀴즈 시작 전 수강생을 격려하는 메시지. 이번 회차 %, 사용자 이름, 연차, 직무를 포함해야 합니다. **이번 회차 %에 격려합니다.**",
        },
      },
      required: ["question", "introMessage"],
    },
  },
];

export const courseQuizAnswerFunctions = (currentLanguage: string) => [
  {
    name: "quiz_correct",
    description: `${
      currentLanguage === "English" ? "you must say english\n" : ""
    }  
      퀴즈 정답 확인합니다. 정답인 경우, 이후 사용자의 다음 의사를 평서문으로 묻습니다.
      ${currentLanguage === "English" ? "you must say english\n" : ""}
      `,
    parameters: {
      type: "object",
      properties: {
        isCorrect: {
          type: "boolean",
          description: "퀴즈 정답 여부",
        },
        nextQuiz: {
          type: "string",
          description: `${
            currentLanguage === "English" ? "you must say english\n" : ""
          }  
            더 어려운 퀴즈를 풀지 평서문으로 의사를 물어봅니다.  (예시: 조금 더 어려운 문제를 풀어볼래요.)
            ${currentLanguage === "English" ? "you must say english\n" : ""}
            `,
        },
        nextCourse: {
          type: "string",
          description: `${
            currentLanguage === "English" ? "you must say english\n" : ""
          }  
            다음 강의를 들을지 평서문으로 의사를 물어봅니다.  (예시: 다음 강의를 들어볼래요.)
            ${currentLanguage === "English" ? "you must say english\n" : ""}
            `,
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
    description: `${
      currentLanguage === "English" ? "you must say english\n" : ""
    }  
      퀴즈 정답 확인합니다. 오답인 경우, 이후 사용자의 다음 의사를 평서문으로 묻습니다.
      ${currentLanguage === "English" ? "you must say english\n" : ""}
      `,
    parameters: {
      type: "object",
      properties: {
        isCorrect: {
          type: "boolean",
          description: "퀴즈 정답 여부",
        },
        nextQuiz: {
          type: "string",
          description: `${
            currentLanguage === "English" ? "you must say english\n" : ""
          }  
            더 쉬운 퀴즈를 풀지 평서문으로 의사를 물어봅니다. (예시: 조금 더 쉬운 문제를 풀어볼래요.)
            ${currentLanguage === "English" ? "you must say english\n" : ""}
            `,
        },
        referenceNeeded: {
          type: "string",
          description: `${
            currentLanguage === "English" ? "you must say english\n" : ""
          }  
            관련 자료를 제공받고 싶은지 평서문으로 의사를 물어봅니다.  (예시: 관련 자료를 받고 싶어요.)
            ${currentLanguage === "English" ? "you must say english\n" : ""}
            `,
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

export const courseQuizAnswerFunctionsEnglish = () => [
  {
    name: "quiz_correct",
    description: `
      Check if the quiz answer is correct. If correct, ask the user's next intention as a declarative sentence.
      You must respond in English.
    `,
    parameters: {
      type: "object",
      properties: {
        isCorrect: {
          type: "boolean",
          description: "Whether the quiz answer is correct",
        },
        nextQuiz: {
          type: "string",
          description: `
            Ask the user's intention in a declarative sentence about solving a more difficult quiz.
            (e.g., I'd like to try a more difficult question.)
            You must respond in English.
          `,
        },
        nextCourse: {
          type: "string",
          description: `
            Ask the user's intention in a declarative sentence about proceeding to the next course.
            (e.g., I'd like to take the next lesson.)
            You must respond in English.
          `,
        },
      },
      required: ["isCorrect", "nextQuiz", "nextCourse"],
    },
  },
  {
    name: "quiz_incorrect",
    description: `
      Check if the quiz answer is correct. If incorrect, ask the user's next intention as a declarative sentence.
      You must respond in English.
    `,
    parameters: {
      type: "object",
      properties: {
        isCorrect: {
          type: "boolean",
          description: "Whether the quiz answer is correct",
        },
        nextQuiz: {
          type: "string",
          description: `
            Ask the user's intention in a declarative sentence about solving an easier quiz.
            (e.g., I'd like to try an easier question.)
            You must respond in English.
          `,
        },
        referenceNeeded: {
          type: "string",
          description: `
            Ask the user's intention in a declarative sentence about receiving related materials.
            (e.g., I'd like to receive related materials.)
            You must respond in English.
          `,
        },
      },
      required: ["isCorrect", "nextQuiz", "referenceNeeded"],
    },
  },
];

export const referenceFunctions = (currentLanguage: string) => [
  {
    name: "generate_reference",
    description: `${
      currentLanguage === "English" ? "you must say english\n" : ""
    }  
      ${
        currentLanguage === "한국어"
          ? "사용자의 이전 질문과 답변을 참고해, 현재 강의에서 참고했을 법한 자료(영상, 문서 등)를 실감나게 생성합니다."
          : "Use the user's previous question and answer as a reference to create a reference material (video, document, etc.) that is likely to be used in the current lecture."
      }
      ${currentLanguage === "English" ? "you must say english\n" : ""}
      `,
    parameters: {
      type: "object",
      properties: {
        reference: {
          type: "object",
          properties: {
            time: {
              type: "string",
              description:
                "강의 영상에서 해당 참고 자료가 언급되는 시간. 반드시 구간으로 나타날 것 (예: 5:15~6:30)",
            },
            title: {
              type: "string",
              description: `
              # very important
              ${
                currentLanguage === "English"
                  ? "you must provide english\n"
                  : ""
              }
              ${
                currentLanguage === "한국어"
                  ? "참고 자료의 제목 (예: 데이터 사이언스와 기초)"
                  : "(Example: Introduction to Data Science)"
              }
              ${
                currentLanguage === "English"
                  ? "you must provide english\n"
                  : ""
              }`,
            },
            file: {
              type: "string",
              description: `
              # very important
              ${
                currentLanguage === "English"
                  ? "you must provide english\n"
                  : ""
              }
              ${
                currentLanguage === "한국어"
                  ? "자료 파일 이름 및 확장자. 반드시 10자 내외 제공. (예: 데이터 사이언스 소개.pdf)"
                  : "(Example: Introduction to Data Science.pdf) Please provide the file name and extension. Keep it within 10 characters."
              }
              ${
                currentLanguage === "English"
                  ? "you must provide english\n"
                  : ""
              }`,
            },
            pages: {
              type: "string",
              description: `
              # very important
              ${
                currentLanguage === "English"
                  ? "you must provide english\n"
                  : ""
              }
              ${
                currentLanguage === "한국어"
                  ? "해당 자료에서 참고한 페이지 수 또는 범위 (예: 24page, 10-12p)"
                  : "(Example: 24page, 10-12p) Please provide the number of pages or range of pages you referred to in the material."
              }
              ${
                currentLanguage === "English"
                  ? "you must provide english\n"
                  : ""
              }`,
            },
          },
          required: ["time", "title", "file", "pages"],
        },
      },
      required: ["reference"],
    },
  },
];
