type inputLabel = {
  label: string;
  name: string;
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  required?: boolean;
};

export default function InputLabel({
  label,
  name,
  type,
  placeholder,
  required,
}: inputLabel) {
  return (
    <div>
      <label>{label}</label>
      <input
        required={required}
        type={type}
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
}
