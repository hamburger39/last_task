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

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  useEffect(() => {
    const todoList = JSON.parse(localStorage.getItem('todos') || '[]') as TodoItem[];
    setTodos(todoList);
  }, []);

  useEffect(() => {
    if (isIOS && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notifications enabled');
        } else if (permission === 'denied') {
          console.log('Notifications denied by user');
        }
      });
    }
  }, [isIOS]);

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
    setFileName('');
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
      <div className="flex mb-4 space-x-4">
        <CustomButton type="primary" onClick={showModal}>新規追加</CustomButton>
        <CustomButton type="default" danger onClick={showDeleteAllModal} disabled={todos.length === 0}>全削除</CustomButton>
      </div>
      <div className="flex mb-4 space-x-4">
        <Select defaultValue="priorityAsc" onChange={handleSortChange} className="w-full">
          <Option value="priorityAsc">優先度 昇順</Option>
          <Option value="priorityDesc">優先度 降順</Option>
          <Option value="createdAtAsc">作成日 昇順</Option>
          <Option value="createdAtDesc">作成日 降順</Option>
        </Select>
      </div>
      <div className="mb-4 space-y-4">
        {sortedTodos.map((todo, index) => (
          <div key={index} className="p-4 border rounded shadow-md bg-white flex justify-between items-center">
            <div>
              <div className="font-bold text-lg">{todo.value}</div>
              <div>{todo.detail}</div>
              {todo.reminderTime && (
                <div className="text-blue-500">{moment(todo.reminderTime).format('YYYY-MM-DD HH:mm')}</div>
              )}
              <div>優先度: {todo.priority}</div>
              <div>作成日: {toJST(todo.createdAt)}</div>
            </div>
            <div className="space-x-2">
              <CustomButton type="primary" onClick={() => handleEdit(index)}>編集</CustomButton>
              <CustomButton type="default" danger onClick={() => handleDelete(index)}>削除</CustomButton>
            </div>
          </div>
        ))}
      </div>
      <div className="flex mb-4 space-x-4">
        <Upload customRequest={handleUpload} showUploadList={false}>
          <CustomButton type="default">インポート</CustomButton>
        </Upload>
        <CustomButton type="default" onClick={showExportModal} disabled={todos.length === 0}>エクスポート</CustomButton>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        handleCancel={handleCancel}
        title={editIndex !== null ? 'Edit' : '新規追加'}
        handleOk={handleSubmit}
      >
        <CustomInput id="todo-title" name="todo-title" label="タイトル" value={value} onChange={(e) => setValue(e.target.value)} />
        <CustomTextArea id="todo-detail" name="todo-detail" label="詳細" value={detail} onChange={(e) => setDetail(e.target.value)} />

        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          placeholder="リマインダーを設定する"
          value={reminderTime ? moment(reminderTime) : null}
          onChange={(value) => setReminderTime(value ? value.toISOString() : undefined)}
          className="w-full"
        />
        <Select value={priority} onChange={(value) => setPriority(value)} className="w-full">
          <Option value="高">高</Option>
          <Option value="中">中</Option>
          <Option value="低">低</Option>
        </Select>
      </CustomModal>

      <Modal
        open={isDeleteAllModalOpen}
        onCancel={handleCancelDeleteAll}
        onOk={handleDeleteAll}
        title="全削除の確認"
        okText="全削除"
        cancelText="キャンセル"
      >
        <p>すべてのTODOを削除しますか？</p>
      </Modal>

      <Modal
        open={isExportModalOpen}
        onCancel={() => setIsExportModalOpen(false)}
        onOk={handleExport}
        title="エクスポート"
        okText="エクスポート"
        cancelText="キャンセル"
      >
        <AntInput
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="ファイル名を入力"
        />
      </Modal>
    </div>
  );
};

export default Todo;
