import styled, { createGlobalStyle } from "styled-components";
import { Input, Select } from 'antd';

export const DarkSelect = styled(Select)`
  .ant-select-selector {
    background-color: rgb(25, 25, 25) !important;
    color: white !important;
    border-color: transparent !important;
  }

  .ant-select-selection-placeholder {
    color: white !important;
  }
    .ant-select-dropdown {
  background: black !important;
}
.ant-select-item-option-content {
  color: white !important;
}

  .ant-select-arrow {
    color: white;
  }

  // Dropdown styles (applied to dropdown menu)
  .ant-select-dropdown {
    background-color: black !important;
    color: white !important;
  }

  // Dropdown item text color
  .ant-select-item {
    color: white !important;
  }

  // Selected or active item background
  .ant-select-item-option-selected,
  .ant-select-item-option-active {
    background-color: #333 !important;
  }
`;


export const tableActionsDiv= styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;


  `;

  export const StyledTableSearch = styled(Input.Search)`
  // && {
  //   background: black;
  //   input {
  //     background: black !important;
  //     color: white !important;
  //     border: none;
  //   }
  //   .ant-input {
  //     background: black !important;
  //     color: white !important;
  //     border: none;
  //   }
  //   .ant-input-search-button {
  //     background: #222 !important;
  //     color: white !important;
  //     border: none;
  //   }
  // }
`;


export const tableMainContainer = styled.div`
display: flex;
flex-direction: column;
gap: 10px;


`;


export const paginationContainer = styled.div`
  display: flex;  
  justify-content: flex-end;
  `;


  export const  topContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  `;


  export const searchAndManagerDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  `;