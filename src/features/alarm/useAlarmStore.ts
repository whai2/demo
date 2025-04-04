import { useEffect, useRef } from "react";

import { create } from "zustand";

import alarmMessages from "@/features/alarm/constants/alarmMessages";

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
  const { courseAttendanceRate } = useUserInfo();

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
      "이제 거의 완강이신데, 앞으로 어떻게 학습하면 좋을지 안내해 드릴까요?",
      `${className} 학습 수고하셨습니다.\n강의 로드맵을 제공해 드릴까요?`,
      "수강 완료가 다가오고 있어요.\n다음에는 어떤 것을 배우고 싶나요?",
    ];

    const randomIndex = Math.floor(Math.random() * randomAlram.length);
    const randomMessage = randomAlram[randomIndex];

    if (courseAttendanceRate >= 0.5) {
      useAlarmStore.setState({
        isTriggered: true,
        isQuiz: false,
        isCallToActionDoing: true,
        data: {
          message: randomMessage,
          type: "callToAction",
          question: "앞으로의 학습 로드맵을 제공해 주세요.",
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
  }, [courseAttendanceRate]);

  useEffect(() => {
    const triggerAlarm = (isOverHalf: boolean, isOverNinety: boolean) => {
      const allMessages = [
        ...alarmMessages.callToAction.map((item) => ({
          ...item,
          type: "callToAction" as const,
        })),
      ];

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
