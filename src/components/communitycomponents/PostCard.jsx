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

const AVATAR_COLORS = [
  { bg: "#FFE9DF", color: "#FF5A3C" },
  { bg: "#E8F3FF", color: "#2F80ED" },
  { bg: "#EAF7EA", color: "#2E7D32" },
  { bg: "#F3E8FF", color: "#8E44AD" },
  { bg: "#FFF3CD", color: "#B7791F" },
  { bg: "#E0F7FA", color: "#00838F" },
  { bg: "#FCE4EC", color: "#C2185B" },
  { bg: "#EDE7F6", color: "#5E35B1" },
];

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

const getProfileImage = (item) => {
  return (
    item?.profileImage ||
    item?.memberProfile ||
    item?.profileImageUrl ||
    item?.member?.memberProfile ||
    item?.member?.profileImage ||
    item?.member?.profileImageUrl ||
    ""
  );
};

const getProfileInitial = (nickname) => {
  const name = String(nickname || "사용자").trim();
  return name.charAt(0);
};

const getAuthorKey = (item, nickname) => {
  return String(
    item?.memberId ||
      item?.member?.id ||
      item?.member?.memberId ||
      item?.nickname ||
      nickname ||
      "unknown",
  );
};

const getHashIndex = (text, length) => {
  let hash = 0;

  for (let i = 0; i < text.length; i += 1) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash) % length;
};

const PostCard = ({
  item,
  w,
  onClick,
  meNickname,
  allItems = [],
  onLikeToggle,
}) => {
  const liked = item?.liked ?? false;
  console.log("PostCard liked", item.id, item.liked, liked);
  const likeCount = item?.likes ?? 0;

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    onLikeToggle?.(item.id, liked);
  };

  // ===== 기본 데이터 =====
  const firstImage =
    item?.images?.[0] ?? item?.postImage?.[0] ?? item?.postImages?.[0];

  const recipeImage =
    (typeof firstImage === "string"
      ? firstImage
      : (firstImage?.imageUrl ??
        firstImage?.postImageUrl ??
        firstImage?.url ??
        firstImage?.image)) ??
    item?.imageUrl ??
    item?.recipeImage ??
    "/assets/images/oatmeal.svg";

  console.log("카드 item id:", item.id);
  console.log("카드 images:", item.images);
  console.log("카드 최종 이미지:", recipeImage);

  const profileImage = getProfileImage(item);
  const recipeName = item?.recipeName ?? item?.recipeTitle ?? "요리명 없음";

  // 닉네임 방어 (memberName, member.memberName, nickname 등 백엔드 응답 필드 대응)
  const nickname = (
    item?.memberName ||
    item?.member?.memberName ||
    item?.member?.memberNickname ||
    item?.nickname ||
    ""
  ).trim() || "닉네임 없음";
  const profileInitial = getProfileInitial(nickname);

  const avatarColor = useMemo(() => {
    const authorKey = getAuthorKey(item, nickname);

    const uniqueAuthorKeys = [
      ...new Set(
        (allItems || [])
          .map((post) => getAuthorKey(post, post?.nickname))
          .filter(Boolean),
      ),
    ];

    const authorIndex = uniqueAuthorKeys.indexOf(authorKey);

    const colorIndex =
      authorIndex >= 0
        ? authorIndex % AVATAR_COLORS.length
        : getHashIndex(authorKey, AVATAR_COLORS.length);

    return AVATAR_COLORS[colorIndex];
  }, [allItems, item, nickname]);

  const level = item?.level ?? 1;
  const xp = item?.xp ?? 0;

  const createdAtText = useMemo(() => {
    const d = parseDate(item?.createdAt);
    if (!d) return "방금 전";
    return getRelativeTime(d);
  }, [item?.createdAt]);

  const desc = item?.desc ?? item?.content ?? "내용이 없습니다.";

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
            {profileImage ? (
              <S.ProfileImg src={profileImage} alt="유저 프로필" />
            ) : (
              <S.UserInitialAvatar
                $bgColor={avatarColor.bg}
                $textColor={avatarColor.color}
              >
                {profileInitial}
              </S.UserInitialAvatar>
            )}
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

        {ingredientsText && <S.CardDesc>{ingredientsText}</S.CardDesc>}
        <S.CardDesc>{desc}</S.CardDesc>
      </S.CardContentArea>
    </S.CarouselCard>
  );
};

export default PostCard;
