import { ImageBackDrop } from "@/shared/ui";

import styled from "styled-components";

function IamgePopUp({
  url,
  onClose,
  children,
}: {
  url?: string;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  return (
    <>
      {url && (
        <S.ImagePopUp>
          <S.FilePopUpImage src={url} />
        </S.ImagePopUp>
      )}
      {children && <S.ChildrenPopUp>{children}</S.ChildrenPopUp>}
      <ImageBackDrop onClose={onClose} />
    </>
  );
}

export default IamgePopUp;

const S = {
  ImagePopUp: styled.div`
    display: flex;
    position: fixed;
    top: calc(80px);
    right: 360px;
    width: 700px;
    padding: 20px;
    z-index: 1002;
    background-color: #fff;
    border-radius: 16px;
  `,

  ChildrenPopUp: styled.div`
    display: flex;
    position: fixed;
    top: calc(80px);
    right: 360px;
    right: 360px;
    z-index: 1002;

    padding: 20px;
    background-color: #fff;
    border-radius: 16px;
  `,

  FilePopUpImage: styled.img`
    width: 100%;
    height: auto;
  `,
};
