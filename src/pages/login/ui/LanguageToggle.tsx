import styled from "styled-components";

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
}

const LanguageToggle = ({ isOn, onToggle, label }: ToggleProps) => {
  return (
    <S.Wrapper>
      {label && <S.Label>{label}</S.Label>}
      <S.ToggleContainer isOn={isOn} onClick={onToggle}>
        <S.ToggleCircle isOn={isOn} />
      </S.ToggleContainer>
    </S.Wrapper>
  );
};

export default LanguageToggle;

const S = {
  Wrapper: styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
  `,

  Label: styled.span`
    font-size: 14px;
    color: #333;
  `,

  ToggleContainer: styled.div<{ isOn: boolean }>`
    width: 44px;
    height: 24px;
    border-radius: 999px;
    background-color: ${({ isOn }) => (isOn ? "#1A2A9C" : "#ccc")};
    cursor: pointer;
    transition: background-color 0.3s;
    position: relative;
  `,

  ToggleCircle: styled.div<{ isOn: boolean }>`
    width: 18px;
    height: 18px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    left: ${({ isOn }) => (isOn ? "22px" : "4px")};
    transition: left 0.3s;
  `,

  ToggleLabel: styled.span`
    font-size: 12px;
    color: white;
    margin-left: auto;
    margin-right: 6px;
    z-index: 1;
  `,
};
