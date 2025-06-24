import { create } from "zustand";
import { persist } from "zustand/middleware";

export const demoCourse = {
  title: "경영지도사 2차 인사관리",
  description: "국가공인 경영지도사 2차 인사관리 과정",
  category: "경영지도사",
};

export const courseInfo = {
  course_type: "파이널 특강",
  instructor: "정경호",
  total_play_time: 2,
  total_clip_count: 2,
  course_curriculum: {
    chapters: [
      {
        chapter_id: "theory_chapter",
        chapter_number: 1,
        chapter_title: "인사관리 핵심요약",
        chapter_description: "경영지도사 2차 인사관리 이론 정리",
        time: "54:34",
        clips: [
          {
            clip_id: "theory_clip",
            clip_number: 1,
            clip_title: "인사관리 핵심요약",
            clip_description: "인사관리 핵심 이론 강의",
            clip_play_time: 54,
            clip_level: 1,
          },
        ],
      },
      {
        chapter_id: "practice_chapter",
        chapter_number: 2,
        chapter_title: "인사관리 예상문제풀이",
        chapter_description: "경영지도사 2차 인사관리 문제풀이",
        time: "32:46",
        clips: [
          {
            clip_id: "practice_clip",
            clip_number: 1,
            clip_title: "인사관리 예상문제풀이",
            clip_description: "기출문제 및 예상문제 해설",
            clip_play_time: 32,
            clip_level: 2,
          },
        ],
      },
    ],
  },
};

interface VideoType {
  videos: any[];
  totalDuration: string;
  currentVideo: any | null;
  currentVideoDescription: string | null;
  progress: Record<string, number>;
  className: string;
  isPause: boolean;
  setVideos: (videos: any[]) => void;
  setTotalDuration: (totalDuration: string) => void;
  setCurrentVideo: (currentVideo: any | null) => void;
  setCurrentVideoDescription: (currentVideoDescription: string | null) => void;
  setProgress: (videoId: string, currentTime: number) => void;
  setIsTaken: (videoId: string, isTaken: boolean) => void;
  setClassName: (className: string) => void;
  setIsPause: (isPause: boolean) => void;
}

export const useVideoStore = create<VideoType>()(
  // persist(
    (set) => ({
      videos: [
        {
          chapter_id: "theory_chapter",
          chapter_number: 1,
          chapter_title: "인사관리 핵심요약",
          chapter_description: "경영지도사 2차 인사관리 이론 정리",
          time: "54:34",
          clips: [
            {
              clip_id: "theory_clip",
              clip_number: 1,
              clip_title: "인사관리 핵심요약",
              clip_description: "인사관리 핵심 이론 강의",
              clip_play_time: 54,
              clip_level: 1,
            },
          ],
        },
        {
          chapter_id: "practice_chapter",
          chapter_number: 2,
          chapter_title: "인사관리 예상문제풀이",
          chapter_description: "경영지도사 2차 인사관리 문제풀이",
          time: "32:46",
          clips: [
            {
              clip_id: "practice_clip",
              clip_number: 1,
              clip_title: "인사관리 예상문제풀이",
              clip_description: "기출문제 및 예상문제 해설",
              clip_play_time: 32,
              clip_level: 2,
            },
          ],
        },
      ],
      totalDuration: "",
      currentVideo: null,
      currentVideoDescription: null,
      progress: {},
      className: "",
      isPause: false,
      setVideos: (videos) => set({ videos }),
      setTotalDuration: (totalDuration) => set({ totalDuration }),
      setCurrentVideo: (currentVideo) => set({ currentVideo }),
      setCurrentVideoDescription: (currentVideoDescription) =>
        set({ currentVideoDescription }),
      setProgress: (id, currentTime) =>
        set((state) => ({
          progress: { ...state.progress, [id]: currentTime },
        })),
      setIsTaken: (id, isTaken) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.chapter_id === id ? { ...video, isTaken } : video
          ),
        })),
      setClassName: (className) => set({ className }),
      setIsPause: (isPause) => set({ isPause }),
    }),
    // {
    //   name: "video",
    //   partialize: (state) => ({ videos: state.videos }),
    // }
  // )
);
