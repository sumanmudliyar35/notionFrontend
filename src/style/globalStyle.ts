import { createGlobalStyle } from 'styled-components';

export const CustomSelectStyles = createGlobalStyle`
  .custom-select-dropdown {
    background-color: black !important;
  }

  .custom-select-dropdown .ant-select-item {
    color: white !important;
  }

  .custom-select-dropdown .ant-select-item-option-selected,
  .custom-select-dropdown .ant-select-item-option-active {
    background-color: #333 !important;
    color: white !important;
  }

  /* Make Popconfirm text white and background dark */
  .ant-popover-inner {
    background: #202020 !important;
    color: #fff !important;
  }
  .ant-popconfirm-title {
    color: #fff !important;
  }
  .ant-popconfirm-message {
    color: #fff !important;
  }
`;



