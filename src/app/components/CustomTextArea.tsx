import React, { FC } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

interface CustomTextAreaProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const CustomTextArea: FC<CustomTextAreaProps> = ({ placeholder, value, onChange, className }) => {
  return (
    <TextArea placeholder={placeholder} value={value} onChange={onChange} className={className} />
  );
};

export default CustomTextArea;



