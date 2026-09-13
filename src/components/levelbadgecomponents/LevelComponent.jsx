import React from "react";
import * as S from "../../pages/levelandbadge/style";
import { LEVEL_SETTINGS, DEFAULT_USER_DATA, FarFromNextLevel } from "./levelFunction.js";

const LevelComponent = ({ userData }) => {
  const publicUrl = process.env.PUBLIC_URL;

  const level = userData?.memberLevel || DEFAULT_USER_DATA.level;
  const currentExp = userData?.memberXp || DEFAULT_USER_DATA.currentExp;

  const currentSettings = LEVEL_SETTINGS[level] || LEVEL_SETTINGS[1];
  const maxExp = currentSettings.maxExp;
  const label = currentSettings.label;

  const expPercentage = Math.min(Math.round((currentExp / maxExp) * 100), 100);

  // 💡 [소셜/일반 프로필 이미지 URL 처리]
  const rawProfileImg = userData?.memberProfile || userData?.memberProfileImg;
  const defaultProfileImg = `${publicUrl}/assets/images/pinggu.png`;

  const getProfileImageSrc = () => {
    if (!rawProfileImg) return defaultProfileImg;

    // 💡 카카오 등 외부 소셜 이미지 URL 처리 (http:// -> https:// 변환으로 차단 방지)
    if (rawProfileImg.startsWith("http://") || rawProfileImg.startsWith("https://")) {
      return rawProfileImg.replace("http://", "https://");
    }

    if (rawProfileImg.startsWith("blob:")) {
      return rawProfileImg;
    }

    // 상대 경로인 경우 publicUrl 결합
    return `${publicUrl}${rawProfileImg.startsWith("/") ? "" : "/"}${rawProfileImg}`;
  };

  // 레벨별 프레임 & 메달
  const getLevelAssets = (currentLevel) => {
    if (currentLevel >= 26) {
      return {
        profileFrame: `${publicUrl}/assets/images/gold_frame.png`,
        nextMedal: `${publicUrl}/assets/images/gold_medal.png`,
      };
    } else if (currentLevel >= 16) {
      return {
        profileFrame: `${publicUrl}/assets/images/silver_frame.png`,
        nextMedal: `${publicUrl}/assets/images/gold_medal.png`,
      };
    } else {
      return {
        profileFrame: `${publicUrl}/assets/images/bronze_frame.png`,
        nextMedal: `${publicUrl}/assets/images/silver_medal.png`,
      };
    }
  };

  const { profileFrame, nextMedal } = getLevelAssets(level);

  return (
    <S.MyLevelProgressWrap>
      {/* 1. 좌측 프로필 영역 */}
      <S.MyLevelProfileWrap>
        {/* 프로필 이미지 (소셜 프로필 URL 적용) */}
        <S.MyLevelProfileImg 
          src={getProfileImageSrc()} 
          alt="profile" 
          onError={(e) => {
            // 외부 이미지 로드 실패 시 fallback
            e.target.src = defaultProfileImg;
          }}
        />

        {/* 원형 테두리 프레임 */}
        <S.MyLevelProfileContainer 
          src={profileFrame} 
          alt="level frame" 
        />
      </S.MyLevelProfileWrap>

      {/* 2. 중앙 레벨 & 프로그래스 바 */}
      <S.LevelProgressContainer>
        <S.LevelInfoWrap>
          <S.LevelLabel>{label}</S.LevelLabel>
          <S.LevelCurrent>LV. {level}</S.LevelCurrent>
        </S.LevelInfoWrap>

        <S.MyLevelProgressContainer>
          <S.MyLevelProgress width={expPercentage} />
        </S.MyLevelProgressContainer>

        <S.ExpText>
          {currentExp} / {maxExp} EXP ({expPercentage}%)
        </S.ExpText>
      </S.LevelProgressContainer>

      {/* 3. 우측 메달 안내 영역 */}
      <S.MedalWrap>
        <S.LevelNextMedal 
          src={nextMedal} 
          alt="next medal" 
        />
        <S.NextMedalInfo>
          다음 메달까지 남은 레벨: <FarFromNextLevel level={level} />LV
        </S.NextMedalInfo>
      </S.MedalWrap>
    </S.MyLevelProgressWrap>
  );
};

export default LevelComponent;