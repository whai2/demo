import { useEffect, useState } from "react";

import { TransparentBackDrop } from "@/shared/ui";
import LanguageToggle from "./LanguageToggle";
import LoginModal from "./LoginModal";

import { usePopUpOpen } from "@/features/popUpOpen";
import { useUserInfo } from "@/features/userInfo";

import { ReactComponent as CoxwaveLogo } from "@/shared/assets/coxwave.svg";
import { ReactComponent as Arrow } from "../assets/arrow.svg";

import styled from "styled-components";

const DemoCourse = {
  title: "경영지도사 2차 인사관리",
  description: "국가공인 경영지도사 2차 인사관리 과정",
  category: "경영지도사",
};

function LoginPage() {
  const { setOpen, setFirstModalOpen } = usePopUpOpen();
  const [isCourseCategoryOpen, setIsCourseCategoryOpen] = useState(false);

  const {
    name,
    courseCategory,
    courseName,
    currentLanguage,
    setName,
    setCourseCategory,
    setCourseName,
    setIsLogin,
    setCurrentLanguage,
  } = useUserInfo();

  const toggleCourseCategoryOpen = () => {
    setIsCourseCategoryOpen(!isCourseCategoryOpen);
  };

  // 클릭 이벤트
  const handleCourseCategoryClick = (courseCategory: string) => {
    setCourseCategory(courseCategory);
    setIsCourseCategoryOpen(false);
    setCourseName("");
  };

  const handleLanguageClick = (language: string) => {
    setCurrentLanguage(language);
  };

  const isLoginActive =
    name !== "" &&
    courseCategory !== "" &&
    courseName !== "" &&
    currentLanguage !== "";

  const handleLogin = () => {
    if (!isLoginActive) return;

    setIsLogin(true);
    setOpen();
    setFirstModalOpen();
  };

  useEffect(() => {
    if (currentLanguage === "") {
      setCurrentLanguage("한국어");
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (courseCategory) {
      setCourseName(DemoCourse.title);
    }
  }, [courseCategory]);

  return (
    <S.LoginLayout>
      <LoginModal />
      <LanguageToggle
        isOn={currentLanguage === "English"}
        onToggle={() => {
          if (currentLanguage === "English") {
            handleLanguageClick("한국어");
          } else {
            handleLanguageClick("English");
          }
        }}
        label={
          currentLanguage === "한국어" || currentLanguage === ""
            ? "한글"
            : "English"
        }
        notLabel={currentLanguage === "English" ? "한글" : "English"}
      />

      {isCourseCategoryOpen && (
        <TransparentBackDrop
          onClose={() => {
            setIsCourseCategoryOpen(false);
          }}
          transparent={true}
        />
      )}
      <S.Header>
        <S.HeaderTitle>
          <CoxwaveLogo />
        </S.HeaderTitle>
        <S.HeaderSubTitle>
          {currentLanguage === "한국어"
            ? "정보를 입력해주세요"
            : "Please enter your information"}
        </S.HeaderSubTitle>
      </S.Header>

      <S.Container>
        <S.Wrapper>
          <S.Title>{currentLanguage === "한국어" ? "이름" : "Name"}</S.Title>
          <S.Input
            placeholder={
              currentLanguage === "한국어"
                ? "이름을 입력해 주세요."
                : "Please enter your name"
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </S.Wrapper>

        <S.Wrapper>
          <S.Title>
            {currentLanguage === "한국어" ? "강의 카테고리" : "Course Category"}
          </S.Title>

          <S.InputContainer $isOpen={isCourseCategoryOpen}>
            <S.InputWrapper onClick={toggleCourseCategoryOpen}>
              <S.InnerInput>
                <S.InnerInputText>
                  {courseCategory
                    ? courseCategory
                    : currentLanguage === "한국어"
                    ? "선택"
                    : "Select"}
                </S.InnerInputText>
              </S.InnerInput>
              <S.ChevronDown $isOpen={isCourseCategoryOpen} />
            </S.InputWrapper>

            <S.JobList $isOpen={isCourseCategoryOpen}>
              {[DemoCourse.category].map((courseCategory) => (
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
          <S.Title>
            {currentLanguage === "한국어" ? "강의명" : "Course Title"}
          </S.Title>

          <S.InputContainer $isOpen={false}>
            <S.InputWrapper>
              <S.InnerInput>
                <S.InnerInputText>
                  {courseName
                    ? courseName
                    : currentLanguage === "한국어"
                    ? "강의 카테고리를 선택하세요."
                    : "Please select your course category"}
                </S.InnerInputText>
              </S.InnerInput>
            </S.InputWrapper>
          </S.InputContainer>
        </S.Wrapper>
      </S.Container>

      <S.Button $isActive={isLoginActive} onClick={handleLogin}>
        {currentLanguage === "한국어" ? "확인" : "Confirm"}
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
    outline: #0d196d;
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

    white-space: nowrap;
    overflow: auto;
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
    z-index: ${(props) => (props.$isOpen ? "1003" : "-1")};
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
