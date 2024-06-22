import React, { FC } from 'react';
import { Button } from 'antd';

interface CustomButtonProps {
  type: 'primary' | 'default' | 'link' | 'text' | 'dashed';
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}

const CustomButton: FC<CustomButtonProps> = ({ type, onClick, danger = false, children }) => {
  return (
    <Button type={type} onClick={onClick} danger={danger}>
      {children}
    </Button>
  );
};

export default CustomButton;
