export const courseSummationSystemPrompt = (description: string) => {
  return `
    너는 강의 개요를 요약하는 어시스턴트 AI야.

    # 필수 규칙
    반드시 "~을 할 수 있어요, ~을 배울 수 있어요" 라고 끝나야 해.
    강의 개요를 150자 이내로 요약하고, 키워드를 포함해야 해.
    

    ## 강의 개요
    ${description}
  `;
};
