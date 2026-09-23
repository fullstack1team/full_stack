// 중복적인 데이터를 불러오는 함수들은 api 폴더에 모아둠


import { API_BASE_URL as BASE_URL } from "../config/api";

// 프론트 -> postId만 보냄
// 백엔드 -> req.user에서 memberId 꺼냄 (JWT)

// [프론트]
// ↓ (postId + 쿠키)
// [백엔드]
// ↓
// JWT에서 memberId 꺼냄
// ↓
// postId + memberId로 처리

// 좋아요 생성
export const createPostLike = async ({ postId }) => {
  const response = await fetch(`${BASE_URL}/postlike`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ postId }),
  })

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "좋아요 생성에 실패했습니다.");
  }

  return data;
};

// 좋아요 삭제
export const deletePostLike = async ({ postId }) => {
  const response = await fetch(`${BASE_URL}/postlike`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ postId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "좋아요 삭제에 실패했습니다.");
  }

  return data;
};