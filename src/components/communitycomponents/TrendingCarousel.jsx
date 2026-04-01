import React, {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import * as S from "../../pages/community/style";
import PostCard from "./PostCard";

// 슬라이드 전용 상수
const GAP = 22;
const VISIBLE = 4;

// 트랜딩 캐러셀에 관련 상수
const TRENDING_DAYS = 30;
const TRENDING_TOP_N = 8;

const TrendingCarousel = ({ posts = [], onCardClick, meNickname, onLikeToggle  }) => {
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

  /**
   * 트렌딩 기준
   * - 좋아요 5개 이상 우선
   * - 좋아요 내림차순 정렬
   * - 최대 8개 노출
   * - 좋아요 5개 이상이 없으면 전체 중 TOP 8
   */
  const items = useMemo(() => {
    const now = Date.now();

    const list = (posts ?? []).map((p) => {
      const d = parseDate(p?.createdAt);

      return {
        id: p.id,
        recipeName: p.recipeTitle ?? p.recipeName ?? "",
        nickname: String(p.author?.nickname ?? p.nickname ?? "").trim() || "익명",
        level: p.author?.level ?? p.level ?? 1,
        likes: p.likes ?? 0,
        isLiked: p.isLiked ?? false,
        images: p.images ?? [],
        content: p.content ?? "",
        ingredients: p.ingredients ?? [],
        createdAt: p.createdAt,
        comments: p.comments ?? [],
        xp: p.xp ?? 0,
        _createdTime: d ? d.getTime() : null,
      };
    });

    // 최근 30일 필터
    const recent30 = list.filter((x) => {
      if (!x._createdTime) return false;
      const diffDays = (now - x._createdTime) / (1000 * 60 * 60 * 24);
      return diffDays <= TRENDING_DAYS;
    });

    const sorted = [...recent30].sort(
      (a, b) => (b.likes ?? 0) - (a.likes ?? 0),
    );

    return sorted.slice(0, TRENDING_TOP_N);
  }, [posts]);

  const viewportRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardW, setCardW] = useState(0);

  // 카드 너비 계산
  useLayoutEffect(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) return;

    const updateCardWidth = () => {
      const viewportWidth = viewportElement.getBoundingClientRect().width;
      const width = (viewportWidth - GAP * (VISIBLE - 1)) / VISIBLE;
      setCardW(width);
    };

    updateCardWidth();
    const resizeObserver = new ResizeObserver(updateCardWidth);
    resizeObserver.observe(viewportElement);
    return () => resizeObserver.disconnect();
  }, []);

   // items 길이가 줄면 currentIndex가 범위를 벗어날 수 있어서 보정
  useLayoutEffect(() => {
    const max = Math.max(items.length - VISIBLE, 0);
    setCurrentIndex((prev) => Math.min(prev, max));
  }, [items.length]);

  const maxIndex = Math.max(items.length - VISIBLE, 0);
  const step = cardW + GAP;

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));

  //  카드 클릭 시: 부모가 준 onCardClick 실행
  const handleCardClick = useCallback(
    (item) => {
      onCardClick?.(item);
    },
    [onCardClick],
  );

  // 트렌딩 비어있으면 아예 렌더 안 함
  if (items.length === 0) return null;

  return (
    <S.CarouselSection>
      <S.SectionHeader>
        <S.SectionTitle>🔥 인기 급상승 요리</S.SectionTitle>
        <S.SectionDesc>최근 게시물 중 좋아요가 많은 TOP 8</S.SectionDesc>
      </S.SectionHeader>

      <S.CaroselBody>
        <S.CarouselNavButton
          type="button"
          aria-label="이전"
          $direction="prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        />

        <S.CarouselViewport ref={viewportRef}>
          <S.CarouselTrack
            style={{ transform: `translateX(-${currentIndex * step}px)` }}
          >
            {items.map((item) => (
              <PostCard
                key={item.id}
                item={item}
                allItems={items} // ❤️ 인기 계산에 사용 (트렌딩 목록 기준)
                w={cardW ? `${cardW}px` : "280px"} //  계산되면 동적, 아니면 fallback
                meNickname={meNickname}
                onClick={() => handleCardClick(item)}
                onLikeToggle={onLikeToggle}
              />
            ))}
          </S.CarouselTrack>
        </S.CarouselViewport>

        <S.CarouselNavButton
          type="button"
          aria-label="다음"
          $direction="next"
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
        />
      </S.CaroselBody>
    </S.CarouselSection>
  );
};

export default TrendingCarousel;
