const BASE_URL = "http://localhost:10000";

// 게시글 전체 조회
export const getPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "GET",
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error("게시글 전체 조회 실패")
  }

  return response.json()
}

// 게시글 단일 조회
export const getPostDetail = async (postId) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "GET",
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error("게시글 단일 조회 실패")
  }

  return response.json()
}

// 게시글 생성
export const createPost = async (postData) => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(postData)
  })

  if (!response.ok) {
    throw new Error("게시글 생성 실패")
  }

  // 백엔드가 return 없이 void면 응답 body 없을 수도 있어서 안전 처리(Unexpected end of JSON input 오류 방지)
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

// 게시글 수정
export const updatePost = async (postId, postData) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(postData)
  })

  if(!response.ok) {
    throw new Error("게시글 수정 실패")
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

// 게시글 삭제
export const deletePost = async (postId) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error("게시글 삭제 실패")
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}