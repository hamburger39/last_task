import { Input } from "antd";
import { TextAreaProps } from "antd/es/input/TextArea";

const CustomTextArea: React.FC<TextAreaProps> = (props) => <Input.TextArea {...props} />;

export default CustomTextArea;