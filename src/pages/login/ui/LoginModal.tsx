import { useEffect, useRef, useState } from "react";

import { TransparentBackDrop } from "@/shared/ui";

import { useUserInfo } from "@/features/userInfo";

import styled from "styled-components";

const PASSWORD = "123456";

function LoginModal() {
  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const { currentLanguage, setIsPassPassword, isPassPassword } = useUserInfo();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleConfirm = () => {
    if (password === PASSWORD) {
      setIsPasswordCorrect(true);
      setIsPasswordWrong(false);
      setIsPassPassword(true);
    } else {
      setIsPasswordWrong(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && password.length > 0) {
      handleConfirm();
    }
  };

  if (isPasswordCorrect || isPassPassword) {
    return <></>;
  }

  return (
    <>
      <S.ModalLayout>
        <S.ModalContainer>
          <S.ModalTitleContainer>
            <S.ModalTitle>
              {currentLanguage === "English" ? "Login" : "로그인"}
            </S.ModalTitle>
            <S.Input
              ref={inputRef}
              type="password"
              placeholder={
                currentLanguage === "English"
                  ? "Enter your password"
                  : "비밀번호를 입력해주세요."
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (isPasswordWrong) setIsPasswordWrong(false);
              }}
              onKeyDown={handleKeyDown}
              $isWrong={isPasswordWrong}
            />
            {isPasswordWrong && (
              <S.ErrorMessage>
                {currentLanguage === "English"
                  ? "Incorrect password. Please try again."
                  : "비밀번호가 틀렸습니다."}
              </S.ErrorMessage>
            )}
          </S.ModalTitleContainer>

          <S.Button
            $isActive={password.length > 0}
            onClick={password.length > 0 ? handleConfirm : undefined}
          >
            <S.ButtonText>
              {currentLanguage === "English" ? "Confirm" : "확인"}
            </S.ButtonText>
          </S.Button>
        </S.ModalContainer>
      </S.ModalLayout>
      <TransparentBackDrop onClose={() => {}} isHighest={true} />
    </>
  );
}

export default LoginModal;

const S = {
  ModalLayout: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1006;
  `,

  ModalContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 371px;
    height: auto;
    padding: 24px 36px;
    align-items: center;
    justify-content: center;
    gap: 35px;
    background-color: white;
    border-radius: 10px;
  `,

  ModalTitleContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    align-self: stretch;
  `,

  ModalTitle: styled.div`
    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 36px; /* 128.571% */
  `,

  Input: styled.input<{ $isWrong: boolean }>`
    display: flex;
    padding: 14px;
    align-items: center;
    gap: 8px;
    align-self: stretch;

    border-radius: 8px;
    border: 1px solid
      ${({ $isWrong }) =>
        $isWrong ? "#FF0000" : "var(--gray-300-border, #d1d5db)"};
    outline: #0d196d;
  `,

  Button: styled.button<{ $isActive: boolean }>`
    display: flex;
    width: 159px;
    padding: 4px 12px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 4px;
    background: ${({ $isActive }) => ($isActive ? "#1a2a9c" : "#9ca3af")};
    border: none;
    cursor: ${({ $isActive }) => ($isActive ? "pointer" : "default")};
  `,

  ButtonText: styled.span`
    color: #fff;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 28px; /* 200% */
  `,

  ErrorMessage: styled.div`
    color: #ff0000;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    width: 100%;
    text-align: left;
    margin-left: 5px;
  `,
};
