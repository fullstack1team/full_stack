// 중복적인 데이터를 불러오는 함수들은 api 폴더에 모아둠

const BASE_URL = "http://localhost:10000";

// 좋아요 생성
export const createPostLike = async ({ memberId, postId }) => {
  const response = await fetch(`${BASE_URL}/postlike`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memberId, postId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "좋아요 생성에 실패했습니다.");
  }

  return data;
};

// 좋아요 삭제
export const deletePostLike = async ({ memberId, postId }) => {
  const response = await fetch(`${BASE_URL}/postlike`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memberId, postId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "좋아요 삭제에 실패했습니다.");
  }

  return data;
};