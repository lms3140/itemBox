import { create } from "zustand";

// zustand Store type 정의
type themeStore = {
  isDark: boolean;
  setTheme: () => void;
};

// Theme 관리를 위한 zustand Store 선언
export const useThemeStore = create<themeStore>()((set) => ({
  isDark: false,
  setTheme: () => set((state) => ({ isDark: !state.isDark })),
}));
