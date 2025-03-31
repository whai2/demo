import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

import ImagePopUp from "./ImagePopUp";

import { ReactComponent as CopyIcon } from "../assets/copy.svg";
import { ReactComponent as CopyCompleteIcon } from "../assets/copyComplete.svg";

import styled from "styled-components";

type Props = {
  language?: string;
  children: React.ReactNode;
};

function CodeBlock({ language, children }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const [isImagePopUpOpen, setIsImagePopUpOpen] = useState(false);

  const handleCopy = (children: React.ReactNode) => {
    if (!children) return;

    navigator.clipboard.writeText(children.toString());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <CodeBlockImagePopUp
      isImagePopUpOpen={isImagePopUpOpen}
      setIsImagePopUpOpen={setIsImagePopUpOpen}
    >
      <S.Container $isImagePopUpOpen={isImagePopUpOpen}>
        <S.Header>
          {language && <S.LanguageBadge>{language}</S.LanguageBadge>}
          {isCopied ? (
            <S.CopyButton>
              <S.DefaultIcon as={CopyCompleteIcon} $disabled={false} />
              복사됨
            </S.CopyButton>
          ) : (
            <S.CopyButton
              onClick={(event) => {
                event.stopPropagation();
                handleCopy(children);
              }}
            >
              <S.DefaultIcon as={CopyIcon} $disabled={false} />
              복사
            </S.CopyButton>
          )}
        </S.Header>

        <SyntaxHighlighter
          style={oneLight}
          language={language}
          PreTag="div"
          customStyle={{ padding: "10px", margin: 0, fontSize: "14px" }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </S.Container>
    </CodeBlockImagePopUp>
  );
}

export default CodeBlock;

function CodeBlockImagePopUp({
  children,
  isImagePopUpOpen,
  setIsImagePopUpOpen,
}: {
  children: React.ReactNode;
  isImagePopUpOpen: boolean;
  setIsImagePopUpOpen: (isImagePopUpOpen: boolean) => void;
}) {
  return (
    <>
      {isImagePopUpOpen && (
        <ImagePopUp onClose={() => setIsImagePopUpOpen(false)}>
          {children}
        </ImagePopUp>
      )}

      <S.CodeBlockImagePopUp onClick={() => setIsImagePopUpOpen(true)}>
        {children}
      </S.CodeBlockImagePopUp>
    </>
  );
}

const S = {
  CodeBlockImagePopUp: styled.div`
    position: relative;
    cursor: pointer;
  `,

  Container: styled.div<{ $isImagePopUpOpen: boolean }>`
    position: relative;
    background-color: rgb(250, 250, 250);
    border-radius: 8px;
    padding: 8px;

    &:hover {
      background-color: ${({ $isImagePopUpOpen }) =>
        $isImagePopUpOpen ? "rgb(250, 250, 250)" : "#e7e8e9"};
    }
  `,

  Header: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 4px;
  `,

  LanguageBadge: styled.div`
    color: #4a5568;
    padding: 2px 6px;
    font-size: 12px;
    border-radius: 4px;
    z-index: 10;
    font-family: Pretendard;
  `,

  CopyButton: styled.button`
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;

    // background-color: #4a5568;
    color: #4a5568;

    padding: 2px 6px;
    font-size: 12px;
    // border-radius: 4px;
    border: none;
    font-family: Pretendard;
  `,

  DefaultIcon: styled.svg<{ $disabled: boolean }>`
    display: flex;
    width: 12px;
    height: 12px;
    margin-bottom: 4px;
    cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
    color: #4a5568;
  `,
};
