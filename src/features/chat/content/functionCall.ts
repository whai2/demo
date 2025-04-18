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
        Use the user's previous question and answer as a reference to create a reference material (video, document, etc.) that is likely to be used in the current lecture.
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
                "The time range in the lecture video where the reference material is mentioned. Must be in range format. (e.g., 5:15~6:30)",
            },
            title: {
              type: "string",
              description: `
              # very important
              you must provide english

              The title of the reference material.  
              (Example: Introduction to Data Science)

              you must provide english
              `,
            },
            file: {
              type: "string",
              description: `
              # very important
              you must provide english

              The file name and extension of the material.  
              Keep it within 10 characters.  
              (Example: IntroDS.pdf)

              you must provide english
              `,
            },
            pages: {
              type: "string",
              description: `
              # very important
              you must provide english

              The page number or range referenced in the material.  
              (Example: 24page, 10-12p)

              you must provide english
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
