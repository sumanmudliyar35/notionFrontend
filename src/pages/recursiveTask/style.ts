import styled from "styled-components";

export const FiltersDiv = styled.div`
display: flex;
flex-wrap: wrap;

margin-bottom: 16px;
    align-items: center;
    gap: 10px;


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