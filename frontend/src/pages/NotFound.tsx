import { useEffect } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

const Wrapper = styled.div``;

function NotFound() {
  const nav = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      nav(-1);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return <Wrapper>잘못된 페이지 입니다.</Wrapper>;
}

export default NotFound;
