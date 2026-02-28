import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as S from "./style";

import { CommunityHeader } from "../../components/communitycomponents/CommunityHeader";
import TrendingCarousel from "../../components/communitycomponents/TrendingCarousel";
import FeedGrid from "../../components/communitycomponents/FeedGrid";
import FloatingActions from "../../components/layoutcomponents/FloatingActions";

import CommunityPostModal from "../../components/communitycomponents/CommunityPostModal";
import MyPostModal from "../../components/communitycomponents/MyPostModal";
import LoginRequireModal from "../../components/layoutcomponents/loginrequiremodal/LoginRequireModal";

import usePostStore from "../../store/postStore";
import useAuthStore from "../../store/authStore";

const CommunityMain = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { posts } = usePostStore();
  const { user, isAuthenticated } = useAuthStore();

  // ✅ 로그인 유저 닉네임(없으면 게스트)
  const meNickname = user?.nickname || "";

  // ✅ 로그인 요구 모달
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // ✅ "로그인 필요 행동" 공통 래퍼
  const requireLogin = useCallback(
    (action) => {
      if (!isAuthenticated || !user) {
        setLoginModalOpen(true);
        return false;
      }
      action?.();
      return true;
    },
    [isAuthenticated, user],
  );

  const normalizeFromStore = useCallback((raw) => {
    const nicknameRaw =
      raw?.author?.nickname ?? raw?.nickname ?? raw?.authorNickname ?? "";
    const nickname = String(nicknameRaw).trim() || "익명";
    const level = raw?.author?.level ?? raw?.level ?? raw?.authorLevel ?? 1;
    const images = raw?.images ?? (raw?.imageUrl ? [raw.imageUrl] : []);

    return {
      id: raw?.id,
      recipeName: raw?.recipeTitle ?? raw?.recipeName ?? raw?.title ?? "",
      nickname,
      level,
      images,
      likes: raw?.likes ?? 0,
      content: raw?.content ?? raw?.desc ?? "",
      ingredients: raw?.ingredients ?? [],
      createdAt: raw?.createdAt ?? "방금 전",
      comments: raw?.comments ?? [],
      xp: raw?.xp ?? 0,
    };
  }, []);

  const allItems = useMemo(
    () => (posts ?? []).map(normalizeFromStore),
    [posts, normalizeFromStore],
  ); // postStore에 어떤 형태로 저장해도 CommunityMain이 “흡수/정규화”해서 FeedGrid/PostCard에는 항상 item.nickname이 정상으로 들어감

  const buildMockPost = useCallback((item) => {
    return {
      id: item.id,
      images: item.images ?? [],
      author: {
        nickname: item.nickname ?? "익명",
        level: item.level ?? 1,
      },
      likes: item.likes ?? 0,
      createdAt: item.createdAt ?? "방금 전",
      recipeTitle: item.recipeName,
      content: item.content,
      ingredients: item.ingredients ?? [],
      xp: 0,
      comments: item.comments ?? [],
    };
  }, []);

  const [isOtherPostModalOpen, setIsOtherPostModalOpen] = useState(false);
  const [isMyPostModalOpen, setIsMyPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [searchState, setSearchState] = useState({
    keyword: "",
    sort: "latest",
  });
  // 간단 텍스트 검색 (레시피명/본문/재료/닉네임)
  const matchesKeyword = useCallback((item, keyword) => {
    const q = keyword.trim().toLowerCase();
    if (!q) return true;

    const hay = [
      item.recipeName,
      item.content,
      item.nickname,
      ...(item.ingredients ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(q);
  }, []);

  // 정렬 + 필터된 결과
  const displayItems = useMemo(() => {
    const filtered = allItems.filter((it) =>
      matchesKeyword(it, searchState.keyword),
    );

    // 정렬: createdAt이 "방금 전" 같은 문자열이면 정확한 최신정렬이 어려워서
    // 일단 likes 기반 인기순만 확실하게 하고, 최신순은 원본 순서 유지(or id desc)로 처리 추천
    const sorted = [...filtered];

    if (searchState.sort === "popular") {
      sorted.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    } else {
      // latest: 원본이 최신순이라고 가정하거나, id가 증가형이면 id desc로
      sorted.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }

    return sorted;
  }, [allItems, matchesKeyword, searchState]);

  // ✅ 카드 클릭: 내 글이면 MyPostModal / 아니면 CommunityPostModal
  const handleOpenAnyPostModal = useCallback(
    (item) => {
      const post = buildMockPost(item);
      const isMine = !!meNickname && post.author?.nickname === meNickname;

      // ✅ "내 글" 모달은 편집 기능이 있으니 로그인 필요로 묶는게 안전
      if (isMine) {
        requireLogin(() => {
          setSelectedPost(post);
          setIsMyPostModalOpen(true);
          setIsOtherPostModalOpen(false);
        });
        return;
      }

      // ✅ 다른 사람 글 모달은 누구나 열람 가능
      setSelectedPost(post);
      setIsOtherPostModalOpen(true);
      setIsMyPostModalOpen(false);
    },
    [buildMockPost, meNickname, requireLogin],
  );

  const handleCloseModals = useCallback(() => {
    setIsOtherPostModalOpen(false);
    setIsMyPostModalOpen(false);
    setSelectedPost(null);
  }, []);

  // ✅ 쿼리스트링으로 모달 열기(postId) - 테스트용
  useEffect(() => {
    const postId = searchParams.get("postId");
    if (!postId) return;

    const idNum = Number(postId);
    if (!Number.isFinite(idNum)) return;

    const item = {
      id: idNum,
      recipeName: `레시피 ${idNum}`,
      nickname: idNum % 7 === 0 ? meNickname : "파스타러버",
      level: 4,
      likes: 80,
      images: [],
      content: "",
      ingredients: [],
      createdAt: "방금 전",
      comments: [],
    };

    handleOpenAnyPostModal(item); // ✅ post 말고 item을 넣어야 함
  }, [searchParams, meNickname, handleOpenAnyPostModal]);

  // ===== 댓글 등록 (로그인 필요) =====
  const handleSubmitComment = useCallback(
    (text) => {
      requireLogin(() => {
        const trimmed = String(text ?? "").trim();
        if (!trimmed) return;

        setSelectedPost((prev) => {
          if (!prev) return prev;
          const newComment = {
            nickname: meNickname,
            time: "방금 전",
            text: trimmed,
          };
          return { ...prev, comments: [newComment, ...(prev.comments ?? [])] };
        });
      });
    },
    [requireLogin, meNickname],
  );

  // ===== 댓글 수정/삭제 (로그인 필요 + 내 댓글만 가능이지만 모달에서 이미 mine 체크) =====
  const handleEditComment = useCallback(
    (comment, nextTextFromModal) => {
      requireLogin(() => {
        const nextText =
          typeof nextTextFromModal === "string"
            ? nextTextFromModal
            : window.prompt("댓글을 수정하세요", comment?.text ?? "");

        if (nextText === null) return;
        const trimmed = String(nextText).trim();
        if (!trimmed) return;

        setSelectedPost((prev) => {
          if (!prev) return prev;
          const nextComments = (prev.comments ?? []).map((c) =>
            c === comment ? { ...c, text: trimmed, time: "방금 전" } : c,
          );
          return { ...prev, comments: nextComments };
        });
      });
    },
    [requireLogin],
  );

  const handleDeleteComment = useCallback(
    (comment) => {
      requireLogin(() => {
        const ok = window.confirm("댓글을 삭제할까요?");
        if (!ok) return;

        setSelectedPost((prev) => {
          if (!prev) return prev;
          const nextComments = (prev.comments ?? []).filter(
            (c) => c !== comment,
          );
          return { ...prev, comments: nextComments };
        });
      });
    },
    [requireLogin],
  );

  // ===== 내 글 전용 액션들은 로그인 필요 =====
  const handleEditPost = useCallback(
    (postId, patch) => {
      requireLogin(() => {
        setSelectedPost((prev) => {
          if (!prev || prev.id !== postId) return prev;
          return {
            ...prev,
            recipeTitle: patch?.recipeTitle ?? prev.recipeTitle,
            content: patch?.content ?? prev.content,
            ingredients: patch?.ingredients ?? prev.ingredients,
          };
        });
      });
    },
    [requireLogin],
  );

  const handleDeletePost = useCallback(
    (postId) => {
      requireLogin(() => {
        console.log("delete post:", postId);
        handleCloseModals();
      });
    },
    [requireLogin, handleCloseModals],
  );

  const handleEditPostImage = useCallback(
    (postId, index, fileOrUrl) => {
      requireLogin(() => {
        const nextUrl =
          typeof fileOrUrl === "string"
            ? fileOrUrl
            : URL.createObjectURL(fileOrUrl);

        setSelectedPost((prev) => {
          if (!prev || prev.id !== postId) return prev;
          const nextImages = [...(prev.images ?? [])];
          nextImages[index] = nextUrl;
          return { ...prev, images: nextImages };
        });
      });
    },
    [requireLogin],
  );

  const handleDeleteAllComments = useCallback(
    (postId) => {
      requireLogin(() => {
        setSelectedPost((prev) => {
          if (!prev || prev.id !== postId) return prev;
          return { ...prev, comments: [] };
        });
      });
    },
    [requireLogin],
  );

  const handleDeleteSelectedComments = useCallback(
    (postId, selectedKeys) => {
      requireLogin(() => {
        const selectedSet = new Set(selectedKeys ?? []);
        setSelectedPost((prev) => {
          if (!prev || prev.id !== postId) return prev;
          const nextComments = (prev.comments ?? []).filter((c, idx) => {
            const key = `${c.nickname}-${idx}`;
            return !selectedSet.has(key);
          });
          return { ...prev, comments: nextComments };
        });
      });
    },
    [requireLogin],
  );

  // ===== 트렌딩 카드 클릭 =====
  const handleTrendingCardClick = useCallback(
    (item) => {
      handleOpenAnyPostModal(item); // ✅ 이미 item 기반으로 열도록 통일해둠
    },
    [handleOpenAnyPostModal],
  );

  // 좋아요 클릭시, 로그인 가드 걸기
  const handleLikeToggle = useCallback(
    (item, doToggle) => {
      requireLogin(() => {
        // 여기서 실제 서버 호출 자리(나중에) 가능
        doToggle?.();
      });
    },
    [requireLogin],
  );

  return (
    <S.Page>
      <div id="community-top" />

      <S.Container>
        <CommunityHeader
          onSearch={({ keyword, sort }) => {
            setSearchState({ keyword, sort });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </S.Container>

      <S.FullDivider />

      <S.Container>
        <TrendingCarousel
          posts={posts}
          onCardClick={handleTrendingCardClick}
          meNickname={meNickname}
          onLikeToggle={handleLikeToggle}
        />
        <S.SectionDivider />

        <FeedGrid
          items={displayItems}
          isSearching={searchState.keyword.trim().length > 0}
          searchKeyword={searchState.keyword}
          onCardClick={handleOpenAnyPostModal}
          meNickname={meNickname}
          onLikeToggle={handleLikeToggle}
        />
      </S.Container>

      <CommunityPostModal
        open={isOtherPostModalOpen}
        post={selectedPost}
        onClose={handleCloseModals}
        onClickDetail={(post) => console.log("자세히 보기", post)}
        meNickname={meNickname}
        onSubmitComment={handleSubmitComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        // ✅ 모달 안에서 "로그인 필요한 버튼"에 쓰라고 넘겨둠 (2번에서 씀)
        requireLogin={requireLogin}
        isAuthenticated={isAuthenticated}
      />

      <MyPostModal
        open={isMyPostModalOpen}
        post={selectedPost}
        onClose={handleCloseModals}
        meNickname={meNickname}
        onSubmitComment={handleSubmitComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
        onEditPostImage={handleEditPostImage}
        onDeleteAllComments={handleDeleteAllComments}
        onDeleteSelectedComments={handleDeleteSelectedComments}
      />

      <FloatingActions targetId="community-top" />

      {/* ✅ 로그인 요구 모달 */}
      <LoginRequireModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onConfirm={() => {
          setLoginModalOpen(false);
          navigate("/login");
        }}
      />
    </S.Page>
  );
};

export default CommunityMain;
