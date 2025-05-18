import styled, { ThemeProvider } from "styled-components";
import { useAuthStore, useThemeStore } from "../store/zustandStore";
import { darkTheme, lightTheme } from "../styles/theme";
import { GlobalStyle } from "../styles/globalStyle";
import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

const Wrapper = styled.div``;

function LoginLayout() {
  const { isDark } = useThemeStore();
  const { tokenObj } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (tokenObj !== null) {
      navigate("/");
    }
  }, [tokenObj]);
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Wrapper>
        <Outlet />
      </Wrapper>
    </ThemeProvider>
  );
}

export default LoginLayout;
