import React, { useMemo } from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import usePostStore from "../../store/postStore";
import useAuthStore from "../../store/authStore";
import FeedGrid from "../../components/communitycomponents/FeedGrid";
import S from "./style";

const MyPosts = () => {
  const { posts } = usePostStore();
  const { member, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // useMemo는 항상 먼저 실행
  const myItems = useMemo(() => {
    if (!member) return [];

    return posts
        .filter((p) => (p.memberId ?? p.member?.id) === member.id) // 백엔드 구조(member.id) 체크
        .map((post) => ({
          id: post.id,
          recipeName: post.recipe?.recipeTitle ?? post.recipeTitle ?? "요리명 없음",
          nickname: post.member?.memberName || member.memberName || post.nickname,
          level: post.member?.level ?? post.author?.level ?? 1,
          likes: post.likes ?? post._count?.postLike ?? 0,
          images: post.postImage ?? post.images ?? [],
          content: post.postContent ?? post.content,
          ingredients: post.postIngredientUsed?.map((i) => i.ingredient?.ingredientName) ?? post.ingredients ?? [],
          createdAt: post.createdAt,
          comments: post.comment ?? [],
        }));
    }, [posts, member]);

  // Hook 아래에서 로그인 체크
  if (!isAuthenticated || !member) {
    return <Navigate to="/login" replace />;
  }

  const handleCardClick = (item) => {
    navigate(`/myposts/post/${item.id}`);
  };

return (
  <S.Page>
      <S.Container>

        {/* ===== 헤더 ===== */}
        <S.HeaderSection>
          <S.Title>나의 커뮤니티 게시물</S.Title>
        </S.HeaderSection>

        <S.FullDivider />

        {/* ===== 피드 영역 ===== */}
        <S.FeedGridSection>
          {myItems.length === 0 ? (
            <S.EmptyText>
              작성한 게시글이 없습니다.
            </S.EmptyText>
          ) : (
            <FeedGrid
              items={myItems}
              meNickname={member?.nickname}
              onCardClick={handleCardClick}
            />
          )}
        </S.FeedGridSection>

        <Outlet />
      </S.Container>
    </S.Page>
);
};

export default MyPosts;