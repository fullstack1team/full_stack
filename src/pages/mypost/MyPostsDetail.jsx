// MyPostsDetail.jsx
import React from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import usePostStore from "../../store/postStore";
import useAuthStore from "../../store/authStore";
import MyPostModal from "../../components/communitycomponents/MyPostModal";

const MyPostsDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { posts } = usePostStore();
  const { member, isAuthenticated } = useAuthStore(); // user -> member

  // 1. 로그인 검증
  if (!isAuthenticated || !member) {
    return <Navigate to="/login" replace />;
  }

  // 2. 게시글 찾기 (p.author?.id 대신 p.memberId 또는 p.member?.id 사용)
  const post = posts.find(
    (p) => p.id === Number(postId) && (p.memberId ?? p.member?.id) === member.id
  );

  if (!post) {
    return <Navigate to="/myposts" replace />;
  }

  // 3. 모달에 넘겨줄 post 객체의 닉네임 정보 보장
  const formattedPost = {
    ...post,
    author: {
      ...post.author,
      // 백엔드의 member.memberName을 최우선으로 보장
      nickname: post.member?.memberName || member.memberName || post.author?.nickname,
    },
  };

  return (
    <MyPostModal
      open={true}
      post={formattedPost}
      onClose={() => navigate(-1)}
    />
  );
};

export default MyPostsDetail;