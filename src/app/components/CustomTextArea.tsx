import React, { FC, ChangeEvent } from 'react';
import { Input } from 'antd';

interface CustomTextAreaProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  id?: string;
  name?: string;
}

const CustomTextArea: FC<CustomTextAreaProps> = ({ label, value, onChange, id, name }) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <Input.TextArea id={id} name={name} value={value} onChange={onChange} />
  </div>
);

export default CustomTextArea;

