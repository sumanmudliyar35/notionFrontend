import styled from 'styled-components';
import { Input } from 'antd';
import { Select } from 'antd';
import CustomSwitch from '../../components/customSwitch/CustomSwitch';



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





export const WhitePlaceholderInput = styled(Input)`
  &::placeholder {
    color: white;
    opacity: 1; /* Optional: ensures full visibility */
  }

  background: rgb(25, 25, 25);
  color: white;
  border: transparent;
`;



export const DarkSelect = styled(Select)`
  .ant-select-selector {
    background-color: rgb(25, 25, 25) !important;
    color: white !important;
    border-color: transparent !important;
  }

  .ant-select-selection-placeholder {
    color: white !important;
  }

  .ant-select-arrow {
    color: white;
  }

  .ant-select-dropdown {
    background-color: rgb(25, 25, 25);
    color: white;
  }
`;


export const FilterAndSwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
    margin-bottom: 16px;
  `;

 export  const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  // width: 100%;
`;

const FilterSwitch = styled(CustomSwitch)`
  transform: scale(0.7);
  margin-left: 8px;
`;

// Add this to your style.ts file
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

export const FiltersDiv = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  
  /* Add a subtle transition for visual feedback */
  transition: opacity 0.3s;
  position: relative;
  
  ${({ disabled }) => disabled && `
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      cursor: not-allowed;
    }
  `}
`;


export const DateDiv = styled.div`
  display: flex;




  
    `;


    export const singleDateDiv = styled.div`
    display: flex;
    width: 160px;


    `;