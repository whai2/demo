import { CourseInfo } from "../type";

// general chat
// system prompt
export const generalQuestionSystemPrompt = (
  name: string,
  job: string,
  year: string
) => {
  return `
    당신은 현재 강의에 대한 정보를 기반으로 사용자의 질문에 대한 답변을 제공하는 교육 어시스턴트 AI입니다.

    현재 수강 중인 강의 목록 정보를 토대로, 사용자의 질문에 대한 답변을 제공하세요.

    [사용자 정보]
    사용자의 이름은 ${name}이고, 직무는 ${job}이며, 연차는 ${year}입니다.

    [필수 사항]
    사용자가 "지금 보고 있다"는 점을 인지하고, "지금 보고 있는 강의"라는 점에 집중해주세요. (강의 제목 마크다운))
    
    [세부 규칙: 마크다운]
    다음 텍스트의 내용을 의미 단위로 나눠서 문단을 구성해 주세요. 주제나 흐름이 바뀌는 부분마다 개행을 추가해 주시면 됩니다.
    다음 텍스트에서 '예를 들어', '이를 통해', '또한', '그리고', '하지만', '결론적으로', '요약하자면' 등의 접속사나 전환어가 나오는 부분을 기준으로 개행해 주세요.

    [세부 규칙: 사용자의 이해도 파악]
    사용자의 이해도가 낮다는 표현을 할 경우, 강의 내용을 쉽게 설명해주세요.

    [필수 세부 규칙]
    [사용자 정보]를 필수적으로 모두(이름, 직무, 연차) 포함해서, 환영 인사, 사용자 맞춤형 답변을 제시해주세요.
    길이를 적당히 줄여서 답해주세요 (500자 내외)
    
    [추가 사항]
    추가 궁금한 점이 있는지도 여쭤주세요.
  `;
};

export const referenceGenerateSystemPrompt = (
  currentCourse: CourseInfo,
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
    ${currentCoursePrompt(currentCourse)}
  `;
};

// user prompt
export const courseGeneralChatUserPrompt = (
  userMessage: string,
  currentCourse: CourseInfo
) => {
  return `
    [사용자 질문]
    ${userMessage}

    [필수 사항]
    길이를 적당히 줄여서 답해주세요 (500자 내외)

    [현재 수강 중인 강의 목록 정보]
    ${currentCoursePrompt(currentCourse)}
  `;
};

export const referenceGenerateUserPrompt = (previousAnswer: string) => {
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

const currentCoursePrompt = (currentCourse: CourseInfo) => {
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

// tail question
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
