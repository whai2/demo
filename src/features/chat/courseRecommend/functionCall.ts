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
              category: {
                type: "string",
                description: "추천 강의 카테고리",
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
              url: {
                type: "string",
                description: "추천 강의와 유사한 이미지 링크. 실제 이미지가 있는 링크",
              },
            },
          },
        },
      },
      required: ["courses"],
    },
  },
];

export const userIntentClassificationFunctions = [
  {
    name: "recommend_course",
    description:
      "[이전 답변]을 참고해, 다음 강의와 연결되는 내용을 제공해주세요. 배열 안에 총 3개의 데이터를 넣어주세요.",
    parameters: {
      type: "object",
      properties: {
        contents: {
          type: "array",
          items: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description:
                  `다음으로 배우면 좋을 내용을 10~30자 이내로 제공해주세요. (# 데이터 예시: '기획부터 UI 흐름까지 배우고 싶어요.')`,
              },
            },
          },
        },
      },
      required: ["contents"],
    },
  },
];
