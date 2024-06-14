import { Button, ButtonProps } from "antd";
import { FC } from "react";

interface CustomButtonProps extends ButtonProps {
  icon?: React.ReactNode;
}

const CustomButton: FC<CustomButtonProps> = ({ children, icon, ...props }) => {
  return (
    <Button {...props} icon={icon}>
      {children}
    </Button>
  );
};

export default CustomButton;