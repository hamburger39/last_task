import React, { FC } from 'react';
import { Modal } from 'antd';

interface CustomModalProps {
  title: string;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const CustomModal: FC<CustomModalProps> = ({ title, visible, onOk, onCancel, children }) => {
  return (
    <Modal title={title} visible={visible} onOk={onOk} onCancel={onCancel}>
      {children}
    </Modal>
  );
};

export default CustomModal;

