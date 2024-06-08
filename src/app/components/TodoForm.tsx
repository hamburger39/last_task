import { FC, useState, useEffect } from "react";
import CustomInput from "./CustomInput";
import CustomTextArea from "./CustomTextArea";
import CustomButton from "./CustomButton";
import Reminder from "./Reminder";

interface TodoItem {
  value: string;
  detail: string;
  reminder?: Date;
}

interface TodoFormProps {
  onSubmit: (todo: TodoItem) => void;
  editTodo?: TodoItem;
}

const TodoForm: FC<TodoFormProps> = ({ onSubmit, editTodo }) => {
  const [value, setValue] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [reminder, setReminder] = useState<Date | null>(null);

  useEffect(() => {
    if (editTodo) {
      setValue(editTodo.value);
      setDetail(editTodo.detail);
      setReminder(editTodo.reminder || null);
    }
  }, [editTodo]);

  const handleSubmit = () => {
    onSubmit({ value, detail, reminder: reminder || undefined });
    setValue("");
    setDetail("");
    setReminder(null);
  };

  return (
    <div>
      <CustomInput placeholder="タイトル" value={value} onChange={(e) => setValue(e.target.value)} className="mb-2" />
      <CustomTextArea placeholder="詳細" value={detail} onChange={(e) => setDetail(e.target.value)} rows={4} className="mb-2" />
      <Reminder reminder={reminder} setReminder={setReminder} />
      <CustomButton type="primary" onClick={handleSubmit}>保存</CustomButton>
    </div>
  );
};

export default TodoForm;