import React, { useEffect } from "react";
import * as S from "./style";

const SavedRecipeModal = ({ open, onConfirm, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <S.Backdrop onClick={onClose}>
      <S.Modal
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="레시피 저장 완료"
      >
        <S.IconWrapper aria-hidden="true">✓</S.IconWrapper>

        <S.Title>레시피가 저장되었습니다!</S.Title>

        <S.Desc>마이레시피에서 저장한 레시피를 확인할 수 있어요.</S.Desc>

        <S.Divider />

        <S.ButtonRow>
          <S.CancelButton onClick={onClose}>계속 보기</S.CancelButton>

          <S.ConfirmButton onClick={onConfirm}>
            저장한 레시피 보기
          </S.ConfirmButton>
        </S.ButtonRow>
      </S.Modal>
    </S.Backdrop>
  );
};

export default SavedRecipeModal;
