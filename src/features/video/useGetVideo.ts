import { useEffect } from "react";
import { create } from "zustand";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const PLAYLIST_ID = "PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3";

type Video = {
  videoId: string;
  title: string;
  duration: string;
  snippet: {
    title: string;
    resourceId: {
      videoId: string;
    };
    description: string;
  };
};

interface VideoType {
  videos: Video[];
  totalDuration: string;
  currentVideo: Video | null;
  currentVideoDescription: string | null;
  progress: Record<string, number>;
  setVideos: (videos: Video[]) => void;
  setTotalDuration: (totalDuration: string) => void;
  setCurrentVideo: (currentVideo: Video | null) => void;
  setCurrentVideoDescription: (currentVideoDescription: string | null) => void;
  setProgress: (videoId: string, currentTime: number) => void;
}

export const videoStore = create<VideoType>()((set) => ({
  videos: [],
  totalDuration: "",
  currentVideo: null,
  currentVideoDescription: null,
  progress: {},
  setVideos: (videos) => set({ videos }),
  setTotalDuration: (totalDuration) => set({ totalDuration }),
  setCurrentVideo: (currentVideo) => set({ currentVideo }),
  setCurrentVideoDescription: (currentVideoDescription) =>
    set({ currentVideoDescription }),
  setProgress: (videoId, currentTime) =>
    set((state) => ({
      progress: { ...state.progress, [videoId]: currentTime },
    })),
}));

export const useGetVideo = () => {
  const {
    videos,
    setVideos,
    totalDuration,
    setTotalDuration,
    currentVideo,
    setCurrentVideo,
    setCurrentVideoDescription,
  } = videoStore();

  useEffect(() => {
    // 먼저 플레이리스트의 비디오 ID 목록을 가져옴
    fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=5&key=${API_KEY}`
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
  }, []);

  useEffect(() => {
    const fetchCaptions = async (videoId: string) => {
      const res = await fetch(
        `https://video.google.com/timedtext?lang=en&v=${videoId}`
      );
      const xmlText = await res.text();

      // XML 파싱
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "text/xml");
      const texts = Array.from(xml.getElementsByTagName("text")).map(
        (node) => node.textContent
      );

      const fullTranscript = texts.join(" ");
      return fullTranscript;
    };

    if (currentVideo) {
      fetchCaptions(currentVideo?.snippet.resourceId.videoId).then(
        (transcript) => {
          setCurrentVideoDescription(transcript);
        }
      );
    }
  }, [currentVideo]);

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
  return `${hours > 0 ? hours + "시간 " : ""}${minutes}분 ${seconds}초`;
};

export const parseDurationToSeconds = (duration: string) => {
  const match = duration.match(/PT((\d+)H)?((\d+)M)?((\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[2] || "0");
  const minutes = parseInt(match[4] || "0");
  const seconds = parseInt(match[6] || "0");
  return hours * 3600 + minutes * 60 + seconds;
};
