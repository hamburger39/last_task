"use client";

import { Button, Input, Modal } from "antd";
import { useEffect, useState } from "react";

const Todo = () => {
  const [value, setValue] = useState("");
  const [detail, setDetail] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const todoList = JSON.parse(localStorage.getItem("todos") || "[]");
    setTodos(todoList);
  }, []);

  const handleSubmit = () => {
    const updatedTodos = [...todos];
    if (editIndex !== null) {
      updatedTodos[editIndex] = { value, detail };
      setEditIndex(null);
    } else {
      updatedTodos.push({ value, detail });
    }
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setValue("");
    setDetail("");
    setIsModalVisible(false);
  };

  const handleDelete = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleEdit = (index) => {
    setValue(todos[index].value);
    setDetail(todos[index].detail);
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
    setEditIndex(null);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex mb-4">
        <Button type="primary" onClick={showModal}>
          新規追加
        </Button>
      </div>
      {todos.map((todo, index) => (
        <div
          className="flex flex-col border rounded-xl border-fuchsia-900 shadow p-3 mt-3 justify-between"
          key={index}
        >
          <h2 className="text-lg text-red-500">{todo.value}</h2>
          <p className="text-sm text-gray-700">{todo.detail}</p>
          <div className="flex space-x-2 mt-2">
            <Button onClick={() => handleEdit(index)}>編集</Button>
            <Button type="danger" onClick={() => handleDelete(index)}>
              削除
            </Button>
          </div>
        </div>
      ))}
      <Modal
        title={editIndex !== null ? "編集" : "新規追加"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
      >
        <Input
          placeholder="タイトル"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mb-2"
        />
        <Input.TextArea
          placeholder="詳細"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default Todo;``