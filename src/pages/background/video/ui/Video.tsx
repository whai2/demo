import { useEffect, useRef } from "react";
import YouTube from "react-youtube";

import { useAlarmStore } from "@/features/alarm";
import { useUserInfo } from "@/features/userInfo";
import { parseDuration, useGetVideo, videoStore } from "@/features/video";

import styled from "styled-components";

const YoutubePlaylist = () => {
  const { currentVideo, videos, totalDuration, setCurrentVideo } =
    useGetVideo();
  const { setIsTaken } = videoStore();
  const { setCourseAttendanceRate } = useUserInfo();

  useEffect(() => {
    setIsTaken(videos[0]?.id, true);
  }, [currentVideo]);

  useEffect(() => {
    const takenVideos = videos.filter((video) => video.isTaken);

    setCourseAttendanceRate(takenVideos.length / videos.length);
  }, [videos, currentVideo]);

  return (
    <S.Container>
      <S.Content>
        {currentVideo && currentVideo.id && (
          <>
            <S.TopBar>
              <div>{currentVideo.snippet.title}</div>
              <div>{totalDuration}</div>
            </S.TopBar>
            <S.VideoContainer>
              <InteractiveYouTubePlayer videoId={currentVideo.id} />
            </S.VideoContainer>
          </>
        )}
        <S.BottomBar>
          <S.Tab>강의 자료</S.Tab>
          <S.Tab>강의 통계</S.Tab>
        </S.BottomBar>
      </S.Content>
      <S.SideBar>
        <S.SideBarHeader>강의 목차</S.SideBarHeader>
        {videos.map((video: any, index: number) => (
          <S.SideBarItem
            key={video.id}
            active={currentVideo?.id === video.id}
            onClick={() => {
              useAlarmStore.getState().reset();
              setCurrentVideo(video);
              setIsTaken(video.id, true);
            }}
          >
            {index + 1}. {video.snippet.title}
            <S.Duration>{parseDuration(video.duration)}</S.Duration>
          </S.SideBarItem>
        ))}
      </S.SideBar>
    </S.Container>
  );
};

export default YoutubePlaylist;

const InteractiveYouTubePlayer = ({ videoId }: { videoId: string }) => {
  const { progress, setProgress } = videoStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasSeeked = useRef(false);

  // const onReady = (event: any) => {
  //   const savedTime = progress[videoId];

  //   if (savedTime) {
  //     event.target.seekTo(savedTime);
  //   }

  //   setInterval(() => {
  //     const currentTime = event.target.getCurrentTime();

  //     if (currentTime) {
  //       setProgress(videoId, currentTime);
  //     }
  //   }, 500);
  // };

  const onStateChange = (event: any) => {
    const player = event.target;
    const playerState = event.data;

    if (playerState === 1) {
      // ✅ PLAYING일 때: 처음 한 번만 seekTo
      if (!hasSeeked.current) {
        const savedTime = progress[videoId];
        if (savedTime) {
          player.seekTo(savedTime, true);
        }
        hasSeeked.current = true;
      }

      // 감지 시작
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        const currentTime = player.getCurrentTime();

        if (currentTime) {
          console.log("currentTime", currentTime);
          setProgress(videoId, currentTime);
        }
      }, 500);
    } else {
      // 정지/종료 시 감지 멈추기
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // 영상이 일시정지 되었을 때
    if (playerState === 2) {
      const currentTime = event.target.getCurrentTime();

      setProgress(videoId, currentTime);
    }
  };

  return (
    <S.PlayerWrapper>
      <YouTube
        videoId={videoId}
        opts={{ width: "100%", height: "100%" }}
        // onReady={onReady}
        onStateChange={onStateChange}
      />
    </S.PlayerWrapper>
  );
};

const S = {
  Container: styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
  `,

  SideBar: styled.div`
    width: 400px;
    height: 100%;
    background-color: #f4f4f4;
    padding: 20px;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  `,

  SideBarItem: styled.div<{ active: boolean }>`
    padding: 10px;
    margin-bottom: 8px;
    cursor: pointer;
    border-radius: 5px;
    background-color: ${({ active }) => (active ? "#ddd" : "transparent")};

    &:hover {
      background-color: #eaeaea;
    }
  `,

  Content: styled.div`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,

  VideoContainer: styled.div`
    padding: 10px 50px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  `,

  SideBarHeader: styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #51a1ca;
  `,

  Duration: styled.div`
    font-size: 14px;
    color: #888;
    margin-top: 5px;
  `,

  PlayerWrapper: styled.div`
    position: relative;
    padding-bottom: 58.25%;
    width: 100%;
    height: 0;
    overflow: hidden;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `,

  TopBar: styled.div`
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    padding: 0 40px;
    justify-content: space-between;
  `,

  BottomBar: styled.div`
    width: 100%;
    height: 60px;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  Tab: styled.button`
    width: 100%;
    background: none;
    border: none;
    padding: 10px 20px;
    margin: 0 10px;
    cursor: pointer;
    font-size: 16px;
    color: #555;

    &:hover {
      color: #000;
    }
  `,

  SaveButton: styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    font-size: 16px;

    &:hover {
      background-color: #0056b3;
    }
  `,
};
