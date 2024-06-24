import React from 'react';
import { Modal, ModalProps } from 'antd';

interface CustomModalProps extends ModalProps {}

const CustomModal: React.FC<CustomModalProps> = ({ children, ...props }) => {
  return (
    <Modal {...props} style={{ ...props.style, padding: '16px' }}>
      {children}
    </Modal>
  );
};

export default CustomModal;

