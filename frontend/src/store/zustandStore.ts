import { create } from "zustand";
import { persist } from "zustand/middleware";

// zustand Store type 정의
type themeStore = {
  isDark: boolean;
  setTheme: () => void;
};

// Theme 관리를 위한 zustand Store 선언
// persist 미들웨어로 간단하게 theme 저장 가능!!
export const useThemeStore = create<themeStore>()(
  persist(
    (set) => ({
      isDark: false,
      setTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: "theme-storage",
    }
  )
);

type access_token = {
  access_token: string;
  id: string;
  nickname: string;
};

type authStore = {
  tokenObj: access_token | null;
  setToken: (t: access_token) => void;
  removeToken: () => void;
};

export const useAuthStore = create<authStore>()(
  persist(
    (set) => ({
      tokenObj: null,
      setToken: (token: access_token) => set(() => ({ tokenObj: token })),
      removeToken: () => set(() => ({ tokenObj: null })),
    }),
    { name: "access_token" }
  )
);
