import { useState } from "react";

import { useUserInfo } from "@/features/userInfo";

import { ReactComponent as ChevronDown } from "../assets/chevronDown.svg";
import { ReactComponent as LinkIcon } from "../assets/link.svg";
import { ReactComponent as Rectangle } from "../assets/rectangle.svg";

import styled from "styled-components";

function ReferenceToggle({ reference }: { reference: any }) {
  const { courseName } = useUserInfo();

  if (!reference) return null;

  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <S.Container $isOpen={isOpen}>
      <S.TitleContainer onClick={toggleOpen}>
        <S.Text>답변 참고 자료</S.Text>
        <S.ChevronDown $isOpen={isOpen} />
      </S.TitleContainer>
      <S.ReferenceList $isOpen={isOpen}>
        <ReferenceItem
          pages={reference.pages}
          title={reference.title}
          file={reference.file}
        />
        <ReferenceItem title={courseName} time={reference.time} />
      </S.ReferenceList>
    </S.Container>
  );
}

export default ReferenceToggle;

function ReferenceItem({
  pages,
  title,
  file,
  time,
}: {
  pages?: string;
  title: string;
  file?: string;
  time?: string;
}) {
  return (
    <S.ReferenceItem>
      <S.LinkIcon />
      <S.ReferenceTextContainer>
        <S.ReferenceTextWrapper>
          {time && <S.ReferenceHeader>강의클립 </S.ReferenceHeader>}
          {pages && file && <S.ReferenceHeader>강의자료 </S.ReferenceHeader>}
          <S.ReferenceTitle>{title}</S.ReferenceTitle>
        </S.ReferenceTextWrapper>
        <S.RectangleContainer>
          {file && (
            <>
              <Rectangle />
              <S.RectangleText>
                {file} ({pages})
              </S.RectangleText>
            </>
          )}
        </S.RectangleContainer>
        {time && (
          <S.RectangleContainer>
            <Rectangle />
            <S.RectangleText>{time}</S.RectangleText>
          </S.RectangleContainer>
        )}
      </S.ReferenceTextContainer>
    </S.ReferenceItem>
  );
}

const S = {
  Container: styled.button<{ $isOpen: boolean }>`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
    border-radius: 8px;
    background: #fff;
    border: none;
    transition: height 0.3s ease;
    height: ${(props) => (props.$isOpen ? "auto" : "40px")};
    padding-inline: 0;
  `,

  TitleContainer: styled.div`
    display: flex;
    width: 100%;
    padding: 8px;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-radius: 8px;
    background: var(--Miscellaneous-_Kit-Section-Fill, #f5f5f5);
    cursor: pointer;
  `,

  Wrapper: styled.div`
    position: absolute;
    overflow: hidden;
  `,

  Text: styled.div`
    color: var(--Semantic-Color-Fill-fill-secondary, #6c6d6f);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  `,

  ChevronDown: styled(ChevronDown)<{ $isOpen: boolean }>`
    transition: transform 0.3s ease;
    transform: ${(props) =>
      props.$isOpen ? "rotate(180deg)" : "rotate(0deg)"};
    cursor: pointer;
  `,

  ReferenceList: styled.div<{ $isOpen: boolean }>`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    opacity: ${(props) => (props.$isOpen ? 1 : 0)};
    transform: ${(props) =>
      props.$isOpen ? "translateY(0)" : "translateY(-10px)"};
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: ${(props) => (props.$isOpen ? "auto" : -1)};
  `,

  ReferenceItem: styled.div`
    display: flex;
    width: 100%;
    padding: 10px;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    border-radius: 8px;
    background: var(--Miscellaneous-_Kit-Section-Fill, #f5f5f5);
  `,

  LinkIcon: styled(LinkIcon)`
    width: 17px;
    height: 12px;
  `,

  ReferenceTextContainer: styled.div`
    display: flex;
    width: 175px;
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    flex-shrink: 0;
  `,

  ReferenceTextWrapper: styled.div`
    color: #000;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
    align-self: stretch;
    text-align: left;
  `,

  ReferenceHeader: styled.span`
    color: #000;
    font-weight: 700;
  `,

  ReferenceTitle: styled.span`
    color: #000;
    font-weight: 400;
  `,

  RectangleContainer: styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    padding-left: 10px;
  `,

  RectangleText: styled.div`
    color: var(--Semantic-Color-Fill-fill-secondary, #6c6d6f);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    align-items: flex-start;
    text-align: left;

    word-wrap: break-word;
    word-break: break-all;
    overflow-wrap: break-word;
  `,
};
