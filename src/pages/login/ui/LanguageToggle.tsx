import styled from "styled-components";

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
  notLabel?: string;
}

const LanguageToggle = ({ isOn, onToggle, label, notLabel }: ToggleProps) => {
  return (
    <S.Wrapper>
      <S.ToggleContainer isOn={isOn} onClick={onToggle}>
        <S.ToggleCircle isOn={isOn}>
          <S.InnerText>{label}</S.InnerText>
        </S.ToggleCircle>
        <S.OuterText isOn={isOn}>{notLabel}</S.OuterText>
      </S.ToggleContainer>
    </S.Wrapper>
  );
};

export default LanguageToggle;

const S = {
  Wrapper: styled.div`
    position: fixed;
    top: 44px;
    right: 44px;
    // width: 143px;
    // height: 40px;
    // flex-shrink: 0;
  `,

  Label: styled.span`
    font-size: 14px;
    color: #333;
  `,

  ToggleContainer: styled.div<{ isOn: boolean }>`
    width: 143px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 30px;
    background: #e7e8f0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `,

  OuterText: styled.div<{ isOn: boolean }>`
    padding-right: 12px;
    color: #333;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    cursor: pointer;
    color: #a1a3b7;

    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 28px;
    transition: transform 0.3s ease;
    transform: ${({ isOn }) => (isOn ? "translateX(-82px)" : "translateX(0)")};
  `,

  ToggleCircle: styled.div<{ isOn: boolean }>`
    display: flex;
    height: 40px;
    padding: 6px 15px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 30px;
    background: #1a2a9c;
    cursor: pointer;
    transition: transform 0.3s ease;
    transform: ${({ isOn }) => (isOn ? "translateX(70px)" : "translateX(0)")};
  `,

  InnerText: styled.span`
    color: #fff;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px; /* 175% */
  `,
};
