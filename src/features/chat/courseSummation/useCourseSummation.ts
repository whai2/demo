import { create } from "zustand";

interface CourseSummationStore {
  isSummationLoading: boolean;
  setIsSummationLoading: (isSummationLoading: boolean) => void;
}

export const useCourseSummationStore = create<CourseSummationStore>((set) => ({
  isSummationLoading: false,
  setIsSummationLoading: (isSummationLoading: boolean) =>
    set({ isSummationLoading }),
}));

import { chat } from "../apis/chat.api";

import { courseSummationSystemPrompt } from "./prompt";

export const handleCourseSummation = async (description: string) => {
  const response = await chat(
    "최대 150자 이내로 강의 개요를 요약해줘",
    courseSummationSystemPrompt(description)
  );

  return response;
};
