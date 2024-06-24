'use client';
import React, { FC, useEffect, useState } from 'react';
import { DatePicker, Select, Upload, message, Modal, Input as AntInput } from 'antd';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { RcFile } from 'antd/es/upload';
import moment from 'moment';
import * as XLSX from 'xlsx';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal';
import CustomInput from '../components/CustomInput';
import CustomTextArea from '../components/CustomTextArea';
import { validateExcelFormat, TodoItem } from '../../utils/validateExcelFormat';

const { Option } = Select;

const priorityOrder = { '高': 1, '中': 2, '低': 3 } as const;
type PriorityOrder = keyof typeof priorityOrder;
type SortType = 'priorityAsc' | 'priorityDesc' | 'createdAtAsc' | 'createdAtDesc';

const toJST = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('ja-JP');
};

const Todo: FC = () => {
  const [value, setValue] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [reminderTime, setReminderTime] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<PriorityOrder>('中');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [sortType, setSortType] = useState<SortType>('priorityAsc');
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
    if (!value.trim()) {
      message.error('タイトルは必須です');
      return;
    }

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
    setIsModalOpen(false);
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
    setIsModalOpen(true);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setValue('');
    setDetail('');
    setReminderTime(undefined);
    setPriority('中');
    setEditIndex(null);
  };

  const showDeleteAllModal = () => {
    setIsDeleteAllModalOpen(true);
  };

  const handleDeleteAll = () => {
    setTodos([]);
    localStorage.setItem('todos', '[]');
    setIsDeleteAllModalOpen(false);
  };

  const handleCancelDeleteAll = () => {
    setIsDeleteAllModalOpen(false);
  };

  const showExportModal = () => {
    if (todos.length === 0) {
      message.warning('エクスポートするTODOがありません');
      return;
    }
    setIsExportModalOpen(true);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(todos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Todos');
    const exportFileName = fileName + '.xlsx';
    XLSX.writeFile(wb, exportFileName);
    setFileName('');  // Reset file name after export
    setIsExportModalOpen(false);
  };

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

  const handleSortChange = (sortType: SortType) => {
    setSortType(sortType);
  };

  const handleUpload = async (options: UploadRequestOption) => {
    const { file } = options;
    try {
      if (!file) {
        throw new Error('ファイルが見つかりません');
      }
      if (!/\.xlsx$|\.xlsm$/.test((file as RcFile).name)) {
        message.error('対応しているファイル形式は .xlsx, .xlsm のみです');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = event.target?.result;
          if (!data) {
            throw new Error('ファイルの読み込みに失敗しました');
          }
          const arrayBuffer = data instanceof ArrayBuffer ? data : new TextEncoder().encode(data).buffer;

          const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (!validateExcelFormat(jsonData)) {
            throw new Error('Excelファイルの形式が正しくありません');
          }

          if (todos.length > 0 && !window.confirm('既存のTODOを上書きしますか？')) {
            return;
          }

          if (jsonData.length === 0) {
            message.warning('インポートしたファイルにはTODOがありません');
            return;
          }

          setTodos(jsonData);
          localStorage.setItem('todos', JSON.stringify(jsonData));
          message.success(`${(file as RcFile).name} ファイルの読み込みが成功しました`);
        } catch (error) {
          if (error instanceof Error) {
            message.error(error.message);
          } else {
            message.error('予期しないエラーが発生しました');
          }
        }
      };
      reader.readAsArrayBuffer(file as Blob);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('予期しないエラーが発生しました');
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">TODOリスト</h1>
      <div className="flex justify-between mb-4">
        <Select value={sortType} onChange={handleSortChange} className="w-1/3">
          <Option value="priorityAsc">優先度 昇順</Option>
          <Option value="priorityDesc">優先度 降順</Option>
          <Option value="createdAtAsc">作成日時 昇順</Option>
          <Option value="createdAtDesc">作成日時 降順</Option>
        </Select>
        <CustomButton type="primary" onClick={showModal}>新規追加</CustomButton>
        <CustomButton type="default" danger onClick={showDeleteAllModal}>全削除</CustomButton>
      </div>
      {sortedTodos.map((todo, index) => (
        <div className="bg-white p-4 rounded shadow mb-4" key={index}>
          <p className="text-sm font-bold">{todo.value}</p>
          <p className="text-xs">{todo.detail}</p>
          <p className="text-xs">{todo.reminderTime ? toJST(todo.reminderTime) : ''}</p>
          <p className="text-xs text-gray-400">{toJST(todo.createdAt)}</p>
          <p className="text-xs text-gray-500">{todo.priority}</p>
          <div className="flex justify-end space-x-2 mt-2">
            <CustomButton type="primary" onClick={() => handleEdit(index)}>編集</CustomButton>
            <CustomButton type="default" danger onClick={() => handleDelete(index)}>削除</CustomButton>
          </div>
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <Upload customRequest={handleUpload} accept=".xlsx,.xlsm">
          <CustomButton type="default" onClick={() => { }}>インポート</CustomButton>
        </Upload>
        <CustomButton type="primary" onClick={showExportModal} disabled={todos.length === 0}>エクスポート</CustomButton>
      </div>
      <CustomModal title={editIndex !== null ? "編集" : "新規追加"} open={isModalOpen} onOk={handleSubmit} onCancel={handleCancel} okButtonProps={{ disabled: !value.trim() }}>
        {editIndex !== null && <p className="text-base font-medium mb-2"></p>}
        <CustomInput className="mb-4" value={value} onChange={(e) => setValue(e.target.value)} placeholder="タイトル" />
        <CustomTextArea className="mb-4" value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="詳細" />
        <DatePicker
          showTime
          value={reminderTime ? moment(reminderTime) : null}
          onChange={(date) => setReminderTime(date ? date.toISOString() : undefined)}
          placeholder="リマインダーの時間"
          className="mb-4"
        />
        <Select value={priority} onChange={(value) => setPriority(value as PriorityOrder)} className="w-full mb-4">
          <Option value="高">高</Option>
          <Option value="中">中</Option>
          <Option value="低">低</Option>
        </Select>
      </CustomModal>
      <CustomModal title="全削除の確認" open={isDeleteAllModalOpen} onOk={handleDeleteAll} onCancel={handleCancelDeleteAll}>
        <p>本当に全てのTODOを削除しますか？</ p>
      </CustomModal>
      <Modal title="エクスポートファイル名の入力" open={isExportModalOpen} onOk={handleExport} onCancel={() => setIsExportModalOpen(false)}>
        <AntInput value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="ファイル名を入力" />
      </Modal>
    </div>
  );
};

export default Todo;


