import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { useUserInfo } from "@/features/userInfo";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const videoCategory = [
  {
    name: "인공지능",
    playListId: "PLz-ep5RbHosU2hnz5ejezwaYpdMutMVB0",
  },
  {
    name: "Artificial Intelligence",
    playListId: "PLz-ep5RbHosU2hnz5ejezwaYpdMutMVB0",
  },
  {
    name: "프로그래밍",
    playListId: "PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3",
  },
  {
    name: "Programming",
    playListId: "PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3",
  },
  {
    name: "비즈니스/기획",
    playListId: "PL1O57nCUQ-e-OVRFdIB-Gu1U91yH7egmm",
  },
  {
    name: "Business/Planning",
    playListId: "PL1O57nCUQ-e-OVRFdIB-Gu1U91yH7egmm",
  },
];

type Video = {
  videoId: string;
  title: string;
  id: string;
  duration: string;
  snippet: {
    title: string;
    description: string;
  };
  isTaken: boolean;
};

interface VideoType {
  videos: Video[];
  totalDuration: string;
  currentVideo: Video | null;
  currentVideoDescription: string | null;
  progress: Record<string, number>;
  className: string;
  isPause: boolean;
  setVideos: (videos: Video[]) => void;
  setTotalDuration: (totalDuration: string) => void;
  setCurrentVideo: (currentVideo: Video | null) => void;
  setCurrentVideoDescription: (currentVideoDescription: string | null) => void;
  setProgress: (videoId: string, currentTime: number) => void;
  setIsTaken: (videoId: string, isTaken: boolean) => void;
  setClassName: (className: string) => void;
  setIsPause: (isPause: boolean) => void;
}

export const videoStore = create<VideoType>()(
  persist(
    (set) => ({
      videos: [],
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
      setProgress: (videoId, currentTime) =>
        set((state) => ({
          progress: { ...state.progress, [videoId]: currentTime },
        })),
      setIsTaken: (videoId, isTaken) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId ? { ...video, isTaken } : video
          ),
        })),
      setClassName: (className) => set({ className }),
      setIsPause: (isPause) => set({ isPause }),
    }),
    {
      name: "video",
      partialize: (state) => ({ videos: state.videos }),
    }
  )
);

export const useGetVideo = () => {
  const {
    videos,
    setVideos,
    totalDuration,
    setTotalDuration,
    currentVideo,
    setCurrentVideo,
  } = videoStore();
  const { courseCategory, courseName } = useUserInfo();

  useEffect(() => {
    if (!courseCategory || !courseName) return;

    const currentCategory = videoCategory.find(
      (category) => category.name === courseCategory
    );

    if (!currentCategory) return;

    // 먼저 플레이리스트의 비디오 ID 목록을 가져옴
    fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${currentCategory.playListId}&maxResults=5&key=${API_KEY}`
    )
      .then((res) => res.json())
      .then(async (data) => {
        const videos = data.items;

        // 비디오 ID 배열 생성
        const videoIds = videos
          .map((video: any) => video.snippet.resourceId.videoId)
          .join(",");

        // 각 비디오의 상세정보(duration) 가져오기
        const videoDetailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
        );
        const videoDetailsData = await videoDetailsRes.json();

        // 원본 데이터에 duration 추가
        const enrichedVideos = videos.map((video: any, idx: number) => ({
          ...video,
          id: video.snippet.resourceId.videoId,
          duration: videoDetailsData.items[idx].contentDetails.duration,
        }));

        setVideos(enrichedVideos);
        setCurrentVideo(enrichedVideos[0]);

        const totalSeconds = enrichedVideos.reduce(
          (total: number, video: any) => {
            const match = video.duration.match(/PT((\d+)H)?((\d+)M)?((\d+)S)?/);
            const hours = parseInt(match[2] || "0") * 3600;
            const minutes = parseInt(match[4] || "0") * 60;
            const seconds = parseInt(match[6] || "0");
            return total + hours + minutes + seconds;
          },
          0
        );

        const totalHrs = Math.floor(totalSeconds / 3600);
        const totalMins = Math.floor((totalSeconds % 3600) / 60);
        const totalSecs = totalSeconds % 60;
        setTotalDuration(
          `${
            totalHrs > 0 ? totalHrs + "시간 " : ""
          }${totalMins}분 ${totalSecs}초`
        );
      })
      .catch((err) => console.error(err));
  }, [courseCategory, courseName]);

  return {
    videos,
    totalDuration,
    currentVideo,
    setCurrentVideo,
  };
};

export const parseDuration = (duration: string) => {
  const match = duration.match(/PT((\d+)H)?((\d+)M)?((\d+)S)?/);

  if (!match) return "0분 0초";

  const hours = parseInt(match[2] || "0");
  const minutes = parseInt(match[4] || "0");
  const seconds = parseInt(match[6] || "0");
  return `${hours > 0 ? hours + ": " : ""}${minutes}:${seconds}`;
};

export const parseDurationToSeconds = (duration: string) => {
  const match = duration.match(/PT((\d+)H)?((\d+)M)?((\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[2] || "0");
  const minutes = parseInt(match[4] || "0");
  const seconds = parseInt(match[6] || "0");
  return hours * 3600 + minutes * 60 + seconds;
};
