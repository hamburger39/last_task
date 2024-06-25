import React, { FC, ReactNode } from 'react';
import { Modal } from 'antd';

interface CustomModalProps {
  isOpen: boolean;
  handleCancel: () => void;
  title: string;
  handleOk: () => void;
  children: ReactNode;
}

const CustomModal: FC<CustomModalProps> = ({ isOpen, handleCancel, title, handleOk, children }) => (
  <Modal open={isOpen} onCancel={handleCancel} onOk={handleOk} title={title}>
    {children}
  </Modal>
);

export default CustomModal;

