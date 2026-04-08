// MyRecipeCard.jsx (복붙용: 너 현재 코드 기준 + 토글할 때마다 애니메이션 재실행)
import React, { useState } from "react";
import * as S from "./style";

const MyRecipeCard = ({ item, onClick, onToggleBookmark }) => {
  const {
    title,
    recipe,
    desc,
    rating,
    xp,
    cookTimeMin,
    missingIngredients,
    image,
    imageUrl,
    saved,
  } = item;

  const bookmarkIcon = saved
    ? "/assets/icons/bookmark_on.svg"
    : "/assets/icons/bookmark_off.svg";

  /* 토글할 때마다 애니메이션 강제 재실행용 */
  const [animKey, setAnimKey] = useState(0);

  /* ===============================
     부족한 재료 텍스트 정규화
     =============================== */
  const missingText = (() => {
    if (typeof missingIngredients === "number") return `${missingIngredients}개`;
    if (Array.isArray(missingIngredients)) return `${missingIngredients.length}개`;

    if (typeof missingIngredients === "string") {
      const cleaned = missingIngredients
        .replace(/부족한\s*재료\s*\|?\s*/g, "")
        .trim();

      if (/^\d+$/.test(cleaned)) return `${cleaned}개`;
      if (/^\d+\s*개$/.test(cleaned)) return cleaned.replace(/\s+/g, "");

      return cleaned;
    }

    return "-";
  })();

  /* ===============================
     북마크 핸들러
     =============================== */
  const handleBookmarkToggle = (e) => {
    e.stopPropagation();
    onToggleBookmark?.();
    setAnimKey((k) => k + 1); // 클릭할 때마다 key 바꿔서 애니메이션 재실행
  };

  const handleBookmarkKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onToggleBookmark?.();
      setAnimKey((k) => k + 1); // 키보드 토글도 애니메이션 재실행
    }
  };

  return (
    <S.Card
      type="button"
      onClick={onClick}
      role="link"
      aria-label={`${title} 상세 보기`}
    >
      <S.ThumbArea>
        <S.ThumbImg src={image || imageUrl} alt={title} loading="lazy" />

        {/* 아이콘 자체가 버튼 + key로 애니메이션 리셋 */}
        <S.BookmarkIcon
          key={animKey}
          src={bookmarkIcon}
          alt={saved ? "북마크 해제" : "북마크 저장"}
          role="button"
          tabIndex={0}
          aria-pressed={saved}
          data-saved={saved ? "true" : "false"} // style.js에 pop 애니메이션 쓰는 경우 유지
          onClick={handleBookmarkToggle}
          onKeyDown={handleBookmarkKeyDown}
        />
      </S.ThumbArea>

      <S.Body>
        <S.Title title={title}>{title}</S.Title>

        {recipe && <S.Desc title={recipe || desc}>{recipe || desc}</S.Desc>}

        <S.BadgeRow>
          <S.Badge className="star">
            <img
              src="/assets/icons/star.svg"
              alt=""
              aria-hidden="true"
              width="16"
              height="16"
            />
            {rating ? Number(rating).toFixed(1) : "4.5"}

          </S.Badge>

          <S.Badge className="xp">XP {xp || 300}</S.Badge>
        </S.BadgeRow>

        <S.MetaRow>
          <S.MetaChip>{`조리시간 | ${cookTimeMin || 10}분`}</S.MetaChip>
          <S.MetaChip>{`부족한 재료 | ${missingText}`}</S.MetaChip>
        </S.MetaRow>
      </S.Body>
    </S.Card>
  );
};

export default MyRecipeCard;
