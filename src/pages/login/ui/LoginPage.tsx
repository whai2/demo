import { useEffect, useState } from "react";

import { courses } from "@/features/chat";
import { usePopUpOpen } from "@/features/popUpOpen";
import { COURSE_CATEGORY, JOBS, useUserInfo, YEARS } from "@/features/userInfo";

import { ReactComponent as CoxwaveLogo } from "@/shared/assets/coxwave.svg";
import { ReactComponent as Arrow } from "../assets/arrow.svg";

import styled from "styled-components";

const LANGUAGES = ["한국어", "English"];

function LoginPage() {
  const { setOpen, setFirstModalOpen } = usePopUpOpen();
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isCourseCategoryOpen, setIsCourseCategoryOpen] = useState(false);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [courseList, setCourseList] = useState<string[]>([]);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const {
    name,
    job,
    year,
    courseCategory,
    courseName,
    currentLanguage,
    setName,
    setJob,
    setYear,
    setCourseCategory,
    setCourseName,
    setIsLogin,
    setCurrentLanguage,
  } = useUserInfo();

  useEffect(() => {
    if (courseCategory) {
      const selectedCategory = courses.category.find(
        (cat) => cat.name === courseCategory
      );

      if (selectedCategory) {
        const courseTitles = selectedCategory.courses.map(
          (course) => course.name
        );
        setCourseList(courseTitles);
      } else {
        setCourseList([]);
      }
    }
  }, [courseCategory]);

  const toggleJobOpen = () => {
    setIsJobOpen(!isJobOpen);
  };

  const toggleYearOpen = () => {
    setIsYearOpen(!isYearOpen);
  };

  const toggleCourseCategoryOpen = () => {
    setIsCourseCategoryOpen(!isCourseCategoryOpen);
  };

  const toggleCourseOpen = () => {
    setIsCourseOpen(!isCourseOpen);
  };

  const toggleLanguageOpen = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  // 클릭 이벤트
  const handleJobClick = (job: string) => {
    setJob(job);
    setIsJobOpen(false);
  };

  const handleCourseCategoryClick = (courseCategory: string) => {
    setCourseCategory(courseCategory);
    setIsCourseCategoryOpen(false);
    setCourseName("");
  };

  const handleYearClick = (year: string) => {
    setYear(year);
    setIsYearOpen(false);
  };

  const handleCourseClick = (course: string) => {
    setCourseName(course);
    setIsCourseOpen(false);
  };

  const handleLanguageClick = (language: string) => {
    setCurrentLanguage(language);
    setIsLanguageOpen(false);
  };

  const isLoginActive =
    name !== "" &&
    job !== "" &&
    year !== "" &&
    courseCategory !== "" &&
    courseName !== "" &&
    currentLanguage !== "";

  const handleLogin = () => {
    if (!isLoginActive) return;

    setIsLogin(true);
    setOpen();
    setFirstModalOpen();
  };

  return (
    <S.LoginLayout>
      <S.Header>
        <S.HeaderTitle>
          <CoxwaveLogo />
        </S.HeaderTitle>
        <S.HeaderSubTitle>정보를 입력해주세요</S.HeaderSubTitle>
      </S.Header>

      <S.Container>
        <S.Wrapper>
          <S.Title>이름</S.Title>
          <S.Input
            placeholder="이름을 입력해 주세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </S.Wrapper>

        <S.Wrapper>
          <S.Title>직무</S.Title>

          <S.InputContainer $isOpen={isJobOpen}>
            <S.InputWrapper onClick={toggleJobOpen}>
              <S.InnerInput>
                <S.InnerInputText>{job ? job : "선택"}</S.InnerInputText>
              </S.InnerInput>
              <S.ChevronDown $isOpen={isJobOpen} />
            </S.InputWrapper>

            <S.JobList $isOpen={isJobOpen}>
              {JOBS.map((job) => (
                <S.JobItem key={job} onClick={() => handleJobClick(job)}>
                  {job}
                </S.JobItem>
              ))}
            </S.JobList>
          </S.InputContainer>
        </S.Wrapper>

        <S.Wrapper>
          <S.Title>연차</S.Title>

          <S.InputContainer $isOpen={isYearOpen}>
            <S.InputWrapper onClick={toggleYearOpen}>
              <S.InnerInput>
                <S.InnerInputText>{year ? year : "선택"}</S.InnerInputText>
              </S.InnerInput>
              <S.ChevronDown $isOpen={isYearOpen} />
            </S.InputWrapper>

            <S.JobList $isOpen={isYearOpen}>
              {YEARS.map((year) => (
                <S.JobItem key={year} onClick={() => handleYearClick(year)}>
                  {year}
                </S.JobItem>
              ))}
            </S.JobList>
          </S.InputContainer>
        </S.Wrapper>

        <S.Wrapper>
          <S.Title>강의 카테고리</S.Title>

          <S.InputContainer $isOpen={isCourseCategoryOpen}>
            <S.InputWrapper onClick={toggleCourseCategoryOpen}>
              <S.InnerInput>
                <S.InnerInputText>
                  {courseCategory ? courseCategory : "선택"}
                </S.InnerInputText>
              </S.InnerInput>
              <S.ChevronDown $isOpen={isCourseCategoryOpen} />
            </S.InputWrapper>

            <S.JobList $isOpen={isCourseCategoryOpen}>
              {COURSE_CATEGORY.map((courseCategory) => (
                <S.JobItem
                  key={courseCategory}
                  onClick={() => handleCourseCategoryClick(courseCategory)}
                >
                  {courseCategory}
                </S.JobItem>
              ))}
            </S.JobList>
          </S.InputContainer>
        </S.Wrapper>

        <S.Wrapper>
          <S.Title>강의명</S.Title>

          <S.InputContainer $isOpen={isCourseOpen}>
            <S.InputWrapper onClick={toggleCourseOpen}>
              <S.InnerInput>
                <S.InnerInputText>
                  {courseName ? courseName : "선택"}
                </S.InnerInputText>
              </S.InnerInput>
              <S.ChevronDown $isOpen={isCourseOpen} />
            </S.InputWrapper>

            <S.JobList $isOpen={isCourseOpen}>
              {courseList.length === 0 ? (
                <S.JobItem>강의 카테고리를 선택하세요</S.JobItem>
              ) : (
                courseList.map((course, index) => (
                  <S.JobItem
                    key={index}
                    onClick={() => handleCourseClick(course)}
                  >
                    {course}
                  </S.JobItem>
                ))
              )}
            </S.JobList>
          </S.InputContainer>
        </S.Wrapper>
        <S.Wrapper>
          <S.Title>언어 선택</S.Title>

          <S.InputContainer $isOpen={isLanguageOpen}>
            <S.InputWrapper onClick={toggleLanguageOpen}>
              <S.InnerInput>
                <S.InnerInputText>
                  {currentLanguage ? currentLanguage : "선택"}
                </S.InnerInputText>
              </S.InnerInput>
              <S.ChevronDown $isOpen={isLanguageOpen} />
            </S.InputWrapper>

            <S.JobList $isOpen={isLanguageOpen}>
              {LANGUAGES.map((language, index) => (
                <S.JobItem
                  key={index}
                  onClick={() => handleLanguageClick(language)}
                >
                  {language}
                </S.JobItem>
              ))}
            </S.JobList>
          </S.InputContainer>
        </S.Wrapper>
      </S.Container>

      <S.Button $isActive={isLoginActive} onClick={handleLogin}>
        확인
      </S.Button>
    </S.LoginLayout>
  );
}

