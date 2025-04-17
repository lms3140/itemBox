import { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

type TVariant = "primary" | "danger" | "normal";

const Btn = styled.button<{ variant?: TVariant }>`
  background-color: ${({ theme, variant = "normal" }) =>
    theme.btn.variant[variant]};
  color: ${({ theme, variant = "normal" }) => theme.btn.text[variant]};

  width: 50px;
  height: 30px;
  border-radius: 30px;
  cursor: pointer;
`;

type btnProps = {
  /** 버튼의 종류 */
  variant?: TVariant;
  children?: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;
export default function CustomButton({
  variant = "normal",
  children,
  ...props
}: btnProps) {
  return (
    <Btn variant={variant} {...props}>
      {children}
    </Btn>
  );
}
