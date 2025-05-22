import { motion } from "motion/react";
import styled from "styled-components";
import { useThemeStore } from "../store/zustandStore";

/**
 * Theme 스위칭 버튼
 */

const ThemeButton = styled(motion.button)<{ $isDark: boolean }>`
  width: 75px;
  display: flex;
  background-color: ${({ theme }) => theme.btn.variant.normal};
  justify-content: ${({ $isDark }) => (!$isDark ? "flex-start" : "flex-end")};
  font-size: 25px;
  border-radius: 20px;
  margin: 10px 0;
  cursor: pointer;
`;

function ThemeBtn() {
  const { isDark, setTheme } = useThemeStore();
  return (
    <ThemeButton
      animate
      onClick={() => {
        setTheme();
      }}
      $isDark={isDark}
    >
      <motion.div
        layout
        transition={{ type: "spring", visualDuration: 0.2, bounce: 0.2 }}
      >
        {isDark ? "🌕" : "☀️"}
      </motion.div>
    </ThemeButton>
  );
}

export default ThemeBtn;
