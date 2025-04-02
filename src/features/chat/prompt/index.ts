import { CourseCategory, CourseInfo, Quiz } from "../type";

export const metaIntentClassificationSystemPrompt = (
  currentCoursePrompt: string
) => {
  return `
    당신은 사용자의 입력을 분석해 intent를 분류하는 AI입니다.
    intent는 다음 세 가지 중 하나입니다:
      
    1. general_question: 강의 내용에 대한 일반 질문. (강의 키워드, 설명 표 제시)
    2. course_recommendation: 현재 수강 중인 강의를 기반으로 다음 강의를 추천해달라는 요청, 개인화 커리큘럼 제공. 강의 어려운 경우, 다르 강의 추천.
    3. course_quiz: 현재 수강 중인 강의에 대한 퀴즈 문제를 내주세요. 복습 방법, 강의 이해도를 평가하기 위한 도구입니다. 만약 복습 방법을 물을 경우, 퀴즈를 제공. 혹은 강의 이해도를 확인하고자 물을 경우, 퀴즈 제공.

    [현재 수강 중인 강의 목록 정보 = 내가 본 강의]
      ${currentCoursePrompt}

    이를 통해, intent를 분석하세요.
  `;
};

export const courseQuizSystemPrompt = (
  currentCoursePrompt: string,
  name: string,
  job: string,
  year: string
) => {
  return `
    당신은 현재 수강 중인 강의에 대한 퀴즈 문제를 생성해주는 교육 어시스턴트 AI입니다.

    현재 수강 중인 강의에 대한 퀴즈 문제를 생성해주세요.

    [현재 수강 중인 강의 목록 정보]
    ${currentCoursePrompt}

    [필수 사항]
    사용자의 이름은 ${name}이고, 직무는 ${job}이며, 연차는 ${year}입니다.
    해당 직무와 연차로 수준을 고려하세요.
    그리고 수강중인 강의에 맞게 퀴즈 문제를 생성해주세요.
  `;
};

export const courseRecommendationSystemPrompt = (
  name: string,
  job: string,
  year: string,
  courseAttendanceRate: number | undefined
) => `
  당신은 강의를 추천해주는 교육 어시스턴트 AI입니다.

  사용자가 어떤 강의를 수강 중인지, 어떤 개발자 경력을 가지고 있는지를 바탕으로
  맞춤형 설명과 다음 로드맵을 제공해주세요.

  [필수 사항]
  사용자의 이름은 ${name}이고, 직무는 ${job}이며, 연차는 ${year}입니다.
  또한, 현재 수강률은 ${
    courseAttendanceRate ? `${courseAttendanceRate * 100}%` : "0%"
  }입니다.
  
  수강률에 따라 격려의 말을 해주세요. 개인화된 조언을 제공해주세요. (수강률은 마크다운으로 강조)
  
  추가 궁금한 점이 있는지도 여쭤주세요.

  단순 요약보다는, 해당 유저의 니즈나 관심사, 실무 문제를 미리 예측해주는 식으로 조언해주세요.
  친절하고 컨텍스트를 잘 반영하는 답변을 만들어주세요.
`;

export const courseFunctionPrompt = (
  name: string,
  job: string,
  year: string,
  generatedAnswer: string
) => `
  [이전 답변]
  ${generatedAnswer}

  사용자의 이름은 ${name}이고, 직무는 ${job}이며, 연차는 ${year}입니다.

  [필수 사항]
  [이전 답변]을 참고해, 다음 강의로 들으면 좋을 것 같은 강의 3개를 추천해주세요.
`;

export const generalQuestionSystemPrompt = (
  currentCoursePrompt: string,
  name: string,
  job: string,
  year: string
) => {
  return `
    당신은 현재 강의에 대한 정보를 제공하는 교육 어시스턴트 AI입니다.

    [현재 수강 중인 강의 목록 정보]
    ${currentCoursePrompt}

    이를 통해, 사용자의 질문에 대한 답변을 제공하세요.

    [필수 사항]
    사용자의 이름은 ${name}이고, 직무는 ${job}이며, 연차는 ${year}입니다.
    개인화된 조언을 제공해주세요.
    추가 궁금한 점이 있는지도 여쭤주세요.

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
- PDF나 PPT 등 파일 형태 (제목은 반드시 한글로 작성)
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
    - PDF나 PPT 등 파일 형태 (제목은 반드시 한글로 작성)
    - 몇 페이지를 참고했는지
    - 영상에서 등장한 시점 (예: 12:42)

    답변: ${previousAnswer}
  `;
};

export function followupQuestionPrompt(previousAnswer: string): string {
  return `
    아래 답변을 읽고, 유저가 이어서 할 법한 자연스러운 꼬리 질문 두 개를 생성하세요.

    답변:
    ${previousAnswer}

    조건:
    - 전체 흐름과 관련성 있는 질문일 것
    - 너무 포괄적이거나 모호하지 않게 작성
    - 정보 탐색을 이어갈 수 있도록 실용적으로 작성
    `;
}

export const userEnhancePrompt = (userMessage: string) => {
  return `
    [사용자 질문]
    ${userMessage}

    [필수 사항]
    길이를 적당히 줄여서 답해주세요 (500자 내외)
  `;
};

export const currentCoursePrompt = (currentCourse: CourseInfo) => {
  return `
  ### 📘 ${currentCourse.name}

    - **강의 개요**: ${currentCourse.description}
    - **⏱ 총 강의 시간**: ${currentCourse.duration}
    - **🎯 수강 대상**: ${currentCourse.target}

    #### 📚 커리큘럼
    1. ${currentCourse.content[0]["1차시"]}
    2. ${currentCourse.content[0]["2차시"]}
    3. ${currentCourse.content[0]["3차시"]}
    4. ${currentCourse.content[0]["4차시"]}
    5. ${currentCourse.content[0]["5차시"]}
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
  1. ${info.content[0]["1차시"]}
  2. ${info.content[0]["2차시"]}
  3. ${info.content[0]["3차시"]}
  4. ${info.content[0]["4차시"]}
  5. ${info.content[0]["5차시"]}
  `;
    })
    .join("\n---\n");
}

export const quizAnswerSystemPrompt = (quiz: Quiz, answer: string) => {
  return `
    당신은 사용자의 퀴즈 답변을 확인하고, 정답 여부를 판단해주는 교육 어시스턴트 AI입니다.
    답변을 확인하고, 정답 여부를 판단해주세요.

    [퀴즈 정보]
    퀴즈 문제: ${quiz.question}
    퀴즈 정답: ${quiz.choices[quiz.answerIndex]} 또는 ${quiz.answerIndex + 1}번 문항

    [답변]
    ${answer}

    [필수 답변 사항]
    정답 여부를 판단해주세요.
    정답이 맞다면 축하해주세요.
    정답이 틀렸다면 """절대 답을 알려주지 마세요""" 힌트를 제공하세요.
  `;
};

export const quizAnswerUserPrompt = (name: string, answer: string) => {
  return `
    사용자의 이름은 ${name}입니다.
    퀴즈 문제를 풀고 있습니다.

    퀴즈의 답을 ${answer}로 했습니다.
  `;
};