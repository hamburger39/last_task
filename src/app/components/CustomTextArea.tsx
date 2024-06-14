import { Input } from "antd";
import { TextAreaProps } from "antd/lib/input";

const { TextArea } = Input;

interface CustomTextAreaProps extends TextAreaProps {
  rows: number;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = (props) => {
  return <TextArea {...props} />;
};

export default CustomTextArea;

