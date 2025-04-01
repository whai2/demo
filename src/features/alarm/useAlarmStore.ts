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
  const { currentVideo, progress } = videoStore();
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
    if (courseAttendanceRate >= 0.5) {
      useAlarmStore.setState({
        isTriggered: true,
        isCallToActionDoing: true,
        data: {
          message: `강의를 ${
            courseAttendanceRate * 100
          }% 수강했어요!\n강의 로드맵을 제공해 드릴까요?`,
          type: "callToAction",
          question: "강의 로드맵을 제공해 주세요.",
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

    const { isOverHalf, isOverNinety } = useAlarmStore.getState();

    const currentVideoDuration = parseDurationToSeconds(
      currentVideo?.duration ?? ""
    );

    const currentVideoId = currentVideo?.snippet.resourceId.videoId;
    const currentVideoProgress = progress[currentVideoId ?? ""];

    const progressPercentage = currentVideoDuration
      ? (currentVideoProgress / currentVideoDuration) * 100
      : 0;

    const hasPassed50Percent = progressPercentage >= 50;
    const hasPassed90Percent = progressPercentage >= 90;

    if (hasPassed50Percent && !isOverHalf) {
      triggerAlarm(true, false);
    }

    if (hasPassed90Percent && !isOverNinety) {
      triggerAlarm(true, true);
    }
  }, [currentVideo, progress]);

  return {
    clipIdRef,
  };
};

export default useAlarmStore;
