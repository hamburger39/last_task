import React, { FC } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

interface CustomTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

const CustomTextArea: FC<CustomTextAreaProps> = ({ value, onChange, placeholder, rows }) => {
  return <TextArea value={value} onChange={onChange} placeholder={placeholder} rows={rows} />;
};

export default CustomTextArea;

