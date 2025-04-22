import styled from "styled-components";

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.fg.disabled};
  border-radius: 10px;
  border: 1px solid white;
  margin: 2px;
  padding: 2px;
  box-sizing: border-box;
  text-align: center;
`;

const Title = styled.div``;

const Content = styled.div``;

type InfoItemProps = {
  title: string;
  content?: string;
  className?: string;
};

function InfoItem({ title, content, className }: InfoItemProps) {
  return (
    <Wrapper className={className}>
      <Title>{title}</Title>
      <Content>{content}</Content>
    </Wrapper>
  );
}

export default InfoItem;
