import { HTMLMotionProps, motion } from "motion/react";
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
export default function CustomButton({
  variant = "normal",
  children,
  ...props
}: TCustomButtonProps) {
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
