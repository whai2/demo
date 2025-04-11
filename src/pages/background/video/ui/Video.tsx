import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

import { Lottie } from "@/shared/ui";

import { useAlarmStore } from "@/features/alarm";
import { EnglishCourses, KoreanCourses } from "@/features/chat";
import { useUserInfo } from "@/features/userInfo";
import {
  parseDuration,
  parseDurationToSeconds,
  useGetVideo,
  videoStore,
} from "@/features/video";

import { ReactComponent as Alert } from "../assets/alert.svg";
import { ReactComponent as Bar } from "../assets/bar.svg";
import animationData from "../assets/courseComplete.json";
import animationData2 from "../assets/courseCompleteEnglish.json";
import { ReactComponent as Docs } from "../assets/docs.svg";
import { ReactComponent as Docs2 } from "../assets/docs2.svg";
import { ReactComponent as Introduction } from "../assets/introduce.svg";
import { ReactComponent as Statistics } from "../assets/statistics.svg";

import styled from "styled-components";

const EnglishLesson = {
  "1차시": "Lesson 1",
  "2차시": "Lesson 2",
  "3차시": "Lesson 3",
  "4차시": "Lesson 4",
  "5차시": "Lesson 5",
  "6차시": "Lesson 6",
};

const YoutubePlaylist = () => {
  const { currentVideo, videos, setCurrentVideo } = useGetVideo();
  const { setIsTaken, progress, setClassName, setProgress } = videoStore();
  const {
    setCourseAttendanceRate,
    courseCategory,
    courseName,
    courseAttendanceRate,
    reset,
    currentLanguage,
  } = useUserInfo();

  const [isHighlighted, setIsHighlighted] = useState(false);

  const prevValueRef = useRef<number>(courseAttendanceRate);

  const courses = currentLanguage === "한국어" ? KoreanCourses : EnglishCourses;

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

  useEffect(() => {
    if (prevValueRef.current !== courseAttendanceRate) {
      setIsHighlighted(true);

      const timeout = setTimeout(() => setIsHighlighted(false), 1500);
      prevValueRef.current = courseAttendanceRate;

      return () => clearTimeout(timeout);
    }
  }, [courseAttendanceRate]);

  const [isHighlighted2, setIsHighlighted2] = useState(false);

  useEffect(() => {
    if (isHighlighted2) {
      const timer = setTimeout(() => {
        setIsHighlighted2(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isHighlighted2]);

  useEffect(() => {
    if (courseAttendanceRate) {
      setIsHighlighted2(true);
    }
  }, [courseAttendanceRate]);

  return (
    <S.Container>
      <S.Content>
        {currentVideo && currentVideo.id && (
          <>
            <S.TopBar>
              <S.UserInfoButton onClick={reset}>
                <S.ButtonText>
                  {currentLanguage === "한국어"
                    ? "강의 정보 변경"
                    : "Edit Course Info"}
                </S.ButtonText>
              </S.UserInfoButton>

              <S.TopBarInner>
                <S.TopBarCategory>{courseCategory}</S.TopBarCategory>
                <Bar />
                <S.TopBarTitle>{course?.name}</S.TopBarTitle>
              </S.TopBarInner>

              {currentLanguage === "한국어" ? (
                <S.CourseCompleteWrapperEnglish>
                  {isHighlighted2 ? (
                    <S.LottieContainer $isKorean={currentLanguage === "한국어"}>
                      <Lottie
                        animationData={animationData}
                        style={{
                          width: 130,
                          paddingBottom: 0,
                          margin: 0,
                          display: "block",
                        }}
                      />
                      <S.LottiePercentage
                        $isKorean={currentLanguage === "한국어"}
                        $isCompleted={courseAttendanceRate === 1}
                      >
                        {Math.round(courseAttendanceRate * 100)}%
                      </S.LottiePercentage>
                    </S.LottieContainer>
                  ) : (
                    <S.CourseComplete $isHighlighted={isHighlighted}>
                      강의 완료율 {Math.round(courseAttendanceRate * 100)}%
                    </S.CourseComplete>
                  )}

                  <S.VideoProgress>
                    영상 진행률{" "}
                    <S.Percentage $progressPercentage={progressPercentage}>
                      {progressPercentage ? progressPercentage.toFixed(0) : 0}%
                    </S.Percentage>
                  </S.VideoProgress>
                </S.CourseCompleteWrapperEnglish>
              ) : (
                <S.CourseCompleteWrapperEnglish>
                  {isHighlighted2 ? (
                    <S.LottieContainer $isKorean={currentLanguage === "한국어"}>
                      <Lottie
                        animationData={animationData2}
                        style={{
                          width: 250,
                          paddingBottom: 0,
                          margin: 0,
                          display: "block",
                        }}
                      />
                      <S.LottiePercentage
                        $isKorean={currentLanguage === "한국어"}
                        $isCompleted={courseAttendanceRate === 1}
                      >
                        {Math.round(courseAttendanceRate * 100)}%
                      </S.LottiePercentage>
                    </S.LottieContainer>
                  ) : (
                    <S.CourseComplete $isHighlighted={isHighlighted}>
                      Course Completion Rate{" "}
                      {Math.round(courseAttendanceRate * 100)}%
                    </S.CourseComplete>
                  )}

                  {/* <S.LottieContainer>
                    <Lottie
                      animationData={animationData2}
                      style={{
                        width: 250,
                        paddingBottom: 0,
                        margin: 0,
                        display: "block",
                      }}
                    />
                    <S.LottiePercentage>
                      {Math.round(courseAttendanceRate * 100)}%
                    </S.LottiePercentage>
                  </S.LottieContainer> */}

                  <S.VideoProgress>
                    Video Progress{" "}
                    <S.Percentage $progressPercentage={progressPercentage}>
                      {progressPercentage ? progressPercentage.toFixed(0) : 0}%
                    </S.Percentage>
                  </S.VideoProgress>
                </S.CourseCompleteWrapperEnglish>
              )}
            </S.TopBar>
            <S.VideoContainer>
              <InteractiveYouTubePlayer videoId={currentVideo.id} />
            </S.VideoContainer>
          </>
        )}

        <S.BottomContainer>
          <S.Tab>
            <Alert />
            <S.TabText>
              {currentLanguage === "한국어" ? "공지사항" : "Announcements"}
            </S.TabText>
          </S.Tab>
          <S.TabBar />
          <S.Tab>
            <Docs />
            <S.TabText>
              {currentLanguage === "한국어"
                ? "강의소개"
                : "Course Introduction"}
            </S.TabText>
          </S.Tab>
          <S.TabBar />
          <S.Tab>
            <Introduction />
            <S.TabText>
              {currentLanguage === "한국어"
                ? "강사소개"
                : "Instructor Introduction"}
            </S.TabText>
          </S.Tab>
          <S.TabBar />
          <S.Tab>
            <Docs2 />
            <S.TabText>
              {currentLanguage === "한국어" ? "강의자료" : "Course Materials"}
            </S.TabText>
          </S.Tab>
          <S.TabBar />
          <S.Tab>
            <Statistics />
            <S.TabText>
              {currentLanguage === "한국어"
                ? "학습통계"
                : "Learning Statistics"}
            </S.TabText>
          </S.Tab>
        </S.BottomContainer>
      </S.Content>

      <S.SideBar>
        <S.SideBarHeader>
          <S.SideBarHeaderInner>
            <S.SideBarHeaderInnerInner>
              <S.SideBarHeaderText>
                {currentLanguage === "한국어" ? "강의 목차" : "Course Outline"}
              </S.SideBarHeaderText>
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
                    setProgress(video.id, 0);
                  }}
                >
                  <S.Number>
                    [
                    {currentLanguage === "한국어"
                      ? `${index + 1}회차`
                      : EnglishLesson[
                          sessionTitle as keyof typeof EnglishLesson
                        ]}
                    ]
                  </S.Number>
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
  const { progress, setProgress, setIsPause } = videoStore();

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
        setIsPause(false);
        setProgress(videoId, currentTime);
      }
    }, 500);
  };

  const onStateChange = async (event: any) => {
    const playerState = event.data;

    if (playerState === 2) {
      const currentTime = await event.target.getCurrentTime();
      const savedProgress = progress[videoId] ?? 0;

      const diff = Math.abs(currentTime - savedProgress);

      if (diff < 0.5) {
        setIsPause(true);
      } else {
        setIsPause(false);
      }

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
    max-height: 100vh;
  `,

  VideoContainer: styled.div`
    padding: 10px 50px;
    width: 100%;
    height: 100%;
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
    height: 100%;
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
    max-width: 100%;

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
    gap: 20px;
  `,

  TopBarInner: styled.div`
    display: inline-flex;
    align-items: center;
    gap: 11px;
    max-width: 500px;
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
    white-space: nowrap;
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
    display: flex;
    padding: 18px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;
    border: none;
    border-radius: 4px;
  `,

  TabText: styled.span`
    color: var(--GREY-2_444444_27, #444);
    font-feature-settings: "liga" off, "clig" off;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px; /* 175% */
    white-space: nowrap;
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

  BottomContainer: styled.div`
    display: flex;
    align-items: center;
    align-self: stretch;
    background: var(--WHITE_FFFFFF_100, #fff);

    /* Elevation_5 */
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.16);
  `,

  TabBar: styled.div`
    width: 1px;
    height: 20px;
    background: var(--GREY--2_D3D3D3_83, #d3d3d3);
  `,

  CourseComplete: styled.div<{
    $isHighlighted?: boolean;
  }>`
    position: absolute;
    width: 250px;
    top: -20px;
    right: 0;
    color: ${({ $isHighlighted }) => ($isHighlighted ? "#1a2a9c" : "#6e6e73")};

    font-family: Pretendard;
    font-size: 17px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 111.111% */
    max-height: 30px;

    transition: color 0.3s ease, font-weight 0.3s ease;
  `,

  VideoProgress: styled.div<{
    $isHighlighted?: boolean;
  }>`
    position: absolute;
    width: 250px;
    top: 10px;
    right: 0;
    color: ${({ $isHighlighted }) => ($isHighlighted ? "#1a2a9c" : "#6e6e73")};

    font-family: Pretendard;
    font-size: 17px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 111.111% */
    max-height: 30px;

    transition: color 0.3s ease, font-weight 0.3s ease;
  `,

  Percentage: styled.span<{
    $progressPercentage?: number;
  }>`
    ${({ $progressPercentage }) => {
      if ($progressPercentage && $progressPercentage >= 99.5) {
        return `
        background: linear-gradient(270deg, #36C3FF 4.41%, #3E73FF 100%);
      `;
      }
      if ($progressPercentage && $progressPercentage >= 80) {
        return `
        background: linear-gradient(270deg, #1BD571 4.41%, #31CBC6 100%);
      `;
      }
      if ($progressPercentage && $progressPercentage >= 50) {
        return `
        background: linear-gradient(270deg, #FF9A51 4.41%, #FF6161 100%);
      `;
      }
      if ($progressPercentage && $progressPercentage >= 30) {
        return `
        background: linear-gradient(270deg, #F25AFF 4.41%, #FF6868 100%);
      `;
      }
      return `
      color: #6e6e73;
    `;
    }}

    ${({ $progressPercentage }) =>
      (($progressPercentage && $progressPercentage >= 30) ||
        ($progressPercentage && $progressPercentage >= 50) ||
        ($progressPercentage && $progressPercentage >= 80) ||
        ($progressPercentage && $progressPercentage === 100)) &&
      `
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  `}
  `,

  LottieContainer: styled.div<{
    $isKorean?: boolean;
  }>`
    position: absolute;
    top: -30px;
    ${({ $isKorean }) => ($isKorean ? "right: 160px;" : "right: 20px;")}
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  CourseCompleteWrapper: styled.div`
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  CourseCompleteWrapperEnglish: styled.div`
    position: relative;
    width: 250px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    padding: 5px;
  `,

  LottiePercentage: styled.div<{
    $isKorean?: boolean;
    $isCompleted?: boolean;
  }>`
    position: absolute;
    ${({ $isKorean }) => ($isKorean ? "top: 6.5px;" : "top: 5px;")}
    ${({ $isCompleted }) => ($isCompleted ? "right: -40px;" : "right: -30px;")}
    font-size: 17px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;

    /* 초기 상태: 그라데이션 */
    background: linear-gradient(90deg, #456eff, #2cccff);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;

    animation: shine 3s ease-in-out infinite;

    @keyframes shine {
      0% {
        background-position: 0% center;
      }
      50% {
        background-position: 100% center;
      }
      100% {
        background-position: 0% center;
      }
    }

    // @keyframes flicker {
    //   0%,
    //   100% {
    //     background: none;
    //     color: #6e6e73;
    //     -webkit-text-fill-color: #6e6e73;
    //     background-clip: initial;
    //     -webkit-background-clip: initial;
    //   }
    //   50% {
    //     background: linear-gradient(90deg, #456eff, #2cccff);
    //     color: transparent;
    //     -webkit-text-fill-color: transparent;
    //     background-clip: text;
    //     -webkit-background-clip: text;
    //   }
    // }
  `,
};
