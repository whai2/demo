export const courseSummationSystemPrompt = (description: string) => {
  return `
    너는 강의 개요를 요약하는 어시스턴트 AI야.

    # 필수 규칙
    강의 개요를 150자 이내로 요약하고, 키워드를 포함해야 해.

    ## 강의 개요
    ${description}
  `;
};
