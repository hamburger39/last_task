"use client";

import { useEffect, useState, FC, SetStateAction } from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomInput from "../components/CustomInput";
import CustomTextArea from "../components/CustomTextArea";

const { Option } = Select;

interface TodoItem {
  value: string;
  detail: string;
  reminderTime?: string;
  priority: string;
  createdAt: string;
}

const Todo: FC = () => {
  const [value, setValue] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [reminderTime, setReminderTime] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<string>("中");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeleteAllModalVisible, setIsDeleteAllModalVisible] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortPriority, setSortPriority] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const todoList = JSON.parse(localStorage.getItem("todos") || "[]") as TodoItem[];
    setTodos(todoList);
  }, []);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleSubmit = () => {
    const updatedTodos = [...todos];
    const newTodo: TodoItem = {
      value,
      detail,
      reminderTime,
      priority,
      createdAt: new Date().toISOString()
    };

    if (editIndex !== null) {
      updatedTodos[editIndex] = newTodo;
      setEditIndex(null);
    } else {
      updatedTodos.push(newTodo);
    }

    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setValue("");
    setDetail("");
    setReminderTime(undefined);
    setPriority("中");
    setIsModalVisible(false);

    if (reminderTime) {
      const reminderDate = new Date(reminderTime);
      const timeUntilReminder = reminderDate.getTime() - new Date().getTime();
      if (timeUntilReminder > 0) {
        setTimeout(() => {
          new Notification("リマインダー", { body: `TODO: ${value}` });
        }, timeUntilReminder);
      }
    }
  };

  const handleDelete = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleEdit = (index: number) => {
    const todo = todos[index];
    setValue(todo.value);
    setDetail(todo.detail);
    setReminderTime(todo.reminderTime);
    setPriority(todo.priority);
    setEditIndex(index);
    setIsModalVisible(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setValue("");
    setDetail("");
    setReminderTime(undefined);
    setPriority("中");
    setEditIndex(null);
  };

  const showDeleteAllModal = () => {
    setIsDeleteAllModalVisible(true);
  };

  const handleDeleteAll = () => {
    setTodos([]);
    localStorage.setItem("todos", "[]");
    setIsDeleteAllModalVisible(false);
  };

  const handleCancelDeleteAll = () => {
    setIsDeleteAllModalVisible(false);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const toggleSortPriority = () => {
    setSortPriority(sortPriority === "asc" ? "desc" : "asc");
  };

  const priorityOrder: { [key: string]: number } = { "高": 1, "中": 2, "低": 3 };

  const sortedTodos = todos.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return sortPriority === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortOrder === "asc") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex mb-4 space-x-4">
        <CustomButton type="primary" onClick={showModal}>新規追加</CustomButton>
        <CustomButton type="default" danger onClick={showDeleteAllModal}>全削除</CustomButton>
        <CustomButton type="default" onClick={toggleSortOrder}>
          作成日時順: {sortOrder === "asc" ? "昇順" : "降順"}
        </CustomButton>
        <CustomButton type="default" onClick={toggleSortPriority}>
          優先度順: {sortPriority === "asc" ? "昇順" : "降順"}
        </CustomButton>
      </div>
      {sortedTodos.map((todo, index) => (
        <div className="flex flex-col border rounded-xl border-dominant shadow p-3 mt-3 justify-between" key={index}>
          <h2 className="text-lg text-dominant">{todo.value}</h2>
          <p className="text-sm text-gray-700">{todo.detail}</p>
          <p className="text-xs text-gray-500">{todo.reminderTime}</p>
          <p className={`text-xs ${todo.priority === '高' ? 'text-red-500' : todo.priority === '中' ? 'text-green-500' : 'text-yellow-500'}`}>{todo.priority}</p>
          <p className="text-xs text-gray-500">{new Date(todo.createdAt).toLocaleString()}</p>
          <div className="flex space-x-2 mt-2">
            <CustomButton type="primary" onClick={() => handleEdit(index)}>編集</CustomButton>
            <CustomButton type="default" danger onClick={() => handleDelete(index)}>削除</CustomButton>
          </div>
        </div>
      ))}
      <CustomModal title={editIndex !== null ? "編集" : "新規追加"} visible={isModalVisible} onOk={handleSubmit} onCancel={handleCancel}>
        <CustomInput placeholder="タイトル" value={value} onChange={(e) => setValue(e.target.value)} className="mb-2" />
        <CustomTextArea placeholder="詳細" value={detail} onChange={(e) => setDetail(e.target.value)} rows={4} />
        <DatePicker
          showTime
          placeholder="リマインダー時間を選択"
          onChange={(date, dateString) => setReminderTime(dateString as string| undefined)}
          value={reminderTime ? moment(reminderTime) : undefined}
          className="mb-2"
        />
        <Select value={priority} onChange={(value) => setPriority(value)} className="mb-2">
          <Option value="高">高</Option>
          <Option value="中">中</Option>
          <Option value="低">低</Option>
        </Select>
      </CustomModal>
      <CustomModal title="全削除確認" visible={isDeleteAllModalVisible} onOk={handleDeleteAll} onCancel={handleCancelDeleteAll}>
        <p>本当に全てのTODOを削除しますか？</p>
      </CustomModal>
    </div>
  );
};

export default Todo;