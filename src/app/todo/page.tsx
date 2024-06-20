'use client';
import React, { FC, useEffect, useState } from 'react';
import { DatePicker, Select, Upload, message } from 'antd';
import moment from 'moment';
import * as XLSX from 'xlsx';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal';
import CustomInput from '../components/CustomInput';
import CustomTextArea from '../components/CustomTextArea';

const { Option } = Select;

interface TodoItem {
  value: string;
  detail: string;
  reminderTime?: string;
  priority: string;
  createdAt: string;
}

const Todo: FC = () => {
  const [value, setValue] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<string>('中');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeleteAllModalVisible, setIsDeleteAllModalVisible] = useState<boolean>(false);
  const [sortType, setSortType] = useState<string>('priorityAsc');
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    const todoList = JSON.parse(localStorage.getItem('todos') || '[]') as TodoItem[];
    setTodos(todoList);
  }, []);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
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
      createdAt: new Date().toISOString(),
    };

    if (editIndex !== null) {
      updatedTodos[editIndex] = newTodo;
      setEditIndex(null);
    } else {
      updatedTodos.push(newTodo);
    }

    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    setValue('');
    setDetail('');
    setReminderTime(undefined);
    setPriority('中');
    setIsModalVisible(false);
  };

  const handleDelete = (index: number) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
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
    setValue('');
    setDetail('');
    setReminderTime(undefined);
    setPriority('中');
    setEditIndex(null);
  };

  const showDeleteAllModal = () => {
    setIsDeleteAllModalVisible(true);
  };

  const handleDeleteAll = () => {
    setTodos([]);
    localStorage.setItem('todos', '[]');
    setIsDeleteAllModalVisible(false);
  };

  const handleCancelDeleteAll = () => {
    setIsDeleteAllModalVisible(false);
  };

  const priorityOrder: { [key: string]: number } = { '高': 1, '中': 2, '低': 3 };

  const sortedTodos = todos.sort((a, b) => {
    if (sortType === 'priorityAsc') {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    } else if (sortType === 'priorityDesc') {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    } else if (sortType === 'createdAtAsc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortType === 'createdAtDesc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const handleSortChange = (sortType: string) => {
    setSortType(sortType);
  };

  const handleExport = () => {
    if (!fileName) {
      message.error('ファイル名を入力してください');
      return;
    }
    const handleUpload = async (info: any) => {
      try {
        const file = info.file.originFileObj;
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<TodoItem>(worksheet);
        setTodos(jsonData);
        localStorage.setItem('todos', JSON.stringify(jsonData));
        message.success(`${info.file.name} ファイルの読み込みが成功しました`);
      } catch (error) {
        message.error('ファイルの読み込みに失敗しました。フォーマットが正しいかどうかご確認ください。');
        throw new Error('ファイルの読み込みに失敗しました。');
      }
    };
    

    const ws = XLSX.utils.json_to_sheet(todos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Todos');
    const exportFileName = fileName + '.xlsx';
    XLSX.writeFile(wb, exportFileName);
  };

  const handleUpload = async (info: any) => {
    const file = info.file.originFileObj;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json<TodoItem>(worksheet);
    setTodos(jsonData);
    localStorage.setItem('todos', JSON.stringify(jsonData));
    message.success(`${info.file.name} ファイルの読み込みが成功しました`);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex mb-4 space-x-4">
        <CustomButton type="primary" onClick={showModal}>新規追加</CustomButton>
        <CustomButton type="default" danger onClick={showDeleteAllModal}>全削除</CustomButton>
      </div>
      <div className="flex mb-4 space-x-4">
        <Select defaultValue="priorityAsc" onChange={handleSortChange} className="w-full">
          <Option value="priorityAsc">優先度 昇順</Option>
          <Option value="priorityDesc">優先度 降順</Option>
          <Option value="createdAtAsc">作成日 昇順</Option>
          <Option value="createdAtDesc">作成日 降順</Option>
        </Select>
      </div>
      {sortedTodos.map((todo, index) => (
        <div className="flex flex-col border rounded-xl border-dominant shadow p-3 mt-3 justify-between" key={index}>
          <h2 className="text-lg text-dominant">{todo.value}</h2>
          <p className="text-sm text-gray-700">{todo.detail}</p>
          <p className="text-xs text-gray-500">{todo.reminderTime}</p>
          <p className="text-xs text-gray-500">{todo.priority}</p>
          <p className="text-xs text-gray-500">{new Date(todo.createdAt).toLocaleString()}</p>
          <div className="flex space-x-2 mt-2">
            <CustomButton type="primary" onClick={() => handleEdit(index)}>編集</CustomButton>
            <CustomButton type="default" danger onClick={() => handleDelete(index)}>削除</CustomButton>
          </div>
        </div>
      ))}
      <CustomModal title={editIndex !== null ? "編集" : "新規追加"} open={isModalVisible} onOk={handleSubmit} onCancel={handleCancel}>
        <CustomInput placeholder="タイトル" value={value} onChange={(e) => setValue(e.target.value)} className="mb-2" />
        <CustomTextArea placeholder="詳細" value={detail} onChange={(e) => setDetail(e.target.value)} rows={4} />
        <DatePicker
          showTime
          placeholder="リマインダー"
          value={reminderTime ? moment(reminderTime) : null}
          onChange={(value) => setReminderTime(value ? value.toISOString() : undefined)}
          className="w-full mt-2"
        />
        <Select defaultValue="中" value={priority} onChange={(value) => setPriority(value)} className="w-full mt-2">
          <Option value="高">高</Option>
          <Option value="中">中</Option>
          <Option value="低">低</Option>
        </Select>
      </CustomModal>
      <CustomModal title="全削除の確認" open={isDeleteAllModalVisible} onOk={handleDeleteAll} onCancel={handleCancelDeleteAll}>
        <p>本当に全てのToDoを削除しますか？</p>
      </CustomModal>
      <div className="flex mt-4 space-x-4">
        <CustomInput placeholder="ファイル名" value={fileName} onChange={(e) => setFileName(e.target.value)} />
        <CustomButton type="default" onClick={handleExport}>Export</CustomButton>
        <Upload 
              accept=".xlsx, .xls" 
              showUploadList={false} 
              beforeUpload={(file) => {
              const reader = new FileReader();
              reader.onload = (e) => {
              const data = e.target?.result;
        if (data) {
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<TodoItem>(worksheet);
        setTodos(jsonData);
        localStorage.setItem('todos', JSON.stringify(jsonData));
        message.success(`${file.name} ファイルの読み込みが成功しました`);
      }
    };
    reader.readAsBinaryString(file);
    return false; 
  }}
>
  <CustomButton type="default">Import</CustomButton>
</Upload>

      </div>
    </div>
  );
};

export default Todo;