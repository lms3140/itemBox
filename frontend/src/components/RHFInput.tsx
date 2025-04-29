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
  type?: React.HTMLInputTypeAttribute | undefined;
};

export default function Input<T extends FieldValues>({
  label,
  name,
  type = "text",
  register,
  msg,
}: InputProps<T>) {
  return (
    <InputWrapper>
      <label>{label}</label>
      <input type={type} placeholder={label} {...register(name)} />
      {msg && <ErrorMessage>{msg}</ErrorMessage>}
    </InputWrapper>
  );
}
