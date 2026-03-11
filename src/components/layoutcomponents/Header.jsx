import React, { useState } from "react";
import * as S from "./style";
import ProfilePopUp from "./ProfilePopUp";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <S.HeaderOuter>
        <S.HeaderInner>
          <S.TopRow>
            <S.LogoArea to="/">
              <S.LogoWrap>
                <S.LogoIcon
                  src="/assets/logos/frigogo_logo.svg"
                  alt="로고 아이콘"
                  aria-hidden
                />
                <S.LogoText>프리고고</S.LogoText>
              </S.LogoWrap>
            </S.LogoArea>

            <S.SearchArea>
              <S.SearchInput placeholder="검색어를 입력해주세요" aria-label="검색" />
              <S.SearchBtn as="button" type="submit" aria-label="검색">
                <S.SearchIcon src="/assets/icons/search.svg" alt="검색 아이콘" />
              </S.SearchBtn>
            </S.SearchArea>

            
          </S.TopRow>

          <S.BottomRow>
            <S.Nav>
              <S.NavItem to="/myfridge">나의 냉장고</S.NavItem>
              <S.NavItem to="/foodrecommendation">추천 요리</S.NavItem>
              <S.NavItem to="/communitymain">커뮤니티</S.NavItem>
              <S.NavItem to="/levelandbadge">레벨&뱃지</S.NavItem>
              <S.NavItem to="/reportandchallenge">리포트&챌린지</S.NavItem>
            </S.Nav>

            <S.RightArea>
              <S.RightLink to="/login">
                <S.RightIcon
                  src="/assets/icons/login.svg"
                  alt="로그인 아이콘"
                  aria-hidden
                />
                <S.RightText>로그인</S.RightText>
              </S.RightLink>

              <S.ProfileButton
                type="button"
                onClick={() => setIsSidebarOpen(true)}
              >
                <S.RightIcon 
                  src="/assets/icons/profile.svg"
                  aria-hidden 
                />
                <S.RightText>프로필</S.RightText>
              </S.ProfileButton>
              <ProfilePopUp
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
            </S.RightArea>
          </S.BottomRow>
        </S.HeaderInner>
      </S.HeaderOuter>
    </>
  );
};

export default Header;
