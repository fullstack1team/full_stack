// ✅ items에서 받은 nickname/level을 Post로 변환해서 onCardClick(post)로 넘김
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import * as S from "../../pages/community/style";
import PostCard from "./PostCard";

const PAGE_SIZE = 12;

const FeedGrid = ({
  items = [],
  isSearching = false,
  searchKeyword = "",
  onCardClick,
  meNickname,
  onLikeToggle,
  onEmptyAction,
}) => {
  const showSearchEmpty = isSearching && items.length === 0;
  const showCommunityEmpty = !isSearching && items.length === 0;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef(null);

  const hasMore = visibleCount < items.length;

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount],
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsLoading(false);
  }, [items]);

  const loadMore = useCallback(() => {
    if (isLoading) return;
    if (!hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, items.length));
      setIsLoading(false);
    }, 350);
  }, [isLoading, hasMore, items.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { root: null, rootMargin: "200px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // const buildMockPost = useCallback(
  //   (item) => ({
  //     id: item.id,
  //     images: [
  //       `${process.env.PUBLIC_URL}/assets/images/pancake.svg`,
  //       `${process.env.PUBLIC_URL}/assets/images/tteokbokki.svg`,
  //     ],
  //     author: {
  //       nickname: item.nickname ?? "파스타러버",
  //       level: item.level ?? 4,
  //     },
  //     likes: item.likes ?? 80,
  //     createdAt: item.createdAt ?? "2025. 12. 20",
  //     recipeTitle: item.recipeName ?? "팬케이크",
  //     content:
  //       item.desc ??
  //       "딸기 팬케이크 완성! 반죽이 쫀쫀하고 소스가 진짜 부드러워요. 가족들이 엄청 좋아했습니다",
  //     ingredients: item.ingredients ?? ["밀가루", "생크림", "파슬리가루"],
  //     xp: item.xp ?? 120,
  //     comments: item.comments ?? [
  //       { nickname: "금손수", time: "2초 전", text: "와 진짜 맛있어 보여요!" },
  //       {
  //         nickname: "요리왕금손수",
  //         time: "5분 전",
  //         text: "두번째 댓글도 테스트!",
  //       },
  //       { nickname: meNickname, time: "8분 전", text: "내 댓글 테스트🥲" },
  //       { nickname: "테스트", time: "8분 전", text: "다른 사람 댓글" },
  //     ],
  //   }),
  //   [meNickname],
  // );

  // const handleCardClick = useCallback(
  //   (item) => {
  //     const post = buildMockPost(item);
  //     onCardClick?.(post);
  //   },
  //   [buildMockPost, onCardClick],
  // );

  // 전체 items를 그대로 상위로 전달
  const handleCardClick = useCallback(
    (item) => {
      onCardClick?.(item); // 그대로 전달
    },
    [onCardClick],
  );

  return (
    <S.FeedGridSection>
      <S.FeedGridWrap>
        {showSearchEmpty ? (
          <S.EmptyState>
            <S.EmptyTitle>“{searchKeyword}” 검색 결과가 없습니다.</S.EmptyTitle>
            <S.EmptyDesc>다른 키워드로 다시 검색해보세요.</S.EmptyDesc>
          </S.EmptyState>
        ) : showCommunityEmpty ? (
          <S.EmptyState>
            <S.EmptyTitle>아직 등록된 게시글이 없습니다.</S.EmptyTitle>
            <S.EmptyDesc>
              요리를 완성하고 첫 번째 인증 게시글을 남겨보세요!
            </S.EmptyDesc>

            <S.EmptyButton onClick={onEmptyAction}>
              추천 요리 보러가기
            </S.EmptyButton>
          </S.EmptyState>
        ) : (
          visibleItems.map((item) => (
            <PostCard
              key={item.id}
              item={item}
              allItems={items}
              w="100%"
              meNickname={meNickname}
              onClick={() => handleCardClick(item)}
              onLikeToggle={onLikeToggle}
            />
          ))
        )}
      </S.FeedGridWrap>

      {/* 아래는 items가 있을 때만 보여주기 */}
      {items.length > 0 && (
        <>
          <S.FeedGridSentinel ref={sentinelRef} />
          {isLoading && <S.FeedGridLoading>불러오는 중…</S.FeedGridLoading>}
          {!hasMore && <S.FeedGridEnd>마지막 게시물입니다.</S.FeedGridEnd>}
        </>
      )}
    </S.FeedGridSection>
  );
};

export default FeedGrid;
