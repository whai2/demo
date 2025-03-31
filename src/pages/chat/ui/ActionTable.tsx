import { useState } from "react";

import ImagePopUp from "./ImagePopUp";

import styled from "styled-components";

function ActionTable({ children }: { children: React.ReactNode }) {
  const [isImagePopUpOpen, setIsImagePopUpOpen] = useState(false);

  return (
    <>
      {isImagePopUpOpen && (
        <ImagePopUp onClose={() => setIsImagePopUpOpen(false)}>
          {children}
        </ImagePopUp>
      )}

      <S.TableContainer onClick={() => setIsImagePopUpOpen(true)}>
        {children}
      </S.TableContainer>
    </>
  );
}

export default ActionTable;

const S = {
  TableContainer: styled.div`
    width: 100%;
    overflow-x: auto;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: border-color 0.2s ease-in-out;
    padding: 8px;
    border-radius: 8px;
    background-color: rgb(250, 250, 250);

    &:hover {
      background-color: #e7e8e9;
    }
  `,
};
