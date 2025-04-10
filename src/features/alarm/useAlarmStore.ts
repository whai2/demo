import { useEffect, useRef } from "react";

import { create } from "zustand";

import alarmMessages, {
  alarmMessagesEnglish,
} from "@/features/alarm/constants/alarmMessages";

import { useUserInfo } from "@/features/userInfo";
import { parseDurationToSeconds, videoStore } from "@/features/video";

type AlarmMessageInstanceType = {
  message: string;
  question?: string;
  type?: "default" | "callToAction";
};

interface AlarmState {
  isTriggered: boolean;
  data: AlarmMessageInstanceType;
  lastDefaultDataNumber: number;
  lastCallToActionDataNumber: number;
  isCallToActionDoing: boolean;
  isOverHalf: boolean;
  isOverNinety: boolean;
  isQuiz?: boolean;
  setTriggered: (value: boolean) => void;
  setData: (data: AlarmMessageInstanceType) => void;
  setLastDefaultDataNumber: (number: number) => void;
  setLastCallToActionDataNumber: (number: number) => void;
  setIsCallToActionDoing: (value: boolean) => void;
  reset: () => void;
}

const useAlarmStore = create<AlarmState>()((set) => ({
  isTriggered: false,
  data: {
    message: "",
  },
  lastDefaultDataNumber: 0,
  lastCallToActionDataNumber: 0,
  isCallToActionDoing: false,
  isOverHalf: false,
  isOverNinety: false,
  setTriggered: (value: boolean) => set({ isTriggered: value }),
  setData: (data: AlarmMessageInstanceType) => set({ data }),
  setLastDefaultDataNumber: (number: number) =>
    set({ lastDefaultDataNumber: number }),
  setLastCallToActionDataNumber: (number: number) =>
    set({ lastCallToActionDataNumber: number }),
  setIsCallToActionDoing: (value: boolean) =>
    set({ isCallToActionDoing: value }),
  reset: () =>
    set({
      isTriggered: false,
      data: { message: "" },
      lastDefaultDataNumber: 0,
      lastCallToActionDataNumber: 0,
      isCallToActionDoing: false,
      isOverHalf: false,
      isOverNinety: false,
    }),
}));

export const useTriggerInterval = () => {
  const clipIdRef = useRef<string | null>(null);
  const { currentVideo, progress, className } = videoStore();
  const { courseAttendanceRate, currentLanguage } = useUserInfo();

  // useEffect(() => {
  //   const triggerAlarm = () => {
  //     const allMessages = [
  //       ...alarmMessages.default.map((item) => ({
  //         ...item,
  //         type: "default" as const,
  //       })),
  //     ];

  //     const { lastDefaultDataNumber, isCallToActionDoing } =
  //       useAlarmStore.getState();
  //     const nextIndex = (lastDefaultDataNumber + 1) % allMessages.length;
  //     const selectedItem = allMessages[nextIndex];

  //     if (!isCallToActionDoing) {
  //       useAlarmStore.setState({
  //         isTriggered: true,
  //         data: { ...selectedItem },
  //         lastDefaultDataNumber: nextIndex,
  //       });
  //     }

  //     setTimeout(() => {
  //       useAlarmStore.setState({
  //         isTriggered: false,
  //         data: {
  //           message: "",
  //         },
  //       });
  //     }, 8 * 1000);
  //   };

  //   triggerAlarm();
  // }, []);

  useEffect(() => {
    const randomAlram = [
      "수강 완료가 다가오고 있어요.\n다음에는 어떤 것을 배우고 싶나요?",
      "강의 완료를 앞두고, 어려운 부분이 있나요?",
    ];

    const randomAlramEnglish = [
      "Completion of the course is coming up.\nWhat do you want to learn next?",
      "Ahead of the completion of the lecture, \nare there any difficulties?",
    ];

    let randomIndex;
    if (currentLanguage === "한국어") {
      randomIndex = Math.floor(Math.random() * randomAlram.length);
    } else {
      randomIndex = Math.floor(Math.random() * randomAlramEnglish.length);
    }

    const randomMessage =
      currentLanguage === "한국어"
        ? randomAlram[randomIndex]
        : randomAlramEnglish[randomIndex];

    if (courseAttendanceRate >= 0.5) {
      useAlarmStore.setState({
        isTriggered: true,
        isQuiz: false,
        isCallToActionDoing: true,
        data: {
          message: randomMessage,
          type: "callToAction",
          question:
            currentLanguage === "한국어"
              ? "앞으로의 학습 로드맵을 제공해 주세요."
              : "Please provide the learning roadmap for the future.",
        },
      });
    }

    setTimeout(() => {
      useAlarmStore.setState({
        isTriggered: false,
        isCallToActionDoing: false,
        data: {
          message: "",
        },
      });
    }, 8 * 1000);
  }, [courseAttendanceRate, currentLanguage]);

  useEffect(() => {
    const triggerAlarm = (isOverHalf: boolean, isOverNinety: boolean) => {
      let allMessages;
      if (currentLanguage === "한국어") {
        allMessages = [
          ...alarmMessages.callToAction.map((item) => ({
            ...item,
            type: "callToAction" as const,
          })),
        ];
      } else {
        allMessages = [
          ...alarmMessagesEnglish.callToAction.map((item) => ({
            ...item,
            type: "callToAction" as const,
          })),
        ];
      }

      const { lastCallToActionDataNumber } = useAlarmStore.getState();
      const nextIndex = (lastCallToActionDataNumber + 1) % allMessages.length;
      const selectedItem = allMessages[nextIndex];

      useAlarmStore.setState({
        isTriggered: true,
        isCallToActionDoing: true,
        isQuiz: true,
        isOverHalf: isOverHalf ?? false,
        isOverNinety: isOverNinety ?? false,
        data: { ...selectedItem },
        lastCallToActionDataNumber: nextIndex,
      });

      setTimeout(() => {
        useAlarmStore.setState({
          isTriggered: false,
          isCallToActionDoing: false,
          data: {
            message: "",
          },
        });
      }, 8 * 1000);
    };

    const { isOverHalf } = useAlarmStore.getState();

    const currentVideoDuration = parseDurationToSeconds(
      currentVideo?.duration ?? ""
    );

    const currentVideoId = currentVideo?.id;
    const currentVideoProgress = progress[currentVideoId ?? ""];

    const progressPercentage = currentVideoDuration
      ? (currentVideoProgress / currentVideoDuration) * 100
      : 0;

    const hasPassed50Percent = progressPercentage >= 80;

    if (hasPassed50Percent && !isOverHalf) {
      triggerAlarm(true, false);
    }
  }, [currentVideo, progress]);

  return {
    clipIdRef,
  };
};

export default useAlarmStore;
