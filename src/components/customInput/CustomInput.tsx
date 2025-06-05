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
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  type = 'text',
}) => {
  return (
    <styled.InputWrapper>
      {label && <styled.Label htmlFor={name}>{label}</styled.Label>}
      <styled.StyledWhiteInput
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        type={type}
      />
      {error && <styled.ErrorText>{error}</styled.ErrorText>}
    </styled.InputWrapper>
  );
};

export default CustomInput;
