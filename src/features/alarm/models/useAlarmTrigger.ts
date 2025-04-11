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
  useMouseInactivity(() => {
    triggerNextAlarm("mouse");
  });

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
    }, 1 * 60 * 1000 + 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isPause) {
      triggerNextAlarm("pause");
    }
  }, [isPause]);
};

export const useMouseInactivity = (onInactive: () => void, timeout = 1000 * 30) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTriggeredRef = useRef<number | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const now = Date.now();
      const last = lastTriggeredRef.current;

      // 마지막 실행 이후 충분한 시간이 지났을 때만 트리거
      if (!last || now - last >= timeout) {
        lastTriggeredRef.current = now;
        onInactive();
      }
    }, timeout);
  };

  useEffect(() => {
    const handleActivity = () => {
      resetTimer();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    resetTimer(); // 초기화

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [onInactive, timeout]);
};
