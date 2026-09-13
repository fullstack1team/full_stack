import React, { useState } from "react";
import * as S from "../../pages/levelandbadge/style"; // 스타일 경로 확인

const BadgeItem = ({ badge }) => {
  const [isHovered, setIsHovered] = useState(false);
  const publicUrl = process.env.PUBLIC_URL;

  // 1. 백엔드 데이터(badgeName, isUnlocked 등)와 기존 프론트 데이터(badgename 등) 모두 호환
  const badgeName = badge.badgeName || badge.badgename || "뱃지";
  const rewardXp = badge.badgeRewardXp ?? badge.bedgeExp ?? 30;
  const isUnlocked = badge.isUnlocked ?? false;

  // 2. 이미지 경로 (publicUrl 적용 및 .png 확장자 중복 방지)
  const getBadgeImagePath = (url) => {
    if (!url) return `${publicUrl}/assets/images/circle_lock.png`;
    if (url.startsWith("http")) return url; // 외부 URL인 경우
    if (url.startsWith("/")) return `${publicUrl}${url}`; // 이미 /로 시작하는 absolute path
    // 백엔드에서 전달된 url에 확장자가 없다면 .svg를 붙여줍니다.
    const svgFilename = url.endsWith(".svg") ? url : `${url.replace(/\.png$/, "")}.svg`;
    return `${publicUrl}/assets/images/badges/${svgFilename}`;
  };

  const badgeImage = isUnlocked
    ? getBadgeImagePath(badge.badgeImageUrl || "default")
    : badge.badgeiconUrl
    ? `${publicUrl}${badge.badgeiconUrl.replace(/^\/public/, "")}`
    : `${publicUrl}/assets/images/circle_lock.png`;

  const lockRibbon = isUnlocked
    ? `${publicUrl}/assets/images/badge_unlock.png`
    : badge.badgeLock
    ? `${publicUrl}${badge.badgeLock.replace(/^\/public/, "")}`
    : `${publicUrl}/assets/images/badge_lock.png`;

  const description = isUnlocked
    ? badge.unlockedDescription || badge.description || "해금된 뱃지입니다."
    : badge.lockedDescription || badge.description || "잠긴 뱃지입니다.";

  // 3. 날짜 포맷
  const formattedDate = badge.achievedAt
    ? new Date(badge.achievedAt).toLocaleDateString("ko-KR").replace(/ /g, "")
    : badge.getBadgeAt || null;

  return (
    <S.BadgeDiv
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <S.BadgeImg src={badgeImage} alt={badgeName} />
      <S.BadgeLockImg src={lockRibbon} alt="뱃지 상태" $isUnlocked={isUnlocked} />
      <S.BadgeName>{badgeName}</S.BadgeName>
      <S.BadgeExp>+{rewardXp}XP</S.BadgeExp>

      {isHovered && (
        <S.TooltipBox>
          <S.TooltipIconBox>
            <S.BadgeImg src={badgeImage} alt={badgeName} />
          </S.TooltipIconBox>
          <S.TooltipName>{badgeName}</S.TooltipName>
          <S.TooltipDecription>{description}</S.TooltipDecription>
          <S.GetBadgeAt>
            <img src={`${publicUrl}/assets/images/badge_hover_bookmark.png`} alt="" />
            {isUnlocked ? `${formattedDate} 해금 됨` : "미해금 뱃지"}
          </S.GetBadgeAt>
        </S.TooltipBox>
      )}
    </S.BadgeDiv>
  );
};

const BadgeList = ({ badges = [] }) => {
  const publicUrl = process.env.PUBLIC_URL;

  // 백엔드 API에서 데이터(badges)가 안 넘어왔거나 빈 배열일 경우 사용할 기본 더미 생성
  const defaultBadges = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    badgeiconUrl: `/assets/images/circle_lock.png`,
    badgeLock: `/assets/images/badge_lock.png`,
    badgename: `요리사 뱃지${i + 1}`,
    bedgeExp: 30,
    description: `이 뱃지는 현재 잠겨있습니다.\n어떻게 얻을 수 있을까요?`,
    isUnlocked: false,
  }));

  // API 데이터가 있으면 백엔드 데이터 사용, 없으면 defaultBadges 출력
  const displayBadges = badges.length > 0 ? badges : defaultBadges;

  return (
    <S.BadgeContainer>
      {displayBadges.map((badge) => (
        <BadgeItem key={badge.id} badge={badge} />
      ))}
    </S.BadgeContainer>
  );
};

export default BadgeList;