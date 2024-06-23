import React, { FC } from 'react';
import { Button } from 'antd';

interface CustomButtonProps {
  type: 'primary' | 'default' | 'link' | 'text' | 'dashed';
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean; 
  children: React.ReactNode;
  className?: string;
}

const CustomButton: FC<CustomButtonProps> = ({ type, onClick, danger = false, disabled = false, children, className }) => {
  return (
    <Button type={type} onClick={onClick} danger={danger} disabled={disabled} className={className}>
      {children}
    </Button>
  );
};

export default CustomButton;

