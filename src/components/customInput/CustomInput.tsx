// components/customInput/CustomInput.tsx
import React from 'react';
import * as styled from './style';

interface CustomInputProps {
  label?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // <-- Add this line

  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  onKeyDown, // <-- Add this line
  error,
  placeholder,
  type = 'text',
  inputProps={}
}) => {
  // Remove or convert 'size' if it's a number, as StyledWhiteInput expects a specific SizeType
  const { size, ...restInputProps } = inputProps;
  const inputPropsToPass =
    typeof size === 'number' ? restInputProps : inputProps;

  return (
    <styled.InputWrapper>
      {label && <styled.Label htmlFor={name}>{label}</styled.Label>}
      <styled.StyledWhiteInput
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown} // <-- Add this line

        placeholder={placeholder}
        type={type}
        {...inputPropsToPass} // <-- This line is required!

      />
      {error && <styled.ErrorText>{error}</styled.ErrorText>}
    </styled.InputWrapper>
  );
};

export default CustomInput;
