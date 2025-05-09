import { JSX } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import styled from "styled-components";

const ErrorMessage = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.error};
`;

const InputWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  input {
    background-color: ${({ theme }) => theme.colors.fg.active};
  }
`;

type InputProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  msg?: string | undefined;
  type?: React.HTMLInputTypeAttribute;
};

/**
 *
 * input과 label 그리고 에러 메세지를 통합한 컴포넌트 입니다.
 *
 * 유효성 검증은 zod를 기반으로 처리합니다다.
 *
 * @example
 * <Input label="이름" name="name" register={register} msg={errors.name?.message} />
 *
 * @param {InputProps} props
 * @param {string} props.label - input의 라벨 텍스트
 * @param {Path<T>} props.name - React Hook Form의 register(name)에 들어갈 name
 * @param {React.HTMLInputTypeAttribute} props.type - input의 타입 (예:'text', 'email')
 * @param {UseFormRegister<T>} props.register - React Hook Form의 useForm register
 * @param {string|undefined} [props.msg] - 유효성 검증 에러메세지
 * @returns {JSX.Element}
 */
export default function Input<T extends FieldValues>({
  label,
  name,
  type = "text",
  register,
  msg,
}: InputProps<T>): JSX.Element {
  return (
    <InputWrapper>
      <label>{label}</label>
      <input
        autoComplete="off"
        type={type}
        placeholder={label}
        {...register(name)}
      />
      {msg && <ErrorMessage>{msg}</ErrorMessage>}
    </InputWrapper>
  );
}
