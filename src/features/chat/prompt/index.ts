import { CourseCategory, CourseInfo } from "../type";

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

export const referenceGeneratePrompt = (
  currentCoursePrompt: string,
  previousQuestion: string,
  previousAnswer: string
) => {
  return `
    이전 강의 내용을 기반으로 참고했을 법한 자료 하나를 생성해주세요. 아래 기준을 따르세요:

- 실존할 법한 제목
- PDF나 PPT 등 파일 형태
- 몇 페이지를 참고했는지
- 영상에서 등장한 시점 (예: 12:42)

    질문: ${previousQuestion}
    답변: ${previousAnswer}

    [현재 수강 중인 강의 목록 정보]
    ${currentCoursePrompt}
  `;
};

export const referenceQuestionPrompt = (previousAnswer: string) => {
  return `
    아래의 답변이 어떤 내용을 참고했을지를 추측해서, 참고 자료를 생성해주세요.
    아래 기준을 따르세요:

    - 실존할 법한 제목
    - PDF나 PPT 등 파일 형태
    - 몇 페이지를 참고했는지
    - 영상에서 등장한 시점 (예: 12:42)

    답변: ${previousAnswer}
  `;
};
export const userEnhancePrompt = (userMessage: string) => {
  return `
    [사용자 질문]
    ${userMessage}
  `;
};

export const currentCoursePrompt = (currentCourse: CourseInfo) => {
  return `
  ### 📘 ${currentCourse.name}

    - **강의 개요**: ${currentCourse.description}
    - **⏱ 총 강의 시간**: ${currentCourse.duration}
    - **🎯 수강 대상**: ${currentCourse.target}

    #### 📚 커리큘럼
    1. ${currentCourse.content[0]}
    2. ${currentCourse.content[1]}
    3. ${currentCourse.content[2]}
    4. ${currentCourse.content[3]}
    5. ${currentCourse.content[4]}
  `;
};

export function formatCoursesToMarkdown(courses: CourseCategory): string {
  return courses.courses
    .map((course, index) => {
      const courseName = course.name;
      const info = course;

      return `
  ### ${index + 1}. 📘 ${courseName}

  - **강의 개요**: ${info.description}
  - **💰 가격**: ${info.price}
  - **⏱ 총 강의 시간**: ${info.duration}
  - **🎯 수강 대상**: ${info.target}

  #### 📚 커리큘럼
  1. ${info.content[0]}
  2. ${info.content[1]}
  3. ${info.content[2]}
  4. ${info.content[3]}
  5. ${info.content[4]}
  `;
    })
    .join("\n---\n");
}
