"use client";

import { useEffect, useState, FC, SetStateAction } from "react";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import TodoForm from "../components/TodoForm";

interface TodoItem {
  value: string;
  detail: string;
  reminder?: Date;
}

const Todo: FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeleteAllModalVisible, setIsDeleteAllModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const todoList = JSON.parse(localStorage.getItem("todos") || "[]") as TodoItem[];
    setTodos(todoList);
  }, []);

  const handleSubmit = (todo: TodoItem) => {
    const updatedTodos = [...todos];
    if (editIndex !== null) {
      updatedTodos[editIndex] = todo;
      setEditIndex(null);
    } else {
      updatedTodos.push(todo);
    }
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setIsModalVisible(false);
  };

  const handleDelete = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setIsModalVisible(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
          <div className="flex space-x-2 mt-2">
            <CustomButton type="primary" onClick={() => handleEdit(index)}>編集</CustomButton>
            <CustomButton type="default" danger onClick={() => handleDelete(index)}>削除</CustomButton>
          </div>
        </div>
      ))}
      <CustomModal title={editIndex !== null ? "編集" : "新規追加"} open={isModalVisible} onCancel={handleCancel}>
        <TodoForm onSubmit={handleSubmit} editTodo={editIndex !== null ? todos[editIndex] : undefined} />
      </CustomModal>
      <CustomModal title="全削除確認" open={isDeleteAllModalVisible} onOk={handleDeleteAll} onCancel={handleCancelDeleteAll}>
        <p>本当に全てのTODOを削除しますか？</p>
      </CustomModal>
    </div>
  );
};

export default Todo;