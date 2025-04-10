import { useEffect } from "react";

import alarmMessages, {
  alarmMessagesEnglish,
} from "@/features/alarm/constants/alarmMessages";
import { useAlarmStore } from "@/features/alarm/models/useAlarmStore";
import { useUserInfo } from "@/features/userInfo";
import { parseDurationToSeconds, videoStore } from "@/features/video";

export const triggerNextAlarm = (type: "default" | "callToAction" | "quiz") => {
  const { currentLanguage } = useUserInfo.getState();
  const store = useAlarmStore.getState();

  const isKorean = currentLanguage === "한국어";
  const source = isKorean ? alarmMessages : alarmMessagesEnglish;
  const messages = source[type];

  const lastIndex =
    type === "default" ? store.lastDefaultIndex : store.lastCallToActionIndex;

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
  }
};

export const useTriggerAlarm = () => {
  const { courseAttendanceRate } = useUserInfo();
  const { currentVideo, progress, isPause } = videoStore();

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
      triggerNextAlarm("default");
    }
  }, [isPause]);
};
