import { create } from "zustand";

export type AlarmType = "default" | "callToAction" | "quiz" | "pause" | "mouse";

interface AlarmMessageInstanceType {
  message: string;
  question?: string;
  type: AlarmType;
  priority: number;
}

interface AlarmState {
  queue: AlarmMessageInstanceType[];
  current: AlarmMessageInstanceType | null;
  isTriggered: boolean;
  timeoutId: NodeJS.Timeout | null;
  lastDefaultIndex: number;
  lastPauseIndex: number;
  lastCallToActionIndex: number;
  lastQuizIndex: number;
  lastMouseIndex: number;
  hasTriggeredQuizMap: Record<string, boolean>;

  pushToQueue: (item: AlarmMessageInstanceType) => void;
  showNext: () => void;
  clearCurrent: () => void;
  reset: () => void;
  setLastDefaultIndex: (index: number) => void;
  setLastPauseIndex: (index: number) => void;
  setLastCallToActionIndex: (index: number) => void;
  setLastQuizIndex: (index: number) => void;
  setQuizTriggeredForLecture: (lectureId: string) => void;
  hasQuizTriggered: (lectureId: string) => boolean;
  setLastMouseIndex: (index: number) => void;
}

export const useAlarmStore = create<AlarmState>((set, get) => ({
  queue: [],
  current: null,
  isTriggered: false,
  timeoutId: null,
  lastDefaultIndex: 0,
  lastPauseIndex: 0,
  lastCallToActionIndex: 0,
  lastQuizIndex: 0,
  lastMouseIndex: 0,
  hasTriggeredQuizMap: {},

  pushToQueue: (item) => {
    const { current, isTriggered, timeoutId } = get();

    const isDuplicate =
      current?.message === item.message && current?.type === item.type;
    if (isDuplicate) return;

    if (!current || !isTriggered) {
      const newTimeoutId = setTimeout(() => {
        get().clearCurrent();
      }, 15000);

      set({
        current: item,
        isTriggered: true,
        queue: [],
        timeoutId: newTimeoutId,
      });

      return;
    }

    const isHigherPriority = item.priority <= current.priority;

    if (isHigherPriority) {
      if (timeoutId) clearTimeout(timeoutId);

      const newTimeoutId = setTimeout(() => {
        get().clearCurrent();
      }, 15000);

      set({
        current: item,
        isTriggered: true,
        queue: [],
        timeoutId: newTimeoutId,
      });

      return;
    }

    return;
  },

  showNext: () => {
    const { queue } = get();
    if (queue.length === 0) return;

    const [next, ...rest] = queue;

    const timeoutId = setTimeout(() => {
      get().clearCurrent();
    }, 15000);

    set({
      current: next,
      isTriggered: true,
      queue: rest,
      timeoutId,
    });
  },

  clearCurrent: () => {
    const { timeoutId } = get();
    if (timeoutId) clearTimeout(timeoutId);

    set({
      current: null,
      isTriggered: false,
      timeoutId: null,
    });

    get().showNext();
  },

  reset: () => {
    const { timeoutId } = get();
    if (timeoutId) clearTimeout(timeoutId);
    set({
      queue: [],
      current: null,
      isTriggered: false,
      timeoutId: null,
    });
  },

  setLastDefaultIndex: (index: number) => {
    set({ lastDefaultIndex: index });
  },
  setLastPauseIndex: (index: number) => {
    set({ lastPauseIndex: index });
  },
  setLastCallToActionIndex: (index: number) => {
    set({ lastCallToActionIndex: index });
  },
  setLastQuizIndex: (index: number) => {
    set({ lastQuizIndex: index });
  },
  setQuizTriggeredForLecture: (lectureId) =>
    set((state) => {
      const resetMap = Object.keys(state.hasTriggeredQuizMap).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {}
      );

      return {
        hasTriggeredQuizMap: {
          ...resetMap,
          [lectureId]: true,
        },
      };
    }),
  hasQuizTriggered: (lectureId) => {
    return get().hasTriggeredQuizMap[lectureId] === true;
  },
  setLastMouseIndex: (index: number) => {
    set({ lastMouseIndex: index });
  },
}));
