import React, { FC, ReactNode } from 'react';
import { Modal } from 'antd';

interface CustomModalProps {
  isOpen: boolean;
  handleCancel: () => void;
  title: string;
  handleOk: () => void;
  okText?: string;
  cancelText?: string;
  children: ReactNode;
}

const CustomModal: FC<CustomModalProps> = ({ isOpen, handleCancel, title, handleOk, okText = 'OK', cancelText = 'キャンセル', children }) => (
  <Modal open={isOpen} onCancel={handleCancel} onOk={handleOk} title={title} okText={okText} cancelText={cancelText}>
    {children}
  </Modal>
);

export default CustomModal;

