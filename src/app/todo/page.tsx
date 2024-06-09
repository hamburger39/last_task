"use client";

import { useEffect, useState, FC, SetStateAction } from "react";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomInput from "../components/CustomInput";
import CustomTextArea from "../components/CustomTextArea";

interface TodoItem {
  value: string;
  detail: string;
  reminderTime?: string; // リマインダー時間のフィールドを追加
}

const Todo: FC = () => {
  const [value, setValue] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [reminderTime, setReminderTime] = useState<string>(""); // リマインダー時間を保存する状態を追加
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeleteAllModalVisible, setIsDeleteAllModalVisible] = useState<boolean>(false);

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
    const newTodo = { value, detail, reminderTime };
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
    setReminderTime("");
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
    setValue(todos[index].value);
    setDetail(todos[index].detail);
    setReminderTime(todos[index].reminderTime || "");
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
    setReminderTime("");
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

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex mb-4 space-x-4">
        <CustomButton type="primary" onClick={showModal}>新規追加</CustomButton>
        <CustomButton type="default" danger onClick={showDeleteAllModal}>全削除</CustomButton>
      </div>
      {todos.map((todo, index) => (
        <div className="flex flex-col border rounded-xl border-dominant shadow p-3 mt-3 justify-between" key={index}>
          <h2 className="text-lg text-dominant">{todo.value}</h2>
          <p className="text-sm text-gray-700">{todo.detail}</p>
          <p className="text-xs text-gray-500">{todo.reminderTime}</p>
          <div className="flex space-x-2 mt-2">
            <CustomButton type="primary" onClick={() => handleEdit(index)}>編集</CustomButton>
            <CustomButton type="default" danger onClick={() => handleDelete(index)}>削除</CustomButton>
          </div>
        </div>
      ))}
      <CustomModal title={editIndex !== null ? "編集" : "新規追加"} visible={isModalVisible} onOk={handleSubmit} onCancel={handleCancel}>
        <CustomInput placeholder="タイトル" value={value} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setValue(e.target.value)} className="mb-2" />
        <CustomTextArea placeholder="詳細" value={detail} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setDetail(e.target.value)} rows={4} />
        <CustomInput placeholder="リマインダー時間 (YYYY-MM-DD HH:MM)" value={reminderTime} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setReminderTime(e.target.value)} className="mb-2" />
      </CustomModal>
      <CustomModal title="全削除確認" visible={isDeleteAllModalVisible} onOk={handleDeleteAll} onCancel={handleCancelDeleteAll}>
        <p>本当に全てのTODOを削除しますか？</p>
      </CustomModal>
    </div>
  );
};

export default Todo;