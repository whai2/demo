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
    const { queue, current, isTriggered, timeoutId } = get();
    console.log("pushToQueue", item, current);

    // 현재보다 우선순위가 높으면 교체
    const shouldInterrupt =
      !current || item.priority < (current.priority ?? Infinity);

    if (shouldInterrupt && isTriggered) {
      // 현재 타이머 취소하고 교체
      if (timeoutId) clearTimeout(timeoutId);

      set({
        current: item,
        isTriggered: true,
        timeoutId: setTimeout(() => {
          get().clearCurrent();
        }, 8000),
      });
      return;
    }

    // 중복 방지
    const isDuplicate =
      current?.message === item.message ||
      queue.some((q) => q.message === item.message);
    if (isDuplicate) return;

    // 일반 큐 삽입 및 정렬
    const updatedQueue = [...queue, item].sort(
      (a, b) => a.priority - b.priority
    );

    set({ queue: updatedQueue });

    if (!isTriggered && !current) {
      get().showNext();
    }
  },

  showNext: () => {
    const { queue } = get();
    if (queue.length === 0) return;

    const [next, ...rest] = queue;

    const timeoutId = setTimeout(() => {
      get().clearCurrent();
    }, 8000);

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
