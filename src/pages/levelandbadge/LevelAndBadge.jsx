import React, { useState, useEffect } from "react";
import * as S from "./style";
import ToChallengeComponent from "../../components/levelbadgecomponents/ToChallengeComponent";
import MyLevelComponent1 from "../../components/levelbadgecomponents/MyLevelComponent1";
import MyBadges from "../../components/levelbadgecomponents/MyBadges";
import { API_BASE_URL } from "../../config/api";

const LevelAndBadge = () => {
  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState([]);

  // public 폴더의 기본 경로 참조
  const publicUrl = process.env.PUBLIC_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 내 프로필 정보 조회
        const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (userRes.ok) {
          const resData = await userRes.json();
          console.log("🔥 [로그인 유저 정보 조회 성공]:", resData);
          setUserData(resData.data || resData);
        } else {
          console.error("❌ 로그인 유저 정보 조회 실패 (HTTP 상태):", userRes.status);
        }

        // 2. 뱃지 목록 조회
        const badgeRes = await fetch(`${API_BASE_URL}/badges/me`, {
          method: "GET",
          credentials: "include",
        });

        if (badgeRes.ok) {
          const badgeData = await badgeRes.json();
          setBadges(badgeData.data || badgeData);
        }
      } catch (error) {
        console.error("❌ 내 정보 요청 에러:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <S.LevelAndBadgeScreen>
      <S.BannerWraper>
        {/* public 폴더 내 이미지 경로는 process.env.PUBLIC_URL을 사용합니다. */}
        <S.BaseImage
          src={`${publicUrl}/assets/images/levelandbadge/levelpage_main_img.png`}
          alt="레벨&뱃지 배너"
        />
        <S.OverlayImg
          src={`${publicUrl}/assets/images/levelandbadge/crown.png`}
          alt="배너 왕관"
          $top={100}
          $left={200}
          $zIndex={2}
        />
        <S.OverlayImg
          src={`${publicUrl}/assets/images/levelandbadge/trophy.png`}
          alt="배너 트로피"
          $top={60}
          $left={1420}
          $zIndex={2}
        />
        <S.OverlayImg
          src={`${publicUrl}/assets/images/levelandbadge/left_confetti.png`}
          alt="배너 좌측"
          $top={0}
          $left={120}
          $zIndex={1}
        />
        <S.OverlayImg
          src={`${publicUrl}/assets/images/levelandbadge/right_confetti.png`}
          alt="배너 우측"
          $top={0}
          $left={1200}
          $zIndex={1}
        />
        <ToChallengeComponent />
      </S.BannerWraper>

      <MyLevelComponent1 userData={userData} />

      <MyBadges badges={badges} />
    </S.LevelAndBadgeScreen>
  );
};

export default LevelAndBadge;