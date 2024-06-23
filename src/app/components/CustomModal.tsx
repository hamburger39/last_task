import React, { FC, ReactNode } from 'react';
import { Modal } from 'antd';

interface CustomModalProps {
  title: string;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  children: ReactNode;
  okText?: string;
  cancelText?: string;
  okButtonProps?: { [key: string]: any };
}

const CustomModal: FC<CustomModalProps> = ({ title, open, onOk, onCancel, children, okText = '承認', cancelText = 'キャンセル', okButtonProps }) => {
  return (
    <Modal title={title} open={open} onOk={onOk} onCancel={onCancel} okText={okText} cancelText={cancelText} okButtonProps={okButtonProps}>
      {children}
    </Modal>
  );
};

export default CustomModal;


