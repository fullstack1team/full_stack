import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as S from "./style";

const MobileBottomNav = ({ onMenuClick, onMyClick, onCloseMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = () => {
    if (location.pathname.includes("myrecipe")) return "recipe";
    if (location.pathname === "/") return "home";

    return null;
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  useEffect(() => {
    const routeTab = getTabFromPath();

    if (routeTab) {
      setActiveTab(routeTab);
    }
  }, [location.pathname]);

  const handleHome = () => {
    setActiveTab("home");
    onCloseMenu?.();
    navigate("/");
  };

  const handleMenu = () => {
    setActiveTab("menu");
    onMenuClick?.();
  };

  const handleRecipe = () => {
    setActiveTab("recipe");
    onCloseMenu?.();
    navigate("/myrecipe");
  };

  const handleMy = () => {
    setActiveTab("my");
    onCloseMenu?.(); // 메뉴 버튼을 제외한 나머지 하단 네비를 누르면 전체메뉴부터 닫기
    onMyClick?.();
  };

  return (
    <S.MobileBottomNav>
      <S.MobileNavButton type="button" onClick={handleHome}>
        <S.MobileNavImg
          src={
            activeTab === "home"
              ? "/assets/icons/home-active.png"
              : "/assets/icons/home-default.png"
          }
          alt=""
        />
        <span className={activeTab === "home" ? "active" : ""}>홈</span>
      </S.MobileNavButton>

      <S.MobileNavButton type="button" onClick={handleMenu}>
        <S.MobileNavImg
          src={
            activeTab === "menu"
              ? "/assets/icons/menu-active.png"
              : "/assets/icons/menu-default.png"
          }
          alt=""
        />
        <span className={activeTab === "menu" ? "active" : ""}>메뉴</span>
      </S.MobileNavButton>

      <S.MobileNavButton type="button" onClick={handleRecipe}>
        <S.MobileNavImg
          src={
            activeTab === "recipe"
              ? "/assets/icons/bookmark-active.png"
              : "/assets/icons/bookmark-default.png"
          }
          alt=""
        />
        <span className={activeTab === "recipe" ? "active" : ""}>MY레시피</span>
      </S.MobileNavButton>

      <S.MobileNavButton type="button" onClick={handleMy}>
        <S.MobileNavImg
          src={
            activeTab === "my"
              ? "/assets/icons/profile-active.png"
              : "/assets/icons/profile-default.png"
          }
          alt=""
        />
        <span className={activeTab === "my" ? "active" : ""}>마이</span>
      </S.MobileNavButton>
    </S.MobileBottomNav>
  );
};

export default MobileBottomNav;
