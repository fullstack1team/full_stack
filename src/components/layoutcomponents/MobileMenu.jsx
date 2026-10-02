import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const menuItems = [
    {
      title: "나의 냉장고",
      description: "지금 있는 재료로 요리 찾기",
      icon: "/assets/icons/fridge-active.png",
      path: "/myfridge",
    },
    {
      title: "추천요리",
      description: "AI가 추천하는 맞춤 레시피",
      icon: "/assets/icons/recipe-active.png",
      path: "/foodrecommendation",
    },
    {
      title: "커뮤니티",
      description: "함께 나누는 요리 이야기",
      icon: "/assets/icons/community-active.png",
      path: "/community",
    },
    {
      title: "레벨 & 뱃지",
      description: "요리하고 성장하는 재미",
      icon: "/assets/icons/badge-active.png",
      path: "/levelandbadge",
    },
    {
      title: "리포트 & 챌린지",
      description: "나의 요리 기록과 목표",
      icon: "/assets/icons/stats-active.png",
      path: "/reportandchallenge",
    },
  ];

  const handleMove = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <S.MobileMenuOverlay>
      <S.MobileMenuHeader>
        <S.MobileMenuTitle>전체 메뉴</S.MobileMenuTitle>

        <S.MobileMenuClose type="button" onClick={onClose}>
          ×
        </S.MobileMenuClose>
      </S.MobileMenuHeader>

      <S.MobileMenuList>
        {menuItems.map((item) => (
          <S.MobileMenuItem
            key={item.path}
            type="button"
            onClick={() => handleMove(item.path)}
          >
            <S.MobileMenuIconWrap>
              <S.MobileMenuIcon src={item.icon} alt="" />
            </S.MobileMenuIconWrap>

            <S.MobileMenuText>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </S.MobileMenuText>

            <S.MobileMenuArrow>›</S.MobileMenuArrow>
          </S.MobileMenuItem>
        ))}
      </S.MobileMenuList>
    </S.MobileMenuOverlay>
  );
};

export default MobileMenu;