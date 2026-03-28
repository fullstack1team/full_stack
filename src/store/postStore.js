import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePostStore = create(
  persist(
    (set) => ({
      posts: [],

      fetchPosts: async () => {
        try {
          const res = await fetch("http://localhost:10000/posts")
          
          if (!res.ok) {
            throw new Error("서버 오류")
          }
          
          const data = await res.json()
          console.log("스토어에 넣는 데이터:", data)

          set({ posts: data })
        } catch (error) {
          console.log("게시글 불러오기 실패:", error)
        }
      },

      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
        })),

      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),

      updatePost: (id, patch) =>
        set((state) => ({
          posts: state.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
    }),
    {
      name: "post-storage",
    },
  ),
);

export default usePostStore;
