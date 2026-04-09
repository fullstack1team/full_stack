import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";

import { CommunityHeader } from "../../components/communitycomponents/CommunityHeader";
import MyRecipeGrid from "../../components/myrecipecomponents/MyRecipeGrid";
import SortTab from "../../components/myrecipecomponents/SortTab";
import Pagination from "../../components/layoutcomponents/pagination/Pagination";
import FloatingActions from "../../components/layoutcomponents/FloatingActions";
import MyRecipeEmpty from "../../components/myrecipecomponents/MyRecipeEmpty";
import useAuthStore from "../../store/authStore";
import LoginRequireModal from "../../components/layoutcomponents/loginrequiremodal/LoginRequireModal";
import { deleteSavedRecipe, getSavedRecipes } from "../../api/aiSavedRecipe";

export const MYRECIPE_SORT_OPTIONS = [
  { key: "saved_latest", label: "최신순" },
  { key: "cook_fast", label: "조리 빠른순" },
  { key: "difficulty_low", label: "난이도 낮은순" },
];

const MyRecipe = () => {
  const navigate = useNavigate();
  const { member, isAuthenticated } = useAuthStore();

  const isLoggedIn = Boolean(isAuthenticated && member?.id)
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  console.log("로그인 상태", isAuthenticated, member)

  const [keyword, setKeyword] = useState("");
  const [sortKey, setSortKey] = useState("saved_latest");
  const [savedList, setSavedList] = useState([]);
  const [page, setPage] = useState(1);

  const pageSize = 12;
  // 그리드 상단 스크롤 타겟
  const gridTopRef = useRef(null);
  
  const requireLogin = useCallback(
    (action) => {
      if (!isAuthenticated || !member) {
        setLoginModalOpen(true);
        return false;
      }
      action?.();
      return true;
    },
    [isAuthenticated, member],
  ); 

  const fetchSavedList = useCallback(async () => {
    try {
      if (!member?.id) return

      const res = await getSavedRecipes(member.id)
      console.log("저장 레시피 조회 결과", res)

      // 백엔드 구조에 맞게 바꿔야함
      const list = Array.isArray(res) ? res : []

      const mapped = list.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl,
        cookTime: item.cookTime,
        difficulty: item.difficulty,
        category: item.category,
        xp: item.xp,
        createdAt: item.createAt,
        // missingIngredients: item.missingIngredients,
        saved: true

      }))

      setSavedList(mapped)
    } catch (error) {
      console.log(error)
      setSavedList([])
    }
  }, [member])

  useEffect(() => {
    if (!isLoggedIn) return
    fetchSavedList()
  }, [isLoggedIn, fetchSavedList])

  const handleToggleBookmark = useCallback(
    async (savedRecipeId) => {
      requireLogin(async () => {
        try{
          await deleteSavedRecipe(savedRecipeId)
          setSavedList((prev) => prev.filter((r) => r.id !== savedRecipeId));
        } catch (error) {
          console.log(error)
        }
      });
    },
    [requireLogin],
  );

  const handleCardClick = useCallback(
    (recipeId) => {
      const recipe = savedList.find((r) => r.id === recipeId);
      if (!recipe) return;

      navigate(`/foodrecommendation/recommendRecipe/${recipeId}`, {
        state: { recipe },
      });
    },
    [navigate, savedList],
  );
  
  const compareBySortKey = useCallback(
    (a, b) => {
      const tieBreaker = () => b.id - a.id;

      if (sortKey === "saved_latest") return b.id - a.id;

      if (sortKey === "cook_fast") {
        const diff = (a.cookTime ?? 9999) - (b.cookTime ?? 9999);
        return diff !== 0 ? diff : tieBreaker();
      }

      if (sortKey === "difficulty_low") {
        const rank = { 하: 0, 중: 1, 상: 2 };
        const diff = (rank[a.difficulty] ?? 99) - (rank[b.difficulty] ?? 99);
        return diff !== 0 ? diff : tieBreaker();
      }

      return tieBreaker();
    },
    [sortKey],
  );

  const filteredAndSorted = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    const filtered = savedList.filter((r) => {
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        (r.missingIngredients ?? "").toLowerCase().includes(q)
      );
    });

    return [...filtered].sort(compareBySortKey);
  }, [savedList, keyword, compareBySortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));

  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, page, pageSize]);

  // 페이지 범위 보정
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // 검색/정렬 바뀌면 1페이지로
  useEffect(() => {
    setPage(1);
  }, [keyword, sortKey]);

  // 페이지 바뀔 때 그리드 상단으로 스크롤
  useEffect(() => {
    if (!gridTopRef.current) return;
    gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const isSearching = keyword.trim().length > 0;

  return (
    <S.Page>
      {/* FloatingActions 스크롤 타겟 */}
      <div id="community-top" />

      <S.Container>
        <CommunityHeader
          title="저장한 레시피"
          placeholder="요리명, 코멘트, 재료로 검색..."
          showSort={true}
          sortOptions={MYRECIPE_SORT_OPTIONS}
          defaultSortKey={sortKey}
          onSortChange={(opt) => setSortKey(opt.key)}
          onSearch={({ keyword: k }) => setKeyword(k)}
        />
      </S.Container>

      <S.FullDivider />

      <S.Container>
        <SortTab
          options={MYRECIPE_SORT_OPTIONS}
          value={sortKey}
          onChange={(key) => setSortKey(key)}
        />

        {/* 그리드 상단 앵커 */}
        <div ref={gridTopRef} />

        {!isLoggedIn ? (
          <MyRecipeEmpty
            isLoggedIn={false}
            title="저장한 레시피는 로그인 후 확인할 수 있습니다."
            desc="로그인하고 나만의 레시피를 저장해보세요!"
            showCta={true}
          />
        ) : filteredAndSorted.length === 0 ? (
          isSearching ? (
            <S.EmptyState>
              <S.EmptyTitle>“{keyword}” 검색 결과가 없습니다</S.EmptyTitle>
              <S.EmptyDesc>다른 키워드로 다시 검색해보세요.</S.EmptyDesc>
            </S.EmptyState>
          ) : (
            <MyRecipeEmpty isLoggedIn={true} />
          )
        ) : (
          <>
            <MyRecipeGrid
              items={pagedItems}
              onCardClick={handleCardClick}
              onToggleBookmark={handleToggleBookmark}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onChange={setPage}
                leftIconSrc="/assets/icons/left_arrow.svg"
                rightIconSrc="/assets/icons/nextpage_arrow.svg"
              />
            )}
          </>
        )}
      </S.Container>

      {/* 로그인 요구 모달 */}
      <LoginRequireModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onConfirm={() => {
          setLoginModalOpen(false);
          navigate("/login");
        }}
      />

      <FloatingActions targetId="community-top" />
    </S.Page>
  );
};

export default MyRecipe;