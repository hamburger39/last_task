import React, { FC } from 'react';
import { Input } from 'antd';

interface CustomInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

const CustomInput: FC<CustomInputProps> = ({ placeholder, value, onChange, required = false, className }) => {
  return (
    <Input placeholder={placeholder} value={value} onChange={onChange} required={required} className={className} />
  );
};

export default CustomInput;



