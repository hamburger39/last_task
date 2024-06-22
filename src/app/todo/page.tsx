'use client';
import React, { FC, useEffect, useState } from 'react';
import { DatePicker, Select, Upload, message, Modal, Input } from 'antd';
import moment from 'moment';
import * as XLSX from 'xlsx';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal';
import CustomInput from '../components/CustomInput';
import CustomTextArea from '../components/CustomTextArea';
import { validateExcelFormat, TodoItem } from '../../utils/validateExcelFormat';

const { Option } = Select;

const Todo: FC = () => {
  const [value, setValue] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<string>('中');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeleteAllModalVisible, setIsDeleteAllModalVisible] = useState<boolean>(false);
  const [isExportModalVisible, setIsExportModalVisible] = useState<boolean>(false);
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

  const showExportModal = () => {
    setIsExportModalVisible(true);
  };

  const handleExport = () => {
    if (!fileName) {
      message.error('ファイル名を入力してください');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(todos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Todos');
    const exportFileName = fileName + '.xlsx';
    XLSX.writeFile(wb, exportFileName);

    setFileName('');
    setIsExportModalVisible(false);
  };

  const handleCancelExport = () => {
    setFileName('');
    setIsExportModalVisible(false);
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

  const handleUpload = async (info: any) => {
    try {
      const { file } = info;
      if (!file) {
        throw new Error('Uploaded file is undefined');
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target) {
          const data = event.target.result;
          if (data === null) {
            throw new Error('Uploaded file is null');
          }
          const arrayBuffer = data instanceof ArrayBuffer ? data : new TextEncoder().encode(data).buffer;

          try {
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            console.log('Read data from Excel file:', jsonData);

            if (!validateExcelFormat(jsonData)) {
              throw new Error('Excelファイルの形式が正しくありません');
            }

            if (todos.length > 0) {
              Modal.confirm({
                title: '確認',
                content: '既存のTODOリストが上書きされます。続行しますか？',
                onOk: () => {
                  setTodos(jsonData);
                  localStorage.setItem('todos', JSON.stringify(jsonData));
                  message.success(`${info.file.name} ファイルの読み込みが成功しました`);
                },
              });
            } else {
              setTodos(jsonData);
              localStorage.setItem('todos', JSON.stringify(jsonData));
              message.success(`${info.file.name} ファイルの読み込みが成功しました`);
            }
          } catch (error) {
            if (error instanceof Error) {
              message.error('Excelファイルの読み込みに失敗しました');
            } else {
              message.error('Excelファイルの読み込みに失敗しました。');
            }
          }
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      if (error instanceof Error) {
        message.error('ファイルの読み込みに失敗しました');
      } else {
        message.error('ファイルの読み込みに失敗しました。');
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex mb-4 space-x-4">
        <CustomButton type="primary" onClick={showModal}>新規追加</CustomButton>
        <CustomButton type="default" danger onClick={showDeleteAllModal}>全削除</CustomButton>
      </div>
      <div className="flex mb-4 space-x-4">
        <label className="flex items-center space-x-2">
          <span>ソート:</span>
          <Select value={sortType} onChange={handleSortChange}>
            <Option value="priorityAsc">優先度 (昇順)</Option>
            <Option value="priorityDesc">優先度 (降順)</Option>
            <Option value="createdAtAsc">作成日 (昇順)</Option>
            <Option value="createdAtDesc">作成日 (降順)</Option>
          </Select>
        </label>
      </div>
      <Upload beforeUpload={() => false} onChange={handleUpload} showUploadList={false} accept=".xlsx, .xlsm">
      <CustomButton type="default" onClick={() => {}}>インポート</CustomButton>
      </Upload>
      <CustomButton type="default" onClick={showExportModal}>エクスポート</CustomButton>
      {sortedTodos.map((todo, index) => (
        <div key={index} className="border p-2 mb-2 rounded flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{todo.value}</h3>
            <p>{todo.detail}</p>
            <p>リマインダー: {todo.reminderTime ? moment(todo.reminderTime).format('YYYY-MM-DD HH:mm') : 'なし'}</p>
            <p>優先度: {todo.priority}</p>
            <p>作成日: {moment(todo.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
          </div>
          <div className="flex space-x-2">
            <CustomButton type="link" onClick={() => handleEdit(index)}>編集</CustomButton>
            <CustomButton type="link" danger onClick={() => handleDelete(index)}>削除</CustomButton>
          </div>
        </div>
      ))}
      <CustomModal title={editIndex !== null ? 'ToDoを編集' : '新規ToDoを追加'} visible={isModalVisible} onOk={handleSubmit} onCancel={handleCancel}>
        <CustomInput value={value} onChange={(e) => setValue(e.target.value)} placeholder="タイトルを入力してください" />
        <CustomTextArea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="詳細を入力してください" rows={4} />
        <div className="my-4">
          <label>リマインダー:</label>
          <DatePicker showTime value={reminderTime ? moment(reminderTime) : null} onChange={(date) => setReminderTime(date ? date.toISOString() : undefined)} className="w-full" />
        </div>
        <div className="my-4">
          <label>優先度:</label>
          <Select value={priority} onChange={(value) => setPriority(value)} className="w-full">
            <Option value="高">高</Option>
            <Option value="中">中</Option>
            <Option value="低">低</Option>
          </Select>
        </div>
      </CustomModal>
      <Modal title="全削除確認" visible={isDeleteAllModalVisible} onOk={handleDeleteAll} onCancel={handleCancelDeleteAll}>
        <p>本当に全てのToDoを削除しますか？</p>
      </Modal>
      <Modal title="エクスポートファイル名" visible={isExportModalVisible} onOk={handleExport} onCancel={handleCancelExport}>
        <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="ファイル名を入力してください" />
      </Modal>
    </div>
  );
};

export default Todo;

