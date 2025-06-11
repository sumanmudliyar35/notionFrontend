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
