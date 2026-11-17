import { FC, useState } from 'react';
import CommonButton from '@/components/CommonButton';
import SelectBox from '@/components/Form/SelectBox';
import TextInput from '@/components/Form/TextInput';
import Modal from '@/components/Modal';
import Table from '@/components/Table';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const Users: FC = () => {
  const [users] = useState<User[]>([
    { id: 1, name: '山田 太郎', email: 's123456@example.com', role: '管理者' },
    {
      id: 2,
      name: '佐藤 花子',
      email: 's123457@example.com',
      role: 'スタッフ',
    },
    {
      id: 3,
      name: '鈴木 一郎',
      email: 's123458@example.com',
      role: '参加団体',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('');

  const roleOptions = [
    { value: 'manager', label: '管理者' },
    { value: 'staff', label: 'スタッフ' },
    { value: 'user', label: '参加団体' },
  ];

  const handleAddUser = () => {
    console.log('Add user:', { newUserName, newUserEmail, newUserRole });
    setIsAddModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('');
  };

  return (
    <div className="flex min-h-screen flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">ユーザー一覧</h1>
        <CommonButton iconName="add" onClick={() => setIsAddModalOpen(true)}>
          ユーザー追加
        </CommonButton>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <Table
          headers={
            <>
              <th className="border-b border-gray-300 p-2 font-medium">ID</th>
              <th className="border-b border-gray-300 p-2 font-medium">名前</th>
              <th className="border-b border-gray-300 p-2 font-medium">
                メールアドレス
              </th>
              <th className="border-b border-gray-300 p-2 font-medium">
                ロール
              </th>
              <th className="border-b border-gray-300 p-2 font-medium">操作</th>
            </>
          }
        >
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-200 transition-all hover:-translate-y-px hover:bg-white hover:shadow-md"
            >
              <td className="p-6 text-center align-middle">{user.id}</td>
              <td className="p-6 text-center align-middle">{user.name}</td>
              <td className="p-6 text-center align-middle">{user.email}</td>
              <td className="p-6 text-center align-middle">{user.role}</td>
              <td className="p-6 text-center align-middle">
                <button className="text-blue-600 hover:underline">編集</button>
                <span className="mx-2">|</span>
                <button className="text-red-600 hover:underline">削除</button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="ユーザー追加"
      >
        <div className="flex flex-col gap-4">
          <TextInput
            label="名前"
            value={newUserName}
            onChange={setNewUserName}
            placeholder="例：山田 太郎"
            required
          />
          <TextInput
            label="メールアドレス"
            type="email"
            value={newUserEmail}
            onChange={setNewUserEmail}
            placeholder="例：s123456@example.com"
            required
          />
          <SelectBox
            label="ロール"
            value={newUserRole}
            onChange={setNewUserRole}
            options={roleOptions}
            placeholder="ロールを選択"
            required
          />
          <div className="mt-4 flex justify-end gap-4">
            <CommonButton
              onClick={() => setIsAddModalOpen(false)}
              className="!bg-gray-500"
            >
              キャンセル
            </CommonButton>
            <CommonButton iconName="save" onClick={handleAddUser}>
              保存
            </CommonButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
