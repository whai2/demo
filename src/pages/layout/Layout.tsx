import { Fragment, PropsWithChildren, useEffect, useRef } from "react";

import { TransparentBackDrop, useBottomSheetPortal } from "@/shared/ui";
import { Input } from "@/widgets/input";
import { TopBar } from "@/widgets/topBar";

import { courses } from "@/features/chat";
import { usePopUpOpen } from "@/features/popUpOpen";
import { useUserInfo } from "@/features/userInfo";

import modalImage from "./assets/modalImage.png";

import styled from "styled-components";

function ChatPopUpLayout({ children }: PropsWithChildren) {
  const bottomSheetPortalRef = useRef<HTMLDivElement>(null);
  const { setPortalElement } = useBottomSheetPortal();
  const { courseCategory, courseName } = useUserInfo();
  const { isFristModalOpen, setFirstModalClose } = usePopUpOpen();

  const currentCourses = courses.category.find(
    (cat) => cat.name === courseCategory
  );

  const course = currentCourses?.courses.find(
    (course) => course.name === courseName
  );

  useEffect(() => {
    if (bottomSheetPortalRef.current) {
      setPortalElement(bottomSheetPortalRef.current);
    }
  }, [bottomSheetPortalRef.current]);

  return (
    <S.ChatLayout $isOpen={true} $isFirstOpen={true}>
      <S.ChatContainer>
        <TopBar />
        <S.ChatBodyContainer>
          {isFristModalOpen && (
            <S.ModalContainer>
              <S.Image src={modalImage} alt="modal" />

              <S.ModalTextContainer>
                <S.ModalCategoryAndTitle>
                  <S.ModalCategoryText>{courseCategory}</S.ModalCategoryText>
                  <S.ModalCourseNameText>
                    {courseName.split("–").map((part, index) => (
                      <Fragment key={index}>
                        {part.trim()}
                        {index === 0 && <br />}
                      </Fragment>
                    ))}
                  </S.ModalCourseNameText>
                  <S.ModalPriceText>
                    {course?.price} | {course?.duration}
                  </S.ModalPriceText>
                </S.ModalCategoryAndTitle>

                <ModalDescription description={course?.description} />

                <S.StartText>이제 강의를 시작해볼까요?</S.StartText>

                <S.Button onClick={() => setFirstModalClose()}>
                  <S.ButtonText>수강하기</S.ButtonText>
                </S.Button>
              </S.ModalTextContainer>
            </S.ModalContainer>
          )}

          {children}
        </S.ChatBodyContainer>
        <Input />
        <div ref={bottomSheetPortalRef} id="bottom-sheet-portal" />
      </S.ChatContainer>
      {isFristModalOpen && <TransparentBackDrop onClose={() => {}} />}
    </S.ChatLayout>
  );
}

export default ChatPopUpLayout;

function ModalDescription({ description }: { description: string | undefined }) {
  if (!description) return null;

  return <S.DescriptionText>{description}</S.DescriptionText>;
}

const S = {
  ChatLayout: styled.div<{ $isOpen: boolean; $isFirstOpen: boolean }>`
    position: fixed;
    top: ${({ theme }) => {
      const rawTop = theme.floatingButton?.position?.top;
      if (rawTop) {
        const numeric = parseInt(rawTop, 10);
        return isNaN(numeric) ? rawTop : `${numeric + 64}px`;
      }
      return "70px";
    }};
    right: ${({ theme }) => theme.floatingButton?.position?.right ?? "24px"};
    left: ${({ theme }) => theme.floatingButton?.position?.left ?? ""};
    bottom: ${({ theme }) => theme.floatingButton?.position?.bottom ?? ""};

    z-index: 1000;
    height: calc(100vh - 140px);
    animation: ${({ $isOpen }) =>
      $isOpen ? "fadeIn 0.4s ease forwards" : "fadeOut 0.4s ease forwards"};
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};

    @keyframes fadeIn {
      0% {
        transform: translateY(-10px);
        opacity: 0;
      }
      100% {
        transform: translateY(0); /* 10px 떠오름 */
        opacity: 1;
      }
    }

    @keyframes fadeOut {
      0% {
        transform: translateY(0); /* 10px 떠오름 */
        opacity: 1;
      }
      100% {
        transform: translateY(-10px);
        opacity: 0;
        display: none;
        visibility: hidden !important;
      }
    }
  `,

  ChatContainer: styled.div`
    display: flex;
    width: 340px;
    height: 100%;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    background: ${({ theme }) => theme.chatBody?.backgroundColor ?? "#f5f5f5"};

    box-shadow: 0px 8px 12px 6px rgba(0, 0, 0, 0.15),
      0px 4px 4px 0px rgba(0, 0, 0, 0.3);
  `,

  ChatBodyContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 0 0;
    align-self: stretch;
    background: ${({ theme }) => theme.chatBody?.backgroundColor ?? "#f5f5f5"};
    overflow-y: auto;
    height: 100%;
  `,

  EmptyChatInput: styled.div`
    width: 100%;
    height: 20px;
    border-radius: 20px;
    background: ${({ theme }) => theme.chatBody?.backgroundColor ?? "#f5f5f5"};
  `,

  ModalContainer: styled.div`
    margin: 15px;
    position: absolute;
    display: flex;
    padding: 36px;
    align-items: center;
    gap: 10px;
    border-radius: 12px;
    background: #fff;
    z-index: 1002;
    flex-direction: column;
  `,

  Image: styled.img`
    width: 100%;
    height: 100%;
    padding-bottom: 10px;
  `,

  ModalTextContainer: styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    align-self: stretch;
    width: 100%;
  `,

  ModalCategoryText: styled.span`
    align-self: stretch;
    color: #6e6e73;
    text-align: center;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    padding-bottom: 7px;
  `,

  ModalCourseNameText: styled.div`
    display: block; /* 또는 inline-block */
    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    word-break: keep-all;
    white-space: normal;
    padding-bottom: 7px;
  `,

  ModalPriceText: styled.span`
    align-self: stretch;
    color: #a1abba;
    text-align: center;
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 132%; /* 13.2px */
    letter-spacing: -0.2px;
  `,

  Button: styled.button`
    display: flex;
    padding: 4px 12px;
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

  DescriptionText: styled.div`
    align-self: stretch;
    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 15px; /* 136.364% */
  `,

  StartText: styled.div`
    align-self: stretch;
    color: #6e6e73;
    text-align: center;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 153.846% */
  `,

  ModalCategoryAndTitle: styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
    flex-direction: column;
  `,
};
