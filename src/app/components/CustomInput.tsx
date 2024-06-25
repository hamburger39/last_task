import React, { FC, ChangeEvent } from 'react';
import { Input } from 'antd';

interface CustomInputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
}

const CustomInput: FC<CustomInputProps> = ({ label, value, onChange, id, name }) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <Input id={id} name={name} value={value} onChange={onChange} />
  </div>
);

export default CustomInput;

