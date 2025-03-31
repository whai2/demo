export const metaFunctions = [
  {
    name: "determine_user_intent",
    description: "사용자의 질문이 강의 추천인지 일반 질문인지 분류합니다.",
    parameters: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          enum: ["general_question", "course_recommendation"],
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
    description: "수강 중인 강의를 기반으로 다음 학습 과정을 추천합니다.",
    parameters: {
      type: "object",
      properties: {
        currentCourse: {
          type: "string",
          description: "현재 수강 중인 강의 이름",
        },
        userExperience: {
          type: "string",
          description: "유저의 경력 수준",
        },
      },
      required: ["currentCourse", "userExperience"],
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
                "자료 파일 이름 및 확장자 (예: data_science_intro.pdf)",
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
