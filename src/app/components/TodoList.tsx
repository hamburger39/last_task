import { FC } from "react";
import CustomButton from "./CustomButton";

interface TodoItem {
  value: string;
  detail: string;
  reminder?: Date;
}

interface TodoListProps {
  todos: TodoItem[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const TodoList: FC<TodoListProps> = ({ todos, onEdit, onDelete }) => {
  return (
    <div>
      {todos.map((todo, index) => (
        <div className="flex flex-col border rounded-xl border-dominant shadow p-3 mt-3 justify-between" key={index}>
          <h2 className="text-lg text-dominant">{todo.value}</h2>
          <p className="text-sm text-gray-700">{todo.detail}</p>
          <p className="text-sm text-gray-500">{todo.reminder ? new Date(todo.reminder).toLocaleString() : ""}</p>
          <div className="flex space-x-2 mt-2">
            <CustomButton type="primary" onClick={() => onEdit(index)}>編集</CustomButton>
            <CustomButton type="default" danger onClick={() => onDelete(index)}>削除</CustomButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;