import { ReactComponent as ChatHistoryIcon } from "../assets/chatHistory.svg";
import { ReactComponent as CustomerCentorIcon } from "../assets/customerCentor.svg";
import { ReactComponent as InfoIcon } from "../assets/info.svg";

import styled from "styled-components";

function TopBar() {
  return (
    <S.Container>
      <S.TitleContainer>{/* <S.Title>AI 챗봇</S.Title> */}</S.TitleContainer>

      <S.NavContainer>
        <S.ChatHistoryIcon />
        <S.CustomerCentorIcon />
      </S.NavContainer>
    </S.Container>
  );
}

export default TopBar;

const ToolTipLayout = styled.div`
  position: absolute;
  right: -3px;
  bottom: -40px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
`;

const S = {
  Container: styled.div`
    display: flex;
    width: 100%;
    padding: 14px 20px;
    justify-content: space-between;
    align-items: center;
  `,

  TitleContainer: styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 70%;
  `,

  NavContainer: styled.div`
    display: flex;
    gap: 6px;
    height: 24px;
    align-items: center;
    justify-content: center;
  `,

  ToolTipContainer: styled.div`
    position: relative;
    display: flex;
    align-items: center;
    z-index: 1002;

    &:hover ${ToolTipLayout} {
      opacity: 1;
      visibility: visible;
    }
  `,

  StyledIcon: styled.svg<{ disabled?: boolean }>`
    width: 20px;
    height: 20px;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    color: #97999b;
    &:hover {
      color: ${({ disabled }) => (disabled ? "#97999b" : "#000")};
    }
  `,

  CloseButtonContainer: styled.div`
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  Button: styled.button<{ disabled?: boolean }>`
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    color: #97999b;
    border: none;
    &:hover {
      color: ${({ disabled }) => (disabled ? "#97999b" : "#000")};
    }
  `,

  ChatHistoryIcon: styled(ChatHistoryIcon)`
    width: 20px;
    height: 20px;
    color: #97999b;
    cursor: pointer;
  `,

  InfoIcon: styled(InfoIcon)`
    width: 20px;
    height: 20px;
    color: #97999b;
  `,

  CustomerCentorIcon: styled(CustomerCentorIcon)`
    width: 20px;
    height: 20px;
    color: #97999b;
  `,

  // BackIcon: styled(BackIcon)`
  //   width: 20px;
  //   height: 20px;
  //   color: #97999b;
  //   cursor: pointer;
  //   &:hover {
  //     color: #000;
  //   }
  // `,

  TextContainer: styled.div`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    width: 70%;
    // margin-left: 10px;
  `,

  Text: styled.span`
    color: #090909;
    text-overflow: ellipsis;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  `,
};
