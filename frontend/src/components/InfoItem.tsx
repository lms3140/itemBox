import { JSX } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.fg.disabled};
  border-radius: 10px;
  border: 2px solid white;
  margin: 2px;
  padding: 2px;
  box-sizing: border-box;
  text-align: center;
  &.loss {
    border: 2px solid #ff6b6b;
    div:nth-child(2) {
      color: #ff6b6b;
    }
  }
  &.profit {
    border: 2px solid #4dabf7;
    div:nth-child(2) {
      color: #4dabf7;
    }
  }
`;

const Title = styled.div``;

const Content = styled.div``;

type InfoItemProps = {
  title: string;
  content?: string;
  className?: string;
};

/**
 * Detail 정보 표시용 컴포넌트
 *
 * Detail 페이지에서 항목명과 내용을 함께 출력시킬때 사용됩니다.
 *
 * content와 className은 선택적으로 전달 가능합니다.
 * @example
 * <InfoItem title="가격" content={"100원"} className="etc" />
 *
 * @component
 * @param {InfoItemProps} props
 * @param {string} props.title - 항목 이름
 * @param {string} [props.content] - 항목 내용
 * @param {string} [props.className] - styled-components 전달용 클래스
 * @returns {JSX.Element}
 */
const InfoItem = (props: InfoItemProps): JSX.Element => {
  return (
    <Wrapper className={props.className}>
      <Title>{props.title}</Title>
      <Content>{props.content}</Content>
    </Wrapper>
  );
};

export default InfoItem;
