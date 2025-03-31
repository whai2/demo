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
