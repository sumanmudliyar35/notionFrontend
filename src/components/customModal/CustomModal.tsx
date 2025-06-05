import React from 'react';
import { Modal } from 'antd';
import * as styled from './style';
interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
}



const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title = '',
  children,
  footer = null,
  width = 520,
}) => {
  return (
    <styled.StyledModal
      open={open}
      onCancel={onClose}
      title={title}
      footer={footer}
      width={width}
    >
      {children}
    </styled.StyledModal>
  );
};

export default CustomModal;
