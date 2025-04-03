import { InputHTMLAttributes } from "react";

type inputLabel = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputLabel({ label, ...inputProps }: inputLabel) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />
    </div>
  );
}
