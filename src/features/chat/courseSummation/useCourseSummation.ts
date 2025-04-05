import { chat } from "../apis/chat.api";

import { courseSummationSystemPrompt } from "./prompt";

export const handleCourseSummation = async (description: string) => {
  const response = await chat(
    "최대 150자 이내로 강의 개요를 요약해줘",
    courseSummationSystemPrompt(description)
  );

  return response;
};
