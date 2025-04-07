export const referenceFunctions = (currentLanguage: string) => [
  {
    name: "generate_reference",
    description: `${currentLanguage === "English" ? "you must say english\n" : ""}  
      사용자의 이전 질문과 답변을 참고해, 현재 강의에서 참고했을 법한 자료(영상, 문서 등)를 실감나게 생성합니다.
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
              ${currentLanguage === "English" ? "you must say english\n" : ""}
              참고 자료의 제목 (예: 데이터 사이언스와 기초)
              ${currentLanguage === "English" ? "you must say english\n" : ""}`,
            },
            file: {
              type: "string",
              description: `
              ${currentLanguage === "English" ? "you must say english\n" : ""}
              자료 파일 이름 및 확장자. 반드시 10자 내외 제공. (예: 데이터 사이언스 소개.pdf)
              ${currentLanguage === "English" ? "you must say english\n" : ""}`,
            },
            pages: {
              type: "string",
              description: `해당 자료에서 참고한 페이지 수 또는 범위 (예: 24page, 10-12p)
              ${currentLanguage === "English" ? "you must say english\n" : ""}`,
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
    description: `${currentLanguage === "English" ? "you must say english\n" : ""}
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
