import { create } from "zustand";

interface CourseSummationStore {
  courseSummation: string;
  setCourseSummation: (courseSummation: string) => void;
  isSummationLoading: boolean;
  setIsSummationLoading: (isSummationLoading: boolean) => void;
}

export const useCourseSummationStore = create<CourseSummationStore>((set) => ({
  courseSummation: "",
  setCourseSummation: (courseSummation: string) =>
    set({ courseSummation }),
  isSummationLoading: false,
  setIsSummationLoading: (isSummationLoading: boolean) =>
    set({ isSummationLoading }),
}));

import { chat } from "../apis/chat.api";

import { courseSummationSystemPrompt } from "./prompt";

export const handleCourseSummation = async (
  description: string,
  currentLanguage: string
) => {
  const response = await chat(
    `
    # Very Important
    ${currentLanguage === "English" ? "you must say english\n" : ""}

    "최대 150자 이내로 강의 개요를 요약해줘"

    ${currentLanguage === "English" ? "you must say english\n" : ""}
    `,

    courseSummationSystemPrompt(description, currentLanguage === "English")
  );

  return response;
};
