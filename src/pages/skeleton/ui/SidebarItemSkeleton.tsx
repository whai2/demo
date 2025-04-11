import styled from "styled-components";

function SidebarItemSkeleton() {
  return (
    <S.Container>
      <S.TitleContainer>
        <S.Title />
        <S.SubTitle />
      </S.TitleContainer>
    </S.Container>
  );
}

export default SidebarItemSkeleton;

const S = {
  Container: styled.div`
    display: flex;
    border-radius: 4px;
    background: #fff;
    width: 343px;
    height: 112px;
    padding: 16px 24px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  `,

  TitleContainer: styled.div`
    display: flex;
    height: 80px;
    padding: 0px 82px 36.25px 0px;
    flex-direction: column;
    align-items: flex-start;
    gap: 14.875px;
    flex: 1 0 0;
  `,

  Title: styled.div`
    width: 213px;
    height: 13.125px;
    flex-shrink: 0;
    border-radius: 18.75px;
    background: #e6e6e6;
  `,

  SubTitle: styled.div`
    width: 187px;
    height: 15.75px;
    flex-shrink: 0;
    border-radius: 22.5px;
    background: #e6e6e6;
  `,
};
