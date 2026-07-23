import React, { useState } from "react";
import * as S from "./style";
import { getRecipeRating } from "../../utils/recipeRating";

const MyRecipeCard = ({ item, onClick, onToggleBookmark }) => {
  const {
    id,
    title,
    recipe,
    description,
    xp,
    cookTime,
    difficulty,
    level,
    missingIngredients,
    image,
    imageUrl,
    saved,
  } = item;

  const displayDifficulty = difficulty || level || "쉬움";

  const displayRating = getRecipeRating(displayDifficulty, xp);

  const bookmarkIcon = saved
    ? "/assets/icons/bookmark_on.svg"
    : "/assets/icons/bookmark_off.svg";

  /* 토글할 때마다 애니메이션 강제 재실행용 */
  const [animKey, setAnimKey] = useState(0);

  /* ===============================
     부족한 재료 표시 및 툴팁
     =============================== */
  const missingIngredientList = Array.isArray(missingIngredients)
    ? missingIngredients
        .map((item) => {
          if (typeof item === "string") return item.trim();
          if (typeof item?.name === "string") return item.name.trim();
          return "";
        })
        .filter(Boolean)
    : [];

  const missingCount = (() => {
    if (missingIngredientList.length > 0) {
      return missingIngredientList.length;
    }

    if (typeof missingIngredients === "number") {
      return missingIngredients;
    }

    if (typeof missingIngredients === "string") {
      const cleaned = missingIngredients
        .replace(/부족한?\s*재료\s*\|?\s*/g, "")
        .trim();

      const countMatch = cleaned.match(/\d+/);

      if (countMatch) {
        return Number(countMatch[0]);
      }
    }
    return 0;
  })();

  const missingSummary =
    missingCount > 0 ? `부족한 재료 | ${missingCount}개` : "부족한 재료 | 없음";

  const missingTooltip =
    missingIngredientList.length > 0
      ? missingIngredientList.join(" . ")
      : missingCount > 0
        ? "부족한 재료의 상세 정보가 없습니다."
        : "부족한 재료가 없습니다.";

  /* ===============================
     북마크 핸들러
     =============================== */
  const handleBookmarkToggle = (e) => {
    e.stopPropagation();
    onToggleBookmark?.(id);
    setAnimKey((k) => k + 1); // 클릭할 때마다 key 바꿔서 애니메이션 재실행
  };

  const handleBookmarkKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onToggleBookmark?.(id);
      setAnimKey((k) => k + 1); // 키보드 토글도 애니메이션 재실행
    }
  };

  const DEFAULT_RECIPE_IMAGE = "/assets/images/default-recipe.png";
  const thumbSrc = image || imageUrl || DEFAULT_RECIPE_IMAGE;

  return (
    <S.Card
      type="button"
      onClick={onClick}
      role="link"
      aria-label={`${title} 상세 보기`}
    >
      <S.ThumbArea>
        <S.ThumbImg
          src={thumbSrc}
          alt={title || "추천 레시피 이미지"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_RECIPE_IMAGE;
          }}
        />

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

        {(recipe || description) && (
          <S.Desc title={recipe || description}>{recipe || description}</S.Desc>
        )}

        <S.BadgeRow>
          {/* 왼쪽: 별점 */}
          <S.Badge className="star">
            <img
              src="/assets/icons/star.svg"
              alt=""
              aria-hidden="true"
              width="16"
              height="16"
            />
            {displayRating}
          </S.Badge>

          {/* 오른쪽: XP */}
          <S.Badge className="xp">XP {xp ?? 0}</S.Badge>
        </S.BadgeRow>

        <S.MetaRow>
          <S.MetaChip>{`조리시간 | ${cookTime ?? 10}분`}</S.MetaChip>
          {/* <S.MetaChip>{`부족한 재료 | ${missingText}`}</S.MetaChip> */}
          <S.MissingChipWrap aria-label={`부족한 재료: ${missingTooltip}`}>
            <S.MetaChip>{missingSummary}</S.MetaChip>

            <S.MissingTooltip>
              <S.TooltipText>{missingTooltip}</S.TooltipText>
            </S.MissingTooltip>
          </S.MissingChipWrap>
        </S.MetaRow>
      </S.Body>
    </S.Card>
  );
};

export default MyRecipeCard;
