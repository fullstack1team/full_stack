import React, { useState, useEffect } from "react";
import * as S from "./style";
import ProfilePopUp from "./ProfilePopUp";
// import useAuthStore from "../../store/useAuthStore";
import useAuthStore from "../../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const Header = ({ onSearch }) => {
  const { isAuthenticated, setIsAuthenticated, setMember } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isError, setIsError] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false); // 검색 시도여부

  // 💡 [핵심 추가] 컴포넌트 마운트 시 (소셜로그인 리다이렉트 포함) 백엔드 쿠키 검증 및 유저정보 조회
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 👈 백엔드가 보낸 httpOnly 쿠키를 전송하기 위해 필수!
        });

        if (response.ok) {
          const result = await response.json();
          // 백엔드 ApiResponse 구조: { message: "...", data: foundMember }
          if (result.data) {
            setIsAuthenticated(true);
            setMember(result.data); // Zustand 스토어에 회원 정보 저장
          }
        } else {
          // 쿠키가 없거나 만료되었을 때
          setIsAuthenticated(false);
          setMember(null);
        }
      } catch (error) {
        console.error("인증 상태 확인 실패:", error);
        setIsAuthenticated(false);
        setMember(null);
      }
    };

    checkAuthStatus();
  }, [setIsAuthenticated, setMember]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      // 상태 초기화
      setIsAuthenticated(false);
      setMember(null);
      alert("로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTriedSubmit(true);

    const searchKeyword = keyword.trim();

    //  빈 검색어 아닐시
    if (!searchKeyword) {
      setIsError(true); // 흔들림 다시 트리거용(같은 에러 연속 입력 대응)
      setTimeout(() => setIsError(false), 400);
      return;
    }

    setIsError(false);
    onSearch?.({ keyword: searchKeyword });
  };

  const showError = triedSubmit && isError;

  return (
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
            <S.MainSearchWrap onSubmit={handleSubmit} $error={showError}>
              <S.SearchInput
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  if (triedSubmit) setIsError(false);
                }}
                placeholder="검색어를 입력해주세요"
                aria-label="검색"
              />
              <S.SearchBtn type="submit" aria-label="검색">
                <S.SearchIcon
                  src="/assets/icons/Search.svg"
                  alt="검색 아이콘"
                />
              </S.SearchBtn>
            </S.MainSearchWrap>
          </S.SearchArea>
        </S.TopRow>

        <S.BottomRow>
          <S.Nav>
            <S.NavItem
              to="/myfridge"
              onClick={(e) => {
                if (location.pathname === "/myfridge") {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            >
              나의 냉장고
            </S.NavItem>
            <S.NavItem
              to="/foodrecommendation"
              onClick={(e) => {
                if (location.pathname === "/foodrecommendation") {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            >
              추천 요리
            </S.NavItem>
            <S.NavItem
              to="/community"
              onClick={(e) => {
                if (location.pathname === "/community") {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            >
              커뮤니티
            </S.NavItem>
            <S.NavItem
              to="/levelandbadge"
              onClick={(e) => {
                if (location.pathname === "/levelandbadge") {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            >
              레벨&뱃지
            </S.NavItem>
            <S.NavItem
              to="/reportandchallenge"
              onClick={(e) => {
                if (location.pathname === "/reportandchallenge") {
                  e.preventDefault();
                  window.location.reload();
                }
              }}
            >
              리포트&챌린지
            </S.NavItem>
          </S.Nav>

          <S.RightArea>
            {isAuthenticated ? (
              // 로그인 상태일 때 -> 로그아웃 버튼
              <S.ProfileButton type="button" onClick={handleLogout}>
                <S.RightIcon
                  src="/assets/icons/login.svg"
                  alt="로그아웃 아이콘"
                  aria-hidden
                />
                <S.RightText>로그아웃</S.RightText>
              </S.ProfileButton>
            ) : (
              // 비로그인 상태일 때 -> 로그인 버튼
              <S.ProfileButton
                type="button"
                onClick={() => {
                  console.log("로그인 버튼 클릭");
                  navigate("/login");
                  // window.location.href = "/login";
                }}
              >
                <S.RightIcon
                  src="/assets/icons/login.svg"
                  alt="로그인 아이콘"
                  aria-hidden
                />
                <S.RightText>로그인</S.RightText>
              </S.ProfileButton>
            )}

            <S.ProfileButton
              type="button"
              onClick={() => setIsSidebarOpen(true)}
            >
              <S.RightIcon
                src="/assets/icons/profile.svg"
                alt="프로필 아이콘"
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
  );
};

export default Header;
