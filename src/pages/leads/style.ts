import styled from 'styled-components';
import { Input } from 'antd';
import { Select } from 'antd';



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


export const FiltersDiv = styled.div`
display: flex;
flex-wrap: wrap;

margin-bottom: 16px;
    align-items: center;
    gap: 10px;


`


export const DateDiv = styled.div`
  display: flex;




  
    `;


    export const singleDateDiv = styled.div`
    display: flex;
    width: 160px;


    `;