export default LoginPage;

const S = {
  LoginLayout: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
  `,

  Container: styled.div`
    width: 400px;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  `,

  Header: styled.div`
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4px;
  `,

  HeaderTitle: styled.div`
    color: var(--gray-900, #111827);

    /* Title/28 semibold */
    font-family: Pretendard;
    font-size: 28px;
    font-style: normal;
    font-weight: 600;
    line-height: 36px; /* 128.571% */
  `,

  HeaderSubTitle: styled.div`
    color: var(--gray-600, #4b5563);
    text-align: center;

    /* Body/16 medium */
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
  `,

  Wrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
  `,

  Title: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
  `,

  Input: styled.input`
    display: flex;
    padding: 14px;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    border-radius: 8px;
    border: 1px solid var(--gray-300-border, #d1d5db);
  `,

  Button: styled.button<{ $isActive: boolean }>`
    display: flex;
    height: 40px;
    padding: 7px 16px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    border-radius: 8px;
    background: ${({ $isActive }) => ($isActive ? "#0D196D" : "#9ca3af")};
    color: white;
    border: none;
    cursor: ${({ $isActive }) => ($isActive ? "pointer" : "default")};
  `,

  InputWrapper: styled.div`
    display: flex;
    padding: 12px;
    align-items: center;

    align-self: stretch;

    // border-radius: 8px;
    // border: 1px solid var(--gray-300-border, #d1d5db);
  `,

  InnerInput: styled.div`
    border: none;
    width: 100%;

    display: flex;
    align-items: center;
    align-self: stretch;

    cursor: pointer;
  `,

  InnerInputText: styled.div`
    color: var(--Semantic-Color-Fill-fill-tertiary, #97999b);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: var(--sds-typography-body-font-weight-regular);
    line-height: 20px; /* 142.857% */
  `,

  ChevronDown: styled(Arrow)<{ $isOpen: boolean }>`
    transition: transform 0.3s ease;
    transform: ${(props) =>
      props.$isOpen ? "rotate(180deg)" : "rotate(0deg)"};
  `,

  InputContainer: styled.div<{ $isOpen: boolean }>`
    position: relative;
    width: 100%;

    border-radius: 8px;
    border: 1px solid var(--gray-300-border, #d1d5db);

    transition: height 0.3s ease;
    // height: ${(props) => (props.$isOpen ? "auto" : "40px")};
    height: 45px;
  `,

  JobList: styled.div<{ $isOpen: boolean }>`
    display: flex;
    position: absolute;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    background-color: white;
    border-radius: 8px;
    max-height: 164px;
    overflow-y: auto;
    border: 1px solid var(--gray-300-border, #d1d5db);

    opacity: ${(props) => (props.$isOpen ? 1 : 0)};
    transform: ${(props) =>
      props.$isOpen ? "translateY(0)" : "translateY(-10px)"};
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: ${(props) => (props.$isOpen ? "1" : "-1")};
  `,

  JobItem: styled.div`
    display: flex;
    height: 40px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    align-self: stretch;

    cursor: pointer;

    border: 0.25px solid var(--Semantic-Color-Border-border-primary, #d9dadb);

    &:hover {
      background-color: #f3f4f6;
    }
  `,
};
