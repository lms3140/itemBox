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
