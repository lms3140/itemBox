import { Outlet } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import styled from "styled-components";

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

const Layout = () => {
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>거래목록</Title>
      </TitleWrapper>
      <Outlet />
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
  );
};

export default Layout;
