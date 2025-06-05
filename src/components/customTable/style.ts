import styled, { createGlobalStyle } from "styled-components";
import { Select } from 'antd';


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

  // .ant-select-dropdown {
  //   background-color: rgb(25, 25, 25);
  //   color: white;
  // }

   .ant-select-dropdown {
    background-color: rgb(25, 25, 25) !important; /* Dropdown list background */
  }


`;


export const CustomTableDropdownStyle = createGlobalStyle`
  .custom-dark-dropdown {
    background: rgb(37, 37, 37) !important;
  }
`;