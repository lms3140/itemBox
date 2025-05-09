import { HTMLMotionProps, motion } from "motion/react";
import { JSX } from "react";
import styled from "styled-components";

type TVariant = "primary" | "danger" | "normal";

const Btn = styled(motion.button)<{ $variant?: TVariant }>`
  background-color: ${({ theme, $variant = "normal" }) =>
    theme.btn.variant[$variant]};
  color: ${({ theme, $variant = "normal" }) => theme.btn.text[$variant]};
  width: 50px;
  height: 30px;
  border-radius: 30px;
  cursor: pointer;

  &:hover {
    filter: brightness(85%);
  }
`;

type TCustomButtonProps = {
  /** 버튼의 타입 ("primary" | "danger" | "normal") */
  variant?: TVariant;
  children?: React.ReactNode;
} & HTMLMotionProps<"button">;

/**
 *
 * motion.button 기반의 버튼입니다.
 *
 * @param {TCustomButtonProps} props
 * @param {TVariant} props.variant - 버튼의 타입 ("primary","danger","normal")
 * @param {React.ReactNode} [props.children] - 버튼 내부에 표시될 텍스트 또는 컴포넌트
 * @param {HTMLMotionProps<"button">} ...props - button 태그에서 사용 가능한 기본 속성
 * @returns {JSX.Element}
 */
export default function CustomButton({
  variant = "normal",
  children,
  ...props
}: TCustomButtonProps): JSX.Element {
  return (
    <Btn
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      $variant={variant}
      {...props}
    >
      {children}
    </Btn>
  );
}
