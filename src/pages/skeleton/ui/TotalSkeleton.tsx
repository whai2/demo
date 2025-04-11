import SidebarItemSkeleton from "./SidebarItemSkeleton";

import { ReactComponent as Dot } from "../assets/dot.svg";

import styled from "styled-components";

function TotalSkeleton() {
  return (
    <S.Container>
      <S.Content>
        <S.TopBar>
          <S.UserInfoButton />
          <S.TopBarTitle />
          <S.TopBarCategoryWrapper>
            <S.TopBarCategory />
            <S.TopBarCategory />
          </S.TopBarCategoryWrapper>
        </S.TopBar>

        <S.VideoContainer>
          <S.Player />
        </S.VideoContainer>

        <S.BottomBar>
          <S.Tab>
            <Dot />
            <S.InnerTab />
          </S.Tab>
          <S.Tab>
            <Dot />
            <S.InnerTab />
          </S.Tab>
        </S.BottomBar>
      </S.Content>
      <S.SideBar>
        <S.SideBarHeader>
          <S.FloatingButtonText />
          <S.FloatingButton />
        </S.SideBarHeader>
        <SidebarItemSkeleton />
        <SidebarItemSkeleton />
        <SidebarItemSkeleton />
        <SidebarItemSkeleton />
        <SidebarItemSkeleton />
      </S.SideBar>
    </S.Container>
  );
}

export default TotalSkeleton;

const S = {
  Container: styled.div`
    display: flex;
    width: 100%;
    height: 100vh;
  `,

  SideBar: styled.div`
    display: flex;
    width: 391px;
    padding: 24px 24px 127px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    flex-shrink: 0;
    background: #f2f2f2;
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

  FloatingButton: styled.div`
    width: 90px;
    height: 40px;
    border-radius: 8px;
    background: #e6e6e6;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  `,

  FloatingButtonText: styled.div`
    display: flex;
    width: 57px;
    padding: 8px 0px 4px 0px;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    flex: 1 0 0;
  `,

  Content: styled.div`
    flex: 1;
    // overflow-y: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: 100vh;
  `,

  VideoContainer: styled.div`
    padding: 10px 50px;
    width: 100%;
    aspect-ratio: 16 / 9;
    max-width: 1500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  `,

  SideBarHeader: styled.div`
    display: flex;
    align-items: center;
    align-self: stretch;
    padding: 0 0 30px 0;
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
    padding: 24px 24px 24px 24px;
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

  UserInfoButton: styled.button`
    display: inline-flex;
    width: 104px;
    height: 44px;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border: none;
    border-radius: 4px;
    background: #e6e6e6;
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

  TopBarTitle: styled.div`
    width: 303px;
    height: 14px;
    flex-shrink: 0;
    border-radius: 20px;
    background: #e6e6e6;
  `,

  TopBarCategoryWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 11px;
  `,

  TopBarCategory: styled.div`
    width: 155px;
    height: 14px;
    flex-shrink: 0;
    border-radius: 20px;
    background: #e6e6e6;
  `,

  BottomBar: styled.div`
    display: flex;
    height: 64px;
    padding: 20px 70.8px 20px 68.8px;
    justify-content: center;
    align-items: center;
    gap: 8px;
  `,

  Tab: styled.button`
    display: flex;
    height: 64px;
    padding: 20px 75.8px 20px 68.8px;
    align-items: center;
    gap: 8px;
    flex: 1 0 0;
    border: none;
    background: var(--WHITE_FFFFFF_100, #fff);
  `,

  InnerTab: styled.div`
    width: 52px;
    height: 14px;
    border-radius: 20px;
    background: #e6e6e6;
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

  Player: styled.div`
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    border: 1px solid #e6e6e6;
    background: #e6e6e6;
  `,
};
