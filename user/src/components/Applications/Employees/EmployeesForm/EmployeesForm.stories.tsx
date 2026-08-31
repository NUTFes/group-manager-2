import React from 'react';
import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { EmployeesForm as EmployeesFormValues } from '../schema';
import { EmployeesForm } from './EmployeesForm';

// ストーリー用のフォームラッパーコンポーネント
const FormWrapper = ({
  children,
  defaultValues = {
    employees: [{ name: '技大 太郎', studentId: '12345678' }],
  },
}: {
  children: React.ReactNode;
  defaultValues?: EmployeesFormValues;
}) => {
  const form = useForm({
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        {children}
      </div>
    </FormProvider>
  );
};

/**
 * 従業員フォームコンポーネントのStorybookストーリー
 *
 * このコンポーネントは個別の従業員情報を入力するためのフォームです。
 * react-hook-formのFormProviderコンテキスト内で動作します。
 */
export default {
  title: 'Applications/EmployeesForm',
  component: EmployeesForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 p-8">
        <Story />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
従業員フォームコンポーネントは、個別の従業員情報を入力・編集するためのフォームです。

## 主な機能

- **従業員名入力**: 必須項目として従業員の名前を入力
- **学籍番号入力**: 必須項目として学籍番号を入力
- **フォームバリデーション**: 入力値の妥当性をリアルタイムで検証
- **削除機能**: 削除ボタンで該当の従業員エントリを削除
- **エラー表示**: フィールドごとのエラーメッセージ表示

## 使用シーン

- 従業員申請での個人情報入力
- 既存従業員情報の編集
- 複数従業員の一括管理

## 技術仕様

- **フォーム管理**: react-hook-form の Controller を使用
- **バリデーション**: zod スキーマでの型安全な検証
- **スタイリング**: Tailwind CSS による現代的なデザイン
- **アクセシビリティ**: 適切なラベルとエラー状態の管理

## 依存関係

このコンポーネントは FormProvider コンテキスト内で動作する必要があります。
        `,
      },
      source: {
        type: 'code',
      },
    },
    layout: 'padded',
  },
  argTypes: {
    index: {
      description: 'フォーム配列内でのインデックス番号',
      control: { type: 'number' },
    },
    onDelete: {
      description: '削除ボタンクリック時のコールバック関数',
      action: 'deleted',
    },
  },
} as Meta<typeof EmployeesForm>;

type Story = StoryObj<typeof EmployeesForm>;

/**
 * 基本的な従業員フォーム
 * デフォルト値が設定された状態
 */
export const Default: Story = {
  args: {
    index: 0,
    onDelete: () => toast.success('従業員が削除されました'),
  },
  render: (args) => (
    <FormWrapper>
      <EmployeesForm {...args} />
    </FormWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'デフォルト値が設定された基本的な従業員フォームです。従業員名と学籍番号が入力済みの状態で表示されます。',
      },
    },
  },
};

/**
 * 空の従業員フォーム
 * 新規入力用の初期状態
 */
export const Empty: Story = {
  args: {
    index: 0,
    onDelete: () => toast.info('空のフォームが削除されました'),
  },
  render: (args) => (
    <FormWrapper defaultValues={{ employees: [{ name: '', studentId: '' }] }}>
      <EmployeesForm {...args} />
    </FormWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '空の状態の従業員フォームです。新規で従業員を追加する際の初期状態を表示します。',
      },
    },
  },
};

/**
 * エラー状態の従業員フォーム
 * バリデーションエラーが表示された状態
 */
export const WithErrors: Story = {
  args: {
    index: 0,
    onDelete: () => toast.error('エラーのあるフォームが削除されました'),
  },
  render: (args) => {
    const ErrorFormWrapper = () => {
      const form = useForm({
        defaultValues: {
          employees: [{ name: '', studentId: '123' }], // 無効な学籍番号
        },
        mode: 'onChange', // リアルタイムバリデーション
      });

      // エラーを発生させるために触発
      React.useEffect(() => {
        form.trigger();
      }, [form]);

      return (
        <FormProvider {...form}>
          <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
            <EmployeesForm {...args} />
          </div>
        </FormProvider>
      );
    };

    return <ErrorFormWrapper />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'バリデーションエラーが表示されている状態の従業員フォームです。エラーメッセージの表示方法を確認できます。',
      },
    },
  },
};

/**
 * 複数の従業員フォーム
 * 複数人の従業員を管理する状態
 */
export const Multiple: Story = {
  render: () => {
    const MultipleFormWrapper = () => {
      const form = useForm({
        defaultValues: {
          employees: [
            { name: '技大 太郎', studentId: '12345678' },
            { name: '技大 花子', studentId: '87654321' },
            { name: '長岡 三郎', studentId: '11111111' },
          ],
        },
      });

      const handleDelete = (index: number) => {
        toast.success(`従業員${index + 1}が削除されました`);
      };

      return (
        <FormProvider {...form}>
          <div className="space-y-6">
            <h2 className="text-center text-xl font-bold text-gray-800">
              複数従業員の管理
            </h2>
            <div className="space-y-4">
              {form.watch('employees').map((_, index) => (
                <div key={index} className="mx-auto max-w-2xl">
                  <div className="mb-2 text-sm font-medium text-gray-600">
                    従業員 {index + 1}
                  </div>
                  <div className="rounded-lg bg-white p-6 shadow-lg">
                    <EmployeesForm
                      index={index}
                      onDelete={() => handleDelete(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FormProvider>
      );
    };

    return <MultipleFormWrapper />;
  },
  parameters: {
    docs: {
      description: {
        story:
          '複数の従業員フォームを同時に管理する状態です。実際のアプリケーションでの使用方法を示しています。',
      },
    },
  },
};

/**
 * インタラクティブなフォーム
 * リアルタイムでの入力・バリデーション体験
 */
export const Interactive: Story = {
  render: () => {
    const InteractiveFormWrapper = () => {
      const form = useForm({
        defaultValues: {
          employees: [{ name: '', studentId: '' }],
        },
        mode: 'onChange',
      });

      const values = form.watch();
      const errors = form.formState.errors;

      const handleDelete = () => {
        toast.success('従業員フォームが削除されました');
        form.reset({ employees: [{ name: '', studentId: '' }] });
      };

      return (
        <FormProvider {...form}>
          <div className="space-y-6">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 text-center text-xl font-bold text-gray-800">
                インタラクティブフォーム
              </h2>
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <EmployeesForm index={0} onDelete={handleDelete} />
              </div>
            </div>

            {/* デバッグ情報 */}
            <div className="mx-auto max-w-2xl">
              <div className="rounded-lg bg-gray-100 p-4">
                <h3 className="mb-2 font-bold text-gray-700">
                  フォーム状態（デバッグ用）
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>現在の値:</strong>
                    <pre className="mt-1 overflow-auto rounded bg-white p-2 text-xs">
                      {JSON.stringify(values, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <strong>エラー:</strong>
                    <pre className="mt-1 overflow-auto rounded bg-white p-2 text-xs">
                      {JSON.stringify(errors, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormProvider>
      );
    };

    return <InteractiveFormWrapper />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'リアルタイムでフォームの状態を確認できるインタラクティブな例です。入力値とエラー状態がリアルタイムで更新されます。',
      },
    },
  },
};

/**
 * 様々な状態のショーケース
 * 全パターンを一覧表示
 */
export const Showcase: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-800">
          ✨ 入力済みフォーム
        </h2>
        <FormWrapper>
          <EmployeesForm
            index={0}
            onDelete={() => toast.success('入力済みフォームが削除されました')}
          />
        </FormWrapper>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-800">
          📝 空のフォーム
        </h2>
        <FormWrapper
          defaultValues={{ employees: [{ name: '', studentId: '' }] }}
        >
          <EmployeesForm
            index={0}
            onDelete={() => toast.info('空のフォームが削除されました')}
          />
        </FormWrapper>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-800">
          🔢 学籍番号のフォーマット例
        </h2>
        <FormWrapper
          defaultValues={{
            employees: [{ name: '長岡 技大', studentId: '20241234' }],
          }}
        >
          <EmployeesForm
            index={0}
            onDelete={() => toast.success('サンプルフォームが削除されました')}
          />
        </FormWrapper>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '従業員フォームの様々な状態を一覧で確認できるショーケースです。入力パターンや状態の違いを比較できます。',
      },
    },
  },
};
