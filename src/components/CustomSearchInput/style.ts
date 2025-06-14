import styled from 'styled-components';

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
`;

export const StyledWhiteInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  outline: none;
  background: black;
  color: white;
  font-size: 15px;
  transition: border 0.2s;
  box-sizing: border-box;

  &::placeholder {
    color: #aaa;
    opacity: 1;
  }
`;

export const Label = styled.label`
  margin-bottom: 4px;
  color: #eee;
  font-size: 13px;
`;

export const ErrorText = styled.div`
  color: #ff4757;
  font-size: 12px;
  margin-top: 2px;
`;