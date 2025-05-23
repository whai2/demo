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

export const referenceFunctionsEnglish = () => [
  {
    name: "generate_reference",
    description: `
      You must respond in English only.

      Use the user's previous question and answer to create a realistic reference material (e.g., video, document, etc.) that could have been mentioned in the lecture.

      You must respond in English only.
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
                "The time segment in the lecture video where the reference is mentioned. Must be in a range format. (e.g., 5:15~6:30)",
            },
            title: {
              type: "string",
              description: `
              # Very Important  
              You must provide English only.  
              Provide the title of the reference material.  
              (Example: Introduction to Data Science)  
              You must provide English only.
              `,
            },
            file: {
              type: "string",
              description: `
              # Very Important  
              You must provide English only.  
              Provide the file name and extension.  
              Keep it within 10 characters.  
              (Example: IntroDS.pdf)  
              You must provide English only.
              `,
            },
            pages: {
              type: "string",
              description: `
              # Very Important  
              You must provide English only.  
              Specify the page or page range referenced.  
              (Example: 24page, 10-12p)  
              You must provide English only.
              `,
            },
          },
          required: ["time", "title", "file", "pages"],
        },
      },
      required: ["reference"],
    },
  },
];

export const followupQuestionFunctions = (currentLanguage: string) => [
  {
    name: "generate_tail_questions",
    description: `
    ${currentLanguage === "English" ? "you must say english\n" : ""}
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

      Based on the chatbot’s previous answer, generate 2 follow-up questions the user might naturally ask next.

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
              "A natural follow-up question the user might ask next.",
          },
          description: "A list of 2 generated follow-up questions.",
        },
      },
      required: ["questions"],
    },
  },
];
