import { useEffect, useRef } from "react";
import ReactPlayer from "react-player";

import { Lottie } from "@/shared/ui";
import TutorButton from "./TutorButton";

import { useUserInfo } from "@/features/userInfo";
import { courseInfo, useVideoStore } from "@/features/video";
import { useLottieHighLight } from "../../hooks/useLottieHighLight";

import { ReactComponent as Alert } from "../assets/alert.svg";
// import animationData2 from "../assets/courseCompleteEnglish.json";
import { ReactComponent as Bar } from "../assets/bar.svg";
import { ReactComponent as Docs } from "../assets/docs.svg";
import { ReactComponent as Docs2 } from "../assets/docs2.svg";
import { ReactComponent as Introduction } from "../assets/introduce.svg";
import { ReactComponent as Statistics } from "../assets/statistics.svg";

import styled from "styled-components";

const EnglishLesson = {
  1: "Lesson 1",
  2: "Lesson 2",
};

const YoutubePlaylist = () => {
  const playerRef = useRef<ReactPlayer>(null);

  const {
    progress,
    videos,
    currentVideo,
    setCurrentVideo,
    setIsTaken,
    setProgress,
  } = useVideoStore();

  const {
    setCourseAttendanceRate,
    courseCategory,
    courseName,
    courseAttendanceRate,
    reset,
    currentLanguage,
  } = useUserInfo();

  const { isHighlighted, animationData } = useLottieHighLight(
    courseAttendanceRate,
    currentLanguage === "English"
  );

  const currentVideoDuration = currentVideo?.clips[0]?.clip_play_time;
  const currentVideoId = currentVideo?.chapter_id;
  const currentVideoProgress = progress[currentVideoId ?? ""];
  const progressPercentage = currentVideoDuration
    ? (currentVideoProgress / currentVideoDuration) * 100
    : 0;

  useEffect(() => {
    if (courseAttendanceRate === 0) {
      setCurrentVideo(videos[0]);
    }

    setIsTaken(currentVideo?.chapter_id, true);
  }, [currentVideo, courseAttendanceRate]);

  useEffect(() => {
    const takenVideos = videos.filter((video) => video.isTaken);

    setCourseAttendanceRate(takenVideos.length / videos.length);
  }, [videos, currentVideo]);

  return (
    <S.Container>
      <S.Content>
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
            <S.TopBarTitle>{courseName}</S.TopBarTitle>
          </S.TopBarInner>

          {currentLanguage === "한국어" ? (
            <S.CourseCompleteWrapperEnglish>
              {isHighlighted ? (
                <S.LottieContainer $isKorean={currentLanguage === "한국어"}>
                  <Lottie
                    animationData={animationData}
                    style={{
                      width: 160,
                      paddingBottom: 0,
                      margin: 0,
                      display: "block",
                    }}
                  />
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
              {isHighlighted ? (
                <S.LottieContainer $isKorean={currentLanguage === "한국어"}>
                  <Lottie
                    animationData={animationData}
                    style={{
                      width: 280,
                      paddingBottom: 0,
                      margin: 0,
                      display: "block",
                    }}
                  />
                </S.LottieContainer>
              ) : (
                <S.CourseComplete $isHighlighted={isHighlighted}>
                  Course Completion Rate{" "}
                  {Math.round(courseAttendanceRate * 100)}%
                </S.CourseComplete>
              )}

              <S.VideoProgress>
                Video Progress{" "}
                <S.Percentage $progressPercentage={progressPercentage}>
                  {progressPercentage ? progressPercentage.toFixed(0) : 0}%
                </S.Percentage>
              </S.VideoProgress>
            </S.CourseCompleteWrapperEnglish>
          )}
        </S.TopBar>

        <S.PlayerWrapper>
          <ReactPlayer
            url={currentVideo?.url}
            ref={playerRef}
            controls
            playing={false}
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
            onPlay={() => console.log("재생 시작")}
            onPause={() => console.log("일시 정지")}
            onEnded={() => console.log("영상 끝남")}
            onProgress={({ playedSeconds }) => {
              setProgress(currentVideoId, playedSeconds / 60);
            }}
            onSeek={(seconds) => console.log("사용자가 이동한 위치:", seconds)}
          />
        </S.PlayerWrapper>

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
                : "Meet The Instructor"}
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
          <S.SideBarHeaderText>
            {currentLanguage === "한국어" ? "강의 목차" : "Course Outline"}
          </S.SideBarHeaderText>

          <TutorButton playerRef={playerRef} />
        </S.SideBarHeader>

        <S.SideBarUnderBar />

        <S.SideBarContent>
          {courseInfo.course_curriculum.chapters.map(
            (chapter: any, index: number) => {
              return (
                <S.SideBarItem
                  key={chapter.chapter_id}
                  active={chapter.chapter_id === currentVideo?.chapter_id}
                  onClick={() => {
                    // useAlarmStore.getState().reset();
                    setCurrentVideo(chapter);
                    setIsTaken(chapter.chapter_id, true);
                    setProgress(chapter.chapter_id, 0);
                  }}
                >
                  <S.Number>
                    [
                    {currentLanguage === "한국어"
                      ? `${index + 1}회차`
                      : EnglishLesson[
                          (index + 1) as keyof typeof EnglishLesson
                        ]}
                    ]
                  </S.Number>
                  {chapter.chapter_title}
                  <S.Duration>{chapter.time}</S.Duration>
                </S.SideBarItem>
              );
            }
          )}
        </S.SideBarContent>
      </S.SideBar>
    </S.Container>
  );
};

export default YoutubePlaylist;

// const InteractiveYouTubePlayer = ({ videoId }: { videoId: string }) => {
//   const { progress, setProgress, setIsPause } = videoStore();

//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   const onReady = (event: any) => {
//     const savedTime = progress[videoId];

//     if (savedTime) {
//       event.target.seekTo(savedTime);
//     }

//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     intervalRef.current = setInterval(() => {
//       const currentTime = event.target.getCurrentTime();

//       if (currentTime) {
//         setIsPause(false);
//         setProgress(videoId, currentTime);
//       }
//     }, 500);
//   };

//   const onStateChange = async (event: any) => {
//     const playerState = event.data;

//     if (playerState === 2) {
//       const currentTime = await event.target.getCurrentTime();
//       const savedProgress = progress[videoId] ?? 0;

//       const diff = Math.abs(currentTime - savedProgress);

//       if (diff < 0.5) {
//         setIsPause(true);
//       } else {
//         setIsPause(false);
//       }

//       setProgress(videoId, currentTime);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, []);

//   return (
//     <S.PlayerWrapper>
//       <YouTube
//         videoId={videoId}
//         opts={{ width: "100%", height: "100%" }}
//         onReady={onReady}
//         onStateChange={onStateChange}
//       />
//     </S.PlayerWrapper>
//   );
// };

const S = {
  Container: styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
  `,

  SideBar: styled.div`
    background-color: #f4f4f4;
    // padding: 16px 24px;
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
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // max-height: 100vh;
  `,

  VideoContainer: styled.div`
    padding: 10px 50px;
    width: 100%;
    height: auto;
    // max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  `,

  SideBarHeader: styled.div`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    align-self: stretch;
    padding: 10px 24px 0 30px;
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
    margin-left: 24px;
    width: 80px;
    height: 4px;
    align-self: stretch;
    background: #1a2a9c;
  `,

  SideBarContent: styled.div`
    display: flex;
    width: 391px;
    // height: 791px;
    padding: 24px 24px 24px 24px;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
    height: auto;
  `,

  Duration: styled.div`
    font-size: 14px;
    color: #888;
    margin-top: 5px;
  `,

  PlayerWrapper: styled.div`
    idth: 100%;
    aspect-ratio: 16 / 9;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    max-width: 100%; // 컨테이너 폭 제한 시 유용
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
    min-height: 80px;
    height: 90px;
    max-height: 90px;
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
    min-height: 60px;
    height: 60px;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
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
    min-height: 60px;
    height: 60px;
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
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px; /* 111.111% */
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
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px; /* 111.111% */
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
    top: -20px;
    ${({ $isKorean }) => ($isKorean ? "right: 115px;" : "right: 14px;")}
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
