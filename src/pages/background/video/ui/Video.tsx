import { useEffect, useRef } from "react";
import YouTube from "react-youtube";

import { useAlarmStore } from "@/features/alarm";
import { courses } from "@/features/chat";
import { useUserInfo } from "@/features/userInfo";
import {
  parseDuration,
  parseDurationToSeconds,
  useGetVideo,
  videoStore,
} from "@/features/video";

import { ReactComponent as Bar } from "../assets/bar.svg";

import styled from "styled-components";

const YoutubePlaylist = () => {
  const { currentVideo, videos, setCurrentVideo } = useGetVideo();
  const { setIsTaken, progress, setClassName } = videoStore();
  const {
    setCourseAttendanceRate,
    courseCategory,
    courseName,
    courseAttendanceRate,
    reset,
  } = useUserInfo();

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  const currentVideoDuration = parseDurationToSeconds(
    currentVideo?.duration ?? ""
  );

  const currentVideoId = currentVideo?.id;
  const currentVideoProgress = progress[currentVideoId ?? ""];

  const progressPercentage = currentVideoDuration
    ? (currentVideoProgress / currentVideoDuration) * 100
    : 0;

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
              <S.UserInfoButton onClick={reset}>
                <S.ButtonText>강의 정보 변경</S.ButtonText>
              </S.UserInfoButton>
              <S.TopBarInner>
                <S.TopBarCategory>{courseCategory}</S.TopBarCategory>
                <Bar />
                <S.TopBarTitle>{course?.name}</S.TopBarTitle>
              </S.TopBarInner>
              <S.AttendanceRate>
                <div>강의 완료율 {courseAttendanceRate * 100}%</div>
                <div>
                  영상 진행률{" "}
                  {progressPercentage ? progressPercentage.toFixed(0) : 0}%
                </div>
              </S.AttendanceRate>
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
        <S.SideBarHeader>
          <S.SideBarHeaderInner>
            <S.SideBarHeaderInnerInner>
              <S.SideBarHeaderText>강의 목차</S.SideBarHeaderText>
            </S.SideBarHeaderInnerInner>
          </S.SideBarHeaderInner>
        </S.SideBarHeader>

        <S.SideBarUnderBar />

        <S.SideBarContent>
          {course &&
            course.content &&
            videos.map((video: any, index: number) => {
              const item = course.content[index];
              const sessionTitle = item && Object.keys(item)[0];
              const contentTitle =
                item && item[sessionTitle as keyof typeof item];

              return (
                <S.SideBarItem
                  key={video.id}
                  active={currentVideo?.id === video.id}
                  onClick={() => {
                    useAlarmStore.getState().reset();
                    setCurrentVideo(video);
                    setIsTaken(video.id, true);
                    setClassName(sessionTitle);
                  }}
                >
                  <S.Number>[{sessionTitle}]</S.Number>
                  {contentTitle}
                  <S.Duration>{parseDuration(video.duration)}</S.Duration>
                </S.SideBarItem>
              );
            })}
        </S.SideBarContent>
      </S.SideBar>
    </S.Container>
  );
};

export default YoutubePlaylist;

const InteractiveYouTubePlayer = ({ videoId }: { videoId: string }) => {
  const { progress, setProgress } = videoStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const onReady = (event: any) => {
    const savedTime = progress[videoId];

    if (savedTime) {
      event.target.seekTo(savedTime);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const currentTime = event.target.getCurrentTime();

      if (currentTime) {
        setProgress(videoId, currentTime);
      }
    }, 500);
  };

  const onStateChange = (event: any) => {
    const playerState = event.data;

    if (playerState === 2) {
      const currentTime = event.target.getCurrentTime();

      setProgress(videoId, currentTime);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <S.PlayerWrapper>
      <YouTube
        videoId={videoId}
        opts={{ width: "100%", height: "100%" }}
        onReady={onReady}
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
    // padding: 20px;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  `,

  SideBarItem: styled.div<{ active: boolean }>`
    padding: 16px 24px;
    margin-bottom: 8px;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    width: 343px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    background-color: ${({ active }) => (active ? "#eaeaea" : "#fff")};
    border-radius: 4px;

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
    display: flex;
    align-items: center;
    flex: 1 0 0;
    align-self: stretch;
    padding: 0 0 20px 0;
  `,

  SideBarHeaderInner: styled.div`
    display: flex;
    width: 277px;
    padding: 0px 24px;
    align-items: flex-start;
    align-self: stretch;
  `,

  SideBarHeaderInnerInner: styled.div`
    display: flex;
    width: 253px;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    align-self: stretch;
  `,

  SideBarHeaderText: styled.div`
    padding-top: 30px;
    display: flex;
    width: 49px;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
    color: #1a2a9c;
    font-feature-settings: "liga" off, "clig" off;

    /* Body2_bold_14 */
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 171.429% */
    white-space: nowrap;
  `,

  SideBarUnderBar: styled.div`
    margin-left: 15px;
    width: 80px;
    height: 4px;
    align-self: stretch;
    background: #1a2a9c;
  `,

  SideBarContent: styled.div`
    display: flex;
    width: 391px;
    height: 791px;
    padding: 24px 24px 0px 24px;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
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

  UserInfoButton: styled.button`
    display: inline-flex;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 10px;

    border-radius: 4px;
    background: #1a2a9c;
  `,

  ButtonText: styled.span`
    color: #fff;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 28px; /* 200% */
  `,

  TopBar: styled.div`
    width: 100%;
    height: 100px;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    padding: 0 40px;
    justify-content: space-between;
  `,

  TopBarInner: styled.div`
    display: inline-flex;
    align-items: center;
    gap: 11px;
  `,

  TopBarTitle: styled.span`
    color: var(--GrayBlackColor_13, #212121);
    font-feature-settings: "liga" off, "clig" off;

    /* Body1_bold_16 */
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px; /* 175% */
  `,

  TopBarCategory: styled.span`
    color: #6e6e73;
    font-feature-settings: "liga" off, "clig" off;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px; /* 175% */
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

  Number: styled.div`
    align-self: stretch;
    color: #97999b;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 160% */
  `,

  AttendanceRate: styled.div`
    display: inline-flex;
    align-items: center;
    gap: 16px;
  `,
};
