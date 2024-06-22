import React, { FC } from 'react';
import { Input } from 'antd';

interface CustomInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const CustomInput: FC<CustomInputProps> = ({ value, onChange, placeholder }) => {
  return <Input value={value} onChange={onChange} placeholder={placeholder} />;
};

export default CustomInput;

