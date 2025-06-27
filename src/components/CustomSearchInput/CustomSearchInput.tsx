import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import * as styled from './style'; // Adjust the import path as necessary

interface CustomSearchInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  allowClear?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

const CustomSearchInput: React.FC<CustomSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  style,
  allowClear = true,
  ref,
}) => {
  return (
    <styled.InputWrapper style={{ position: 'relative', ...style }}>
      <styled.StyledWhiteInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ paddingRight: 32 }}
        ref={ref}
      />
      <span
        style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#aaa',
          pointerEvents: 'none',
        }}
      >
        <SearchOutlined />
      </span>
      {allowClear && value && (
        <span
          style={{
            position: 'absolute',
            right: 32,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#aaa',
            cursor: 'pointer',
            fontSize: 14,
            background: 'transparent',
          }}
          onClick={() => onChange?.({ target: { value: '' } } as any)}
        >
          ×
        </span>
      )}
    </styled.InputWrapper>
  );
};

export default CustomSearchInput;