import React from "react";
import ReactDOM from "react-dom";
import * as S from "./style";

const ChangeInfoFrame = ({ children, onClose }) => {
  // 모달을 담을 공간을 최상단 body에 생성합니다.
  return ReactDOM.createPortal(
    <S.ForChangeBackdrop>
      <S.ForChangeModalContent onClick={(e) => e.stopPropagation()}>
        <S.ForChangeCloseButton onClick={onClose}>
          &times;
        </S.ForChangeCloseButton>
        {children}
      </S.ForChangeModalContent>
    </S.ForChangeBackdrop>,
    document.body // DOM의 최상단에 렌더링되도록 강제함
  );
};

export default ChangeInfoFrame;
