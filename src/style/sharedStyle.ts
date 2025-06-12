import { Input } from "antd";
import styled from "styled-components";


export const SharedStyledWhiteInput = styled(Input)`
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


export const SharedInputWrapper = styled.div`
  display: flex;    
  flex-direction: column;
  gap: 8px;


  `;