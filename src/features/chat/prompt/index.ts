import { CourseInfo, Quiz, Quiz2 } from "../type";

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

export const quizIntentClassificationSystemPrompt = (
  answer: string,
  quiz: Quiz | Quiz2
) => {
  return `
    당신은 사용자의 입력을 분석해 intent를 분류하는 AI입니다.
    intent는 다음 두 가지 중 하나입니다:
    
    1. quiz_answer: 사용자가 퀴즈 정답을 확인하고자 할 때
    2. others: 퀴즈 정답 확인 외의 다른 의도

    사용자의 입력:
    ${answer}

    퀴즈 문제:
    ${quizMarkdownPrompt(quiz)}

    이를 통해, intent를 분석하세요.
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
    이 질문을 토대로, 사용자의 의도를 분석해 주세요.
  `;
};

export const userEnhanceQuizPrompt = (userMessage: string) => {
  return `
    [사용자 질문]
    ${userMessage}

    [필수 사항]
    이 질문을 토대로, 사용자의 의도를 분석해 주세요.
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
