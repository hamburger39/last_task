import React from 'react';
import { Button, ButtonProps } from 'antd';

interface CustomButtonProps extends ButtonProps {}

const CustomButton: React.FC<CustomButtonProps> = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};

export default CustomButton;


