import { useEffect, useRef } from "react";

import alarmMessages, {
  alarmMessagesEnglish,
} from "@/features/alarm/constants/alarmMessages";
import {
  useAlarmStore,
  type AlarmType,
} from "@/features/alarm/models/useAlarmStore";
import { useUserInfo } from "@/features/userInfo";
import { parseDurationToSeconds, videoStore } from "@/features/video";

export const triggerNextAlarm = (type: AlarmType) => {
  const { currentLanguage } = useUserInfo.getState();
  const store = useAlarmStore.getState();

  const isKorean = currentLanguage === "한국어";
  const source = isKorean ? alarmMessages : alarmMessagesEnglish;
  const messages = source[type];

  const lastIndex =
    type === "default"
      ? store.lastDefaultIndex
      : type === "callToAction"
      ? store.lastCallToActionIndex
      : type === "quiz"
      ? store.lastQuizIndex
      : type === "pause"
      ? store.lastPauseIndex
      : type === "mouse"
      ? store.lastMouseIndex
      : 0;

  const nextIndex = (lastIndex + 1) % messages.length;
  const messageObj = messages[nextIndex];

  const alarmItem = {
    message: messageObj.message,
    question: "question" in messageObj ? messageObj.question : undefined,
    type,
    priority: type === "callToAction" ? 1 : type === "quiz" ? 1 : 3,
  } as const;

  store.pushToQueue(alarmItem);

  if (type === "default") {
    store.setLastDefaultIndex(nextIndex);
  } else if (type === "callToAction") {
    store.setLastCallToActionIndex(nextIndex);
  } else if (type === "quiz") {
    store.setLastQuizIndex(nextIndex);
  } else if (type === "pause") {
    store.setLastPauseIndex(nextIndex);
  } else if (type === "mouse") {
    store.setLastMouseIndex(nextIndex);
  }
};

export const useTriggerAlarm = () => {
  const { courseAttendanceRate } = useUserInfo();
  const { currentVideo, progress, isPause } = videoStore();
  // useMouseInactivity(() => {
  //   triggerNextAlarm("mouse");
  // });

  useEffect(() => {
    if (courseAttendanceRate >= 0.5) {
      triggerNextAlarm("callToAction");
    }
  }, [courseAttendanceRate]);

  useEffect(() => {
    const currentVideoDuration = parseDurationToSeconds(
      currentVideo?.duration ?? ""
    );

    const currentVideoId = currentVideo?.id;
    const currentVideoProgress = progress[currentVideoId ?? ""];

    const progressPercentage = currentVideoDuration
      ? (currentVideoProgress / currentVideoDuration) * 100
      : 0;

    const hasPassed80Percent = progressPercentage >= 80;

    const store = useAlarmStore.getState();

    if (
      hasPassed80Percent &&
      currentVideoId &&
      !store.hasQuizTriggered(currentVideoId)
    ) {
      store.setQuizTriggeredForLecture(currentVideoId);
      triggerNextAlarm("quiz");
    }
  }, [progress, currentVideo]);

  useEffect(() => {
    const interval = setInterval(() => {
      triggerNextAlarm("default");
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isPause) {
      triggerNextAlarm("pause");
    }
  }, [isPause]);
};

// export const useMouseInactivity = (onInactive: () => void, timeout = 600) => {
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
//   useEffect(() => {
//     const resetTimer = () => {
//       console.log("timeout", timeout, timeoutRef.current);
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);

//       timeoutRef.current = setTimeout(() => {
//         onInactive(); // 1분 이상 움직이지 않음
//       }, timeout);
//     };

//     // 마우스 움직일 때마다 타이머 초기화
//     const handleMouseMove = () => {
//       resetTimer();
//     };

//     window.addEventListener("mousemove", handleMouseMove);

//     // 초기 실행
//     resetTimer();

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, [onInactive, timeout]);
// };
