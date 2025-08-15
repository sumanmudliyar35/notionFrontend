import { Input } from "antd";
import styled from "styled-components";

export const FiltersDiv = styled.div`
display: flex;
flex-wrap: wrap;

    align-items: center;
    gap: 10px;


`;


export const FilterAndHideCommentsDiv = styled.div`
    display: flex;  


    align-items: center;
    gap: 10px;
    `;


    export const singleDateDiv = styled.div`
    display: flex;
    width: 160px;


    `;


    export const searchInputDiv = styled.div`
    display: flex;  

    `;


export const WhitePlaceholderInput = styled(Input)`
  &::placeholder {
    color: white;
    opacity: 1; /* Optional: ensures full visibility */
  }

  background: rgb(25, 25, 25);
  color: white;
  border: transparent;
`;


export const FilterTag = styled.div<{ active?: boolean; disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border: 1px solid
    ${({ active, disabled }) =>
      disabled ? '#555' : active ? '#1890ff' : '#444'};
  background: ${({ disabled }) => (disabled ? 'transparent' : '#141414')};
  color: ${({ active, disabled }) =>
    disabled ? '#666' : active ? '#1890ff' : '#ccc'};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  gap: 6px;

  svg {
    font-size: 12px;
  }

  &:hover {
    border-color: ${({ active, disabled }) =>
      disabled ? '#555' : active ? '#40a9ff' : '#666'};
    color: ${({ active, disabled }) =>
      disabled ? '#666' : active ? '#40a9ff' : '#eee'};
  }
`;


export  const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  // width: 100%;
`;

export const CommentToggleButton = styled.button`
  background-color: #1f1f1f;
  color: #f0f0f0;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2a2a2a;
    border-color: #1890ff;
  }
  
  &:active {
    background-color: #252525;
  }
`;

export const recursiveTaskContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;


`;


export const usersAssignedTimeDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: flex-start;
gap: 16px;
`