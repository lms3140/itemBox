import { Outlet } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import { useThemeStore } from "./store/zustandStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, spring } from "motion/react";

const GlobalStyle = createGlobalStyle`

  /* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  input{
    border:none;
  }

  label{
    display: block;
  }

  button{
    border: none;
  }

  body{
    background-color: ${({ theme }) => theme.colors.bg};
    color:${({ theme }) => theme.colors.text};
  }
  input{
    background-color: ${({ theme }) => theme.colors.fg};
    color:${({ theme }) => theme.colors.text};
  }


`;

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
  justify-content: flex-end;
  padding-right: 40px;
`;

const queryClient = new QueryClient();
function Layout() {
  const { isDark, setTheme } = useThemeStore();
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
