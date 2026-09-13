import React, { useState } from "react";
import * as S from "./style";
import { useNavigate } from "react-router-dom";
import LoginRequiredModal from "../layoutcomponents/loginrequiremodal/LoginRequireModal";

const MyRecipeEmpty = ({
  title = "저장한 레시피가 없습니다.",
  desc = "마음에 드는 요리를 저장해보세요!",
  showCta = true,
  isLoggedIn = false,
}) => {
  const navigate = useNavigate();
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleGoExplore = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate("/foodrecommendation");
  };

  const handleConfirmLogin = () => {
    setOpenLoginModal(false);
    navigate("/login"); // 로그인 페이지 경로로 수정
  };

  return (
    <>
      <S.MyRecipeEmptyWrapper>
        <S.MyRecipeEmptyImage
          src={`${process.env.PUBLIC_URL}/assets/images/myrecipe_empty_img.svg`}
          alt="저장한 레시피 없음"
        />
        <S.MyRecipeEmptyTitle>{title}</S.MyRecipeEmptyTitle>
        {desc && <S.MyRecipeEmptyDesc>{desc}</S.MyRecipeEmptyDesc>}

        {showCta && (
          <S.MyRecipeEmptyButton onClick={handleGoExplore}>
            {isLoggedIn ? "레시피 살펴보기" : "로그인 하러가기"}
          </S.MyRecipeEmptyButton>
        )}
      </S.MyRecipeEmptyWrapper>

      <LoginRequiredModal
        open={openLoginModal}
        title="로그인 후 이용하실 수 있습니다."
        desc="해당 기능은 로그인한 사용자만 사용할 수 있습니다."
        confirmText="로그인하기"
        cancelText="닫기"
        onConfirm={handleConfirmLogin}
        onClose={() => setOpenLoginModal(false)}
      />
    </>
  );
};

export default MyRecipeEmpty;
