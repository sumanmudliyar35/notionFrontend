import { Modal } from 'antd';
import styled from 'styled-components';


export const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: #202020;
    color: white;
    max-height: 70vh;
    overflow-y: auto;
  }

  .ant-modal-header {
    background-color: #202020;
    border-bottom: 1px solid #333;
  }

  .ant-modal-title {
    color: white;
  }

  .ant-modal-footer {
    background-color: #202020;
    border-top: 1px solid #333;
  }

   .ant-modal-close {
    color: lightgray; /* sets icon color */
  }
`;