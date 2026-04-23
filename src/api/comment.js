const BASE_URL = "http://localhost:10000";

// 댓글 생성
export const createComment = async ({ postId, content }) => {
  const response = await fetch(`${BASE_URL}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ postId, content }),
  });

  let errorMessage = "댓글 생성 실패";

  if (!response.ok) {
    try {
      const data = await response.json();
      console.log("댓글 생성 실패 응답:", data);
      errorMessage = data.message || errorMessage;
    } catch {
      const text = await response.text();
      console.log("댓글 생성 실패 응답(text):", text);
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// 게시글별 댓글 조회
export const getCommentsByPostId = async (postId) => {
  const response = await fetch(`${BASE_URL}/comment/post/${postId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("댓글 조회 실패");
  }

  return response.json();
};

// 댓글 수정
export const updateComment = async (commentId, content) => {
  const response = await fetch(`${BASE_URL}/comment/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("댓글 수정 실패");
  }

  return response.json();
};

// 댓글 단일 삭제
export const deleteComment = async (commentId) => {
  const response = await fetch(`${BASE_URL}/comment/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("댓글 삭제 실패");
  }

  return response.json();
};

// 게시글별 댓글 전체 삭제
export const deleteAllCommentsByPostId = async (postId) => {
  const response = await fetch(`${BASE_URL}/comment/post/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("게시글 댓글 전체 삭제 실패");
  }

  return response.json();
};

// 선택 댓글 삭제
export const deleteSelectedComments = async (commentIds) => {
  const response = await fetch(`${BASE_URL}/comment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ commentIds }),
  });

  if (!response.ok) {
    throw new Error("선택 댓글 삭제 실패");
  }

  return response.json();
};