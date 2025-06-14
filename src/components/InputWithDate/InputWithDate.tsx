import React from "react";

interface InputWithDateProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const InputWithDate: React.FC<InputWithDateProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder = "Select date",
  required = false,
}) => (
  <div >
    {label && (
      <label htmlFor={name} style={{ color: "#fff", display: "block", }}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
    )}
    <input
      id={name}
      name={name}
      type="date"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: 4,
        border: "1px solid #23272f",
        background: "#181818",
        color: "#fff",
        fontFamily: "sans-serif",

      }}
      onFocus={e => {
        // Open native date picker on focus (supported in Chrome, Edge, etc.)
        e.target.showPicker && e.target.showPicker();
      }}
      required={required}
    />
    {error && (
      <div style={{ color: "red", marginTop: 4, fontSize: 12 }}>{error}</div>
    )}
  </div>
);

export default InputWithDate;