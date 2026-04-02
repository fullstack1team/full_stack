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
import { createPostLike, deletePostLike } from "../../api/postLike";

const CommunityMain = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { posts, fetchPosts } = usePostStore();

  // authStore 현재 상태
  const authState = useAuthStore();

  // localStorage fallback
  const persistedAuth = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("auth-storage") || "{}");
    } catch (error) {
      console.error("auth-storage 파싱 실패:", error);
      return {};
    }
  }, []);

  const persistedMember = persistedAuth?.state?.member ?? null;
  const persistedUser = persistedAuth?.state?.user ?? null;

  // 로그인 담당 파트가 user로 저장하든 member로 저장하든 둘 다 대응
  const currentUser =
    authState.user ?? persistedUser ?? persistedMember ?? null;

  const isLoggedIn = authState.isAuthenticated || !!currentUser;

  // 로그인 유저 닉네임(없으면 게스트)
  const meNickname = currentUser?.memberName || "";

  // 로그인 요구 모달
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // "로그인 필요 행동" 공통 래퍼
  const requireLogin = useCallback(
    (action) => {
      if (!currentUser) {
        setLoginModalOpen(true);
        return false;
      }
      action?.();
      return true;
    },
    [currentUser]
  );

  // 게시글 fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const normalizeFromStore = useCallback((raw) => {
    const nicknameRaw =
      raw?.member?.memberName ??
      raw?.author?.nickName ??
      raw?.nickName ??
      raw?.authorNickName ??
      "";

    return {
      id: raw?.id ?? 0,

      // 카드 상단 제목 = 요리명
      recipeName:
        raw?.recipe?.recipeTitle ??
        raw?.recipeTitle ??
        raw?.recipeName ??
        raw?.postTitle ??
        raw?.title ??
        "",
      nickname: String(nicknameRaw).trim() || "익명",
      level: raw?.author?.level ?? raw?.level ?? raw?.authorLevel ?? 1,
      images:
        raw?.images?.length > 0
          ? raw.images
          : raw?.imageUrl
          ? [raw.imageUrl]
          : [],
      likes: raw?.likes ?? raw?.likeCount ?? 0,
      isLiked: raw?.isLiked ?? false,
      content: raw?.postContent ?? raw?.content ?? raw?.desc ?? "",
      ingredients: Array.isArray(raw?.ingredients) ? raw.ingredients : [],
      createdAt: raw?.createdAt ?? "",
      comments: Array.isArray(raw?.comments) ? raw.comments : [],
      xp: raw?.postXp ?? raw?.xp ?? 0,
    };
  }, []);

  const allItems = useMemo(
    () => (posts ?? []).map(normalizeFromStore),
    [posts, normalizeFromStore]
  );

  const buildPostForModal = useCallback((item) => {
    return {
      id: item.id,
      images: item.images ?? [],
      author: {
        nickname: item.nickname ?? "익명",
        level: item.level ?? 1,
      },
      likes: item.likes ?? 0,
      createdAt: item.createdAt ?? "",
      recipeTitle: item.recipeName ?? "",
      content: item.content ?? "",
      ingredients: item.ingredients ?? [],
      xp: item.xp ?? 0,
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

  const [likedMap, setLikedMap] = useState({});

  // 정렬 + 필터된 결과
  const displayItems = useMemo(() => {
    const merged = allItems.map((item) => {
      const likedState = likedMap[item.id];

      if (!likedState) return item;

      return {
        ...item,
        likes: likedState.likeCount,
        isLiked: likedState.liked,
      };
    });

    const filtered = merged.filter((it) =>
      matchesKeyword(it, searchState.keyword)
    );

    const sorted = [...filtered];

    if (searchState.sort === "popular") {
      sorted.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    } else {
      sorted.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }

    return sorted;
  }, [allItems, likedMap, matchesKeyword, searchState]);

  // 카드 클릭: 내 글이면 MyPostModal / 아니면 CommunityPostModal
  const handleOpenAnyPostModal = useCallback(
    (item) => {
      const post = buildPostForModal(item);
      const isMine = !!meNickname && post.author?.nickname === meNickname;

      if (isMine) {
        requireLogin(() => {
          setSelectedPost(post);
          setIsMyPostModalOpen(true);
          setIsOtherPostModalOpen(false);
        });
        return;
      }

      setSelectedPost(post);
      setIsOtherPostModalOpen(true);
      setIsMyPostModalOpen(false);
    },
    [buildPostForModal, meNickname, requireLogin]
  );

  const handleCloseModals = useCallback(() => {
    setIsOtherPostModalOpen(false);
    setIsMyPostModalOpen(false);
    setSelectedPost(null);
  }, []);

  // 쿼리스트링으로 모달 열기(postId) - 테스트용
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

    handleOpenAnyPostModal(item);
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
    [requireLogin, meNickname]
  );

  // ===== 댓글 수정/삭제 =====
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
            c === comment ? { ...c, text: trimmed, time: "방금 전" } : c
          );
          return { ...prev, comments: nextComments };
        });
      });
    },
    [requireLogin]
  );

  const handleDeleteComment = useCallback(
    (comment) => {
      requireLogin(() => {
        const ok = window.confirm("댓글을 삭제할까요?");
        if (!ok) return;

        setSelectedPost((prev) => {
          if (!prev) return prev;
          const nextComments = (prev.comments ?? []).filter((c) => c !== comment);
          return { ...prev, comments: nextComments };
        });
      });
    },
    [requireLogin]
  );

  // ===== 내 글 전용 액션들 =====
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
    [requireLogin]
  );

  const handleDeletePost = useCallback(
    (postId) => {
      requireLogin(() => {
        console.log("delete post:", postId);
        handleCloseModals();
      });
    },
    [requireLogin, handleCloseModals]
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
    [requireLogin]
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
    [requireLogin]
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
    [requireLogin]
  );

  // ===== 트렌딩 카드 클릭 =====
  const handleTrendingCardClick = useCallback(
    (item) => {
      handleOpenAnyPostModal(item);
    },
    [handleOpenAnyPostModal]
  );

  // ===== 좋아요 토글 =====
  const handleLikeToggle = useCallback(
    (item) => {
      requireLogin(async () => {
        try {
          const current = likedMap[item.id] ?? {
            liked: item.isLiked ?? false,
            likeCount: item.likes ?? 0,
          };

          const payload = {
            memberId: currentUser?.id,
            postId: item.id,
          };

          if (!payload.memberId) {
            setLoginModalOpen(true);
            return;
          }

          if (current.liked) {
            await deletePostLike(payload);
          } else {
            await createPostLike(payload);
          }

          const nextLiked = !current.liked;
          const nextLikeCount = current.likeCount + (nextLiked ? 1 : -1);

          setLikedMap((prev) => ({
            ...prev,
            [item.id]: {
              liked: nextLiked,
              likeCount: nextLikeCount,
            },
          }));
        } catch (error) {
          console.error("좋아요 처리 실패:", error);
          alert(error.message);
        }
      });
    },
    [requireLogin, likedMap, currentUser]
  );

  // keyword 를 URL에서 읽어서 searchState에 동기화
  useEffect(() => {
    const keywordFromUrl = searchParams.get("keyword") || "";
    const sortFromUrl = searchParams.get("sort") || "latest";

    setSearchState((prev) => {
      if (prev.keyword === keywordFromUrl && prev.sort === sortFromUrl) {
        return prev;
      }
      return {
        ...prev,
        keyword: keywordFromUrl,
        sort: sortFromUrl,
      };
    });
  }, [searchParams]);

  return (
    <S.Page>
      <div id="community-top" />

      <S.Container>
        <CommunityHeader
          initialKeyword={searchState.keyword}
          initialSort={searchState.sort}
          onSearch={({ keyword, sort }) => {
            setSearchState({ keyword, sort });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </S.Container>

      <S.FullDivider />

      <S.Container>
        <TrendingCarousel
          posts={displayItems}
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
        requireLogin={requireLogin}
        isAuthenticated={isLoggedIn}
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