interface CourseInfo {
  강의개요: string;
  가격: string;
  총강의시간: string;
  수강대상: string;
  "1차시": string;
  "2차시": string;
  "3차시": string;
  "4차시": string;
  "5차시": string;
}

interface Course {
  [courseName: string]: CourseInfo;
}

export const courseRecommendationSystemPrompt = `
  너는 프로덕트 중심의 AI 교육 어시스턴트야.

  사용자가 어떤 강의를 수강 중인지, 어떤 개발자 경력을 가지고 있는지를 바탕으로
  맞춤형 설명과 다음 로드맵을 제공해.

  단순 요약보다는, 해당 유저의 니즈나 관심사, 실무 문제를 미리 예측해주는 식으로 조언하자.
  친절하고 컨텍스트를 잘 반영하는 답변을 만들어줘.
`;

export const metaIntentClassificationSystemPrompt = (
  currentCoursePrompt: string
) => {
  return `
    당신은 사용자의 입력을 분석해 intent를 분류하는 AI입니다.
    intent는 다음 두 가지 중 하나입니다:
      
    1. general_question: 강의 내용에 대한 일반 질문
    2. course_recommendation: 현재 수강 중인 강의를 기반으로 다음 강의를 추천해달라는 요청, 개인화 커리큘럼 제공

    [현재 수강 중인 강의 목록 정보 = 내가 본 강의]
      ${currentCoursePrompt}

    이를 통해, intent를 분석하세요.
  `;
};

export const generalQuestionSystemPrompt = (currentCoursePrompt: string) => {
  return `
    당신은 현재 강의에 대한 정보를 제공하는 교육 어시스턴트 AI입니다.

    [현재 수강 중인 강의 목록 정보]
    ${currentCoursePrompt}

    이를 통해, 사용자의 질문에 대한 답변을 제공하세요.

    [추천 사항]
    단순 요약보다는, 해당 유저의 니즈나 관심사, 실무 문제를 미리 예측해주는 식으로 조언하세요.
    친절하고 컨텍스트를 잘 반영하는 답변을 만들어주세요.
  `;
};

export const userEnhancePrompt = (userMessage: string) => {
  return `
    [사용자 질문]
    ${userMessage}
  `;
};

export const currentCoursePrompt = (currentCourse: Course) => {
  const courseName = Object.keys(currentCourse)[0];
  const info = currentCourse[courseName] as CourseInfo;

  return `
  ### 📘 ${courseName}

    - **강의 개요**: ${info.강의개요}
    - **⏱ 총 강의 시간**: ${info.총강의시간}
    - **🎯 수강 대상**: ${info.수강대상}

    #### 📚 커리큘럼
    1. ${info["1차시"]}
    2. ${info["2차시"]}
    3. ${info["3차시"]}
    4. ${info["4차시"]}
    5. ${info["5차시"]}
  `;
};

export function formatCoursesToMarkdown(courses: Course[]): string {
  return courses
    .map((course, index) => {
      const courseName = Object.keys(course)[0];
      const info = course[courseName];

      return `
### ${index + 1}. 📘 ${courseName}

- **강의 개요**: ${info.강의개요}
- **💰 가격**: ${info.가격}
- **⏱ 총 강의 시간**: ${info.총강의시간}
- **🎯 수강 대상**: ${info.수강대상}

#### 📚 커리큘럼
1. ${info["1차시"]}
2. ${info["2차시"]}
3. ${info["3차시"]}
4. ${info["4차시"]}
5. ${info["5차시"]}
`;
    })
    .join("\n---\n");
}
