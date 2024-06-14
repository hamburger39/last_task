import React, { FC } from "react";
import { Checkbox, CheckboxProps } from "antd";

interface CustomCheckboxProps extends CheckboxProps {}

const CustomCheckbox: FC<CustomCheckboxProps> = (props) => {
  return <Checkbox {...props} />;
};

export default CustomCheckbox;

