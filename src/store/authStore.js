import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    combine({
      member: null,
      isAuthenticated: false,
    }, 
    (set) => ({
      setIsAuthenticated: (status) => set({ isAuthenticated: status }),
      setMember: (member) => set({ member }),  
    })),
    {
      name: 'auth-storage', // localStorage key
      // partialize: localStorage에 저장할 값만 골라내는 필터
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        member: state.member, 
      }),
    }
  )
);

export default useAuthStore;
