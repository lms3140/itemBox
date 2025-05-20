import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Outlet, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import styled, { ThemeProvider } from "styled-components";
import { useAuthStore, useThemeStore } from "../store/zustandStore";
import { GlobalStyle } from "../styles/globalStyle";
import { darkTheme, lightTheme } from "../styles/theme";
import { useEffect } from "react";
import CustomButton from "../components/CustomButton";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleWrapper = styled.div`
  margin: 30px;
`;

const Title = styled.h1`
  font-size: 30px;
`;

const ThemeBtn = styled(motion.button)<{ $isDark: boolean }>`
  width: 75px;
  display: flex;
  background-color: ${({ theme }) => theme.btn.variant.normal};
  justify-content: ${({ $isDark }) => (!$isDark ? "flex-start" : "flex-end")};
  font-size: 25px;
  border-radius: 20px;
  margin: 10px 0;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  padding-left: 40px;
  align-items: center;
`;

const queryClient = new QueryClient();
function Layout() {
  const { isDark, setTheme } = useThemeStore();
  const { tokenObj, removeToken } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokenObj === null) {
      navigate("/login");
    }
  }, [tokenObj]);
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Wrapper>
        <Header className="test">
          <ThemeBtn
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
          </ThemeBtn>
          <div>
            <CustomButton variant="danger" onClick={() => removeToken()}>
              로그아웃
            </CustomButton>
          </div>
        </Header>
        <TitleWrapper>
          <Title>거래목록</Title>
        </TitleWrapper>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </Wrapper>
    </ThemeProvider>
  );
}

export default Layout;
