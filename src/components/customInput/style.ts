// components/customInput/CustomInputStyle.ts
import styled from 'styled-components';
import { Input } from 'antd';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 6px;
  color: white;
  font-weight: 500;
`;

export const StyledWhiteInput = styled(Input)`
  &::placeholder {
    color: white;
    opacity: 1;
  }

  background: rgb(25, 25, 25);
   color: white;
  border: transparent;

  &:hover,
  &:focus {
   background: rgb(25, 25, 25);
   color: white;
    border-color: #555;
    box-shadow: none;
  }
`;

export const ErrorText = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
`;
