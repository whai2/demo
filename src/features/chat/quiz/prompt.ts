import { CourseInfo, Quiz, Quiz2 } from "@/features/chat/type";

// system prompt
export const courseQuizSystemPrompt = (
  currentCoursePrompt: string,
  name: string,
  job: string,
  year: string,
  courseAttendanceRate?: number
) => {
  return `
    당신은 현재 수강 중인 강의에 대한 퀴즈 문제를 생성해주는 교육 어시스턴트 AI입니다.

    현재 수강 중인 강의에 대한 퀴즈 문제를 생성해주세요.

    [현재 수강 중인 강의 목록 정보]
    ${currentCoursePrompt}

    [필수 사항]
    사용자의 이름은 ${name}이고, 직무는 ${job}이며, 연차는 ${year}입니다.
    또한, 현재 수강률은 ${
      courseAttendanceRate ? `${courseAttendanceRate * 100}%` : "0%"
    }입니다.
  
    해당 직무와 연차로 수준을 고려하세요.
    그리고 수강중인 강의에 맞게 퀴즈 문제를 생성해주세요.
  `;
};

export const nextQuizSystemPrompt = (
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
    [이전 퀴즈]와 비교하여, 사용자 수준에 맞는 퀴즈를 제공해주세요.
    사용자가 쉬운 퀴즈를 요구하면, 쉬운 퀴즈를, 어려운 퀴즈를 요구하면, 어려운 퀴즈를 제공해주세요.
  `;
};

export const quizAnswerSystemPrompt = (quiz: Quiz | Quiz2, answer: string) => {
  return `
    당신은 사용자의 퀴즈 답변을 확인하고, 정답 여부를 판단해주는 교육 어시스턴트 AI입니다.
    답변을 확인하고, 정답 여부를 판단해주세요.

    [퀴즈 정보]
    ${quizMarkdownPrompt(quiz)}

    [사용자 답변]
    ${answer}

    [필수 답변 사항]
    정답 여부를 판단해주세요.
    오답의 경우, 답을 알려주지 마세요.
    
    [필수 사항]
    퀴즈 풀이 이후, 다음 의사를 물어 봅니다.
    오답의 경우, 답을 알려주지 마세요.
  `;
};

export const referenceGenerateSystemPrompt = (
  currentCourse: CourseInfo,
  previousQuestion: string,
  quiz: Quiz | Quiz2
) => {
  return `
    이전 강의 내용을 기반으로 퀴즈 문제를 참고했을 법한 자료 하나를 생성해주세요. 아래 기준을 따르세요:

- 실존할 법한 제목
- PDF나 PPT 등 파일 형태 (제목은 반드시 한글로 작성)
- 몇 페이지를 참고했는지
- 영상에서 등장한 시점 (예: 12:42)

    질문: ${previousQuestion}
    퀴즈: ${quizMarkdownPrompt(quiz)}

    [현재 수강 중인 강의 목록 정보]
    ${currentCoursePrompt(currentCourse)}
  `;
};

// user prompt
export const quizAnswerUserPrompt = (name: string, answer: string) => {
  return `
    사용자의 이름은 ${name}입니다.
    퀴즈 문제를 풀고 있습니다.

    퀴즈의 답을 ${answer}로 했습니다.

    [필수 사항]
    오답의 경우, 답을 알려주지 말고, 참고 자료를 제시할 지 의사를 물어주세요.
  `;
};

export const referenceGenerateUserPrompt = (
  previousQuestion: string,
  quiz: Quiz | Quiz2,
  currentCourse: CourseInfo
) => {
  return `
    아래의 답변이 어떤 내용을 참고했을지를 추측해서, 참고 자료를 생성해주세요.
    아래 기준을 따르세요:

    - 실존할 법한 제목
    - PDF나 PPT 등 파일 형태 (제목은 반드시 한글로 작성)
    - 몇 페이지를 참고했는지
    - 영상에서 등장한 시점 (예: 12:42)

    질문: ${previousQuestion}
    퀴즈: ${quizMarkdownPrompt(quiz)}
    
    [현재 수강 중인 강의 목록 정보]
    ${currentCoursePrompt(currentCourse)}
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

export const quizMarkdownPrompt = (quiz: Quiz | Quiz2) => {
  if ("choices" in quiz) {
    return `
    ### 📌 현재 퀴즈 문제

    **문제:** ${quiz.question}

    **보기:**
    ${quiz.choices.map((choice, idx) => `- ${idx + 1}. ${choice}`).join("\n")}

    **정답 인덱스:** ${quiz.answerIndex + 1}
    `;
  }

  return `
    ### 📌 현재 퀴즈 문제

    **문제:** ${quiz.question}

    **정답:** ${quiz.answerText}
  `;
};
