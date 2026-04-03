import React, { useMemo } from "react";
import * as S from "../../pages/community/style";

/**
 * PostCard
 * - 트렌딩 캐러셀 카드 / 피드 공용
 * - "내 글"은 닉네임 도트 + 카드 약한 강조로 표시
 */

// 배지 기준 상수
const NEW_DAYS = 3;
const POPULAR_DAYS = 30;
const POPULAR_TOP_N = 8;

 // ===== 날짜 파싱 헬퍼 =====
  const parseDate = (v) => {
    if (!v) return null;

    if (typeof v === "string") {
      const normalized = v.replace(/\./g, "-").replace(/\s+/g, "").slice(0, 10);
      const d1 = new Date(v);
      if (!Number.isNaN(d1.getTime())) return d1;

      const d2 = new Date(normalized);
      if (!Number.isNaN(d2.getTime())) return d2;
    }

    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  };

  //  날짜 짧게 가공 (닉네임 안 보이던 문제 해결 핵심)
  const getRelativeTime = (date) => {
  const now = new Date();
  const target = new Date(date);

  const diff = (now - target) / 1000;

  if (diff < 60) return "방금 전";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}달 전`;

  const years = Math.floor(months / 12);
  return `${years}년 전`;
};

const PostCard = ({
  item,
  w,
  onClick,
  meNickname,
  allItems = [],
  onLikeToggle,
}) => {
  const liked = item?.isLiked ?? false
  const likeCount = item?.likes ?? 0

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    onLikeToggle?.(item);
  };

  // ===== 기본 데이터 =====
  const recipeImage =
    item?.images?.[0] ?? item?.recipeImage ?? "/assets/images/oatmeal.svg";
  const profileImage = item?.profileImage ?? "/assets/images/pinggu.svg";
  const recipeName = item?.recipeName ?? item?.recipeTitle ?? "요리명 없음";

  //  닉네임 방어 (빈값 / 공백 방지)
  const nickname = (item?.nickname || "").trim() || "닉네임 없음";

  const level = item?.level ?? 1;
  const xp = item?.xp ?? 0;

  

  const createdAtText = useMemo(() => {
    const d = parseDate(item?.createdAt)
    if(!d) return "방금 전"
    return getRelativeTime(d)
  }, [item?.createdAt]);

  const desc =
    item?.desc ??
    item?.content ??
    "내용이 없습니다.";

   const ingredientsText = useMemo(() => {
    if (!Array.isArray(item?.ingredients) || item.ingredients.length === 0) {
      return "";
    }
    return item.ingredients.join(", ");
  }, [item?.ingredients]);

  // ===== 내 글 판별 =====
  const isMine = useMemo(() => {
    const me = String(meNickname ?? "").trim();
    const author = String(nickname ?? "").trim();
    return !!me && !!author && me === author;
  }, [meNickname, nickname]);

  // 🔥 NEW 배지
  const isNew = useMemo(() => {
    const d = parseDate(item?.createdAt);
    if (!d) return false;
    const diffDays = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= NEW_DAYS;
  }, [item?.createdAt]);

  // ❤️ 인기 배지
  const isPopular = useMemo(() => {
    if (!allItems?.length) return false;

    const now = Date.now();

    const recent30 = allItems
      .map((x) => {
        const d = parseDate(x?.createdAt);
        return { ...x, _createdTime: d ? d.getTime() : null };
      })
      .filter((x) => {
        if (!x._createdTime) return false;
        const diffDays = (now - x._createdTime) / (1000 * 60 * 60 * 24);
        return diffDays <= POPULAR_DAYS;
      });

    const sorted = [...recent30].sort(
      (a, b) => (b.likes ?? 0) - (a.likes ?? 0),
    );

    const topIds = new Set(sorted.slice(0, POPULAR_TOP_N).map((x) => x.id));
    return topIds.has(item?.id);
  }, [allItems, item?.id]);

  return (
    <S.CarouselCard type="button" $w={w} $mine={isMine} onClick={onClick}>
      {/* 이미지 영역 */}
      <S.CardImageWrap>
        {(isNew || isPopular) && (
          <S.BadgeWrap>
            {isNew && <S.BadgeNew>🔥 NEW</S.BadgeNew>}
            {isPopular && <S.BadgePopular>❤️ 인기</S.BadgePopular>}
          </S.BadgeWrap>
        )}

        <S.CardImageArea src={recipeImage} alt={`${recipeName} 이미지`} />
      </S.CardImageWrap>

      <S.CardContentArea>
        <S.CardTitleRow>
          <S.CardTitleLeft>
            <S.CardTitle>{recipeName}</S.CardTitle>
            <S.CardDateText>{createdAtText}</S.CardDateText>
          </S.CardTitleLeft>

          <S.CardLikeArea onClick={handleLikeToggle}>
            <S.HeartIcon $liked={liked} />
            <S.LikeCount>{likeCount}</S.LikeCount>
          </S.CardLikeArea>
        </S.CardTitleRow>

        <S.CardDivider />

        <S.CardMetaRow>
          <S.MetaLeft>
            <S.ProfileImg src={profileImage} alt="유저 프로필" />
            <S.UserNickName $mine={isMine}>{nickname}</S.UserNickName>
          </S.MetaLeft>

          <S.MetaCenter>
            <S.BadgeChip>
              <S.BadgeChipIcon src="/assets/icons/star.svg" alt="별 아이콘" />
              Lv.{level}
            </S.BadgeChip>
            <S.BadgeChip2>XP {xp}</S.BadgeChip2>
          </S.MetaCenter>

          
        </S.CardMetaRow>

        {ingredientsText && (<S.CardDesc>{ingredientsText}</S.CardDesc>)}
        <S.CardDesc>{desc}</S.CardDesc>
      </S.CardContentArea>
    </S.CarouselCard>
  );
};

export default PostCard;