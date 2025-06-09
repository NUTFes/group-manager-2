import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import { ToastContainer } from 'react-toastify';
import { SWRConfig } from 'swr';
import { Employees } from './Employees';

/**
 * モック用のコールバック関数
 * 実際のアプリケーションでの動作をシミュレートし、Storybookでの動作確認を可能にします
 *
 * 実際のコンポーネントでは以下3つのメッセージが表示されます：
 * 1. 「はい」登録 → '従業員申請が完了しました'
 * 2. 「いいえ」登録 → '従業員申請を行わない登録が完了しました'
 * 3. 削除 → '従業員を削除しました'
 */
const mockMutateCheckAllRegisteredGroups = () => {
  console.log('📊 グループ登録状況更新がトリガーされました');
  // 実際のアプリケーションのような動作をシミュレート
  import('react-toastify').then(({ toast }) => {
    toast.info('✅ グループ登録状況が更新されました');
  });
};

// Storybook用のSWR設定
const swrConfig = {
  dedupingInterval: 0,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 0,
  fallback: {
    // 従業員データのモック
    '/api/employees/1': [
      { id: 1, name: '技大 太郎', studentId: '12345678' },
      { id: 2, name: '技大 花子', studentId: '87654321' },
    ],
    '/api/employees/2': [{ id: 3, name: '長岡 三郎', studentId: '11111111' }],
    '/api/employees/3': [{ id: 4, name: '技術 四郎', studentId: '22222222' }],
    '/api/employees/4': [], // 新規グループ：従業員データなし

    // 未登録グループデータのモック
    '/api/unregistered-groups/1': null, // 従業員申請あり
    '/api/unregistered-groups/2': { id: 1, groupId: 2 }, // 従業員申請なし
    '/api/unregistered-groups/3': { id: 2, groupId: 3 }, // 従業員申請なし
    '/api/unregistered-groups/4': null, // 新規グループ：未登録データなし

    // グループ登録状況確認データのモック
    '/api/check_all_registered/1': {
      status: { code: 200, message: 'success' },
      data: { employee: true, group: true, subRep: true },
    },
    '/api/check_all_registered/2': {
      status: { code: 200, message: 'success' },
      data: { employee: true, group: true, subRep: true },
    },
    '/api/check_all_registered/3': {
      status: { code: 200, message: 'success' },
      data: { employee: true, group: true, subRep: true },
    },
    '/api/check_all_registered/4': {
      status: { code: 200, message: 'success' },
      data: { employee: false, group: true, subRep: true },
    },
  },
};

/**
 * 従業員申請コンポーネントのStorybookストーリー
 *
 * このコンポーネントは従業員申請機能のメインUIを提供し、以下の状態を管理します：
 * - 申請期限内外の表示切り替え
 * - 登録済み状態の表示
 * - 従業員データの入力・編集・削除
 * - 未登録グループ（代表・副代表のみ）の管理
 * - グループ登録状況の更新コールバック処理
 *
 * ## 実際のトースト通知パターン
 *
 * 実際のアプリケーションでは以下の3つの異なる通知メッセージが表示されます：
 *
 * 1. **「はい」選択（従業員申請する）**
 *    - メッセージ: "従業員申請が完了しました"
 *    - 処理: 従業員データを作成/更新 + 未登録グループを削除
 *
 * 2. **「いいえ」選択（代表・副代表のみ）**
 *    - メッセージ: "従業員申請を行わない登録が完了しました"
 *    - 処理: 従業員データを削除 + 未登録グループを登録
 *
 * 3. **個別削除操作**
 *    - メッセージ: "従業員を削除しました"
 *    - 処理: 特定の従業員データを削除
 *
 * すべての成功時に `mutateCheckAllRegisteredGroups` コールバックが実行され、
 * グループ全体の登録状況が更新されます。
 */
export default {
  title: 'Applications/Employees',
  component: Employees,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SWRConfig value={swrConfig}>
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
      </SWRConfig>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `
従業員申請コンポーネントは、グループの従業員申請を管理するためのコンポーネントです。

## 主な機能

- **申請必要性の選択**: ラジオボタンで従業員申請が必要かを選択
- **従業員情報管理**: 従業員の名前と学籍番号を入力・編集・削除
- **未登録グループ対応**: 代表・副代表のみで活動する場合の管理
- **期限制御**: 申請期限に応じた編集可能性の制御
- **バリデーション**: フォーム入力値の検証
- **リアルタイム更新**: データの即座な反映

## 使用シーン

- 新規グループの従業員申請
- 既存グループの従業員情報更新
- 申請期限後の閲覧専用表示

## 状態管理

このコンポーネントはカスタムフックを使用してロジックを分離しています：

- \`useEmployeesBusinessLogic\`: ビジネスロジック全般
- \`useUnregisteredGroupLogic\`: 未登録グループの管理
- \`useEmployeesForm\`: フォームの状態管理
- \`useEmployeesFormState\`: フォーム状態の監視
- \`useEmployeesFormHandlers\`: イベントハンドラ
        `,
      },
      source: {
        type: 'code',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    groupId: {
      description: '対象のグループID',
      control: { type: 'number' },
    },
    isDeadline: {
      description:
        '申請期限が過ぎているかどうか。trueの場合は編集不可になります',
      control: { type: 'boolean' },
    },
    isRegistered: {
      description:
        '既に登録済みかどうか。未登録の場合は必須項目として表示されます',
      control: { type: 'boolean' },
    },
    mutateCheckAllRegisteredGroups: {
      description: 'グループ登録状況を更新するコールバック関数',
      action: 'mutateCheckAllRegisteredGroups',
    },
  },
} as Meta<typeof Employees>;

type Story = StoryObj<typeof Employees>;

/**
 * 基本的な従業員申請コンポーネント
 * 期限内で未登録の状態
 */
export const Default: Story = {
  args: {
    groupId: 1,
    isDeadline: false,
    isRegistered: false,
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '最も基本的な状態の従業員申請コンポーネントです。期限内かつ未登録の状態で表示されます。ユーザーは従業員申請が必要かどうかを選択できます。',
      },
    },
  },
};

/**
 * 登録済み状態
 * 既に従業員申請が完了している状態
 */
export const Registered: Story = {
  args: {
    groupId: 2,
    isDeadline: false,
    isRegistered: true,
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '既に従業員申請が登録済みの状態です。アコーディオンが開いた状態で表示され、編集ボタンから内容を変更できます。',
      },
    },
  },
};

/**
 * 申請期限後
 * 期限が過ぎて編集不可になった状態
 */
export const AfterDeadline: Story = {
  args: {
    groupId: 3,
    isDeadline: true,
    isRegistered: true,
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '申請期限が過ぎた状態です。編集ボタンが表示されず、閲覧専用になります。AccordionMenuの編集可能フラグがfalseになっています。',
      },
    },
  },
};

/**
 * 期限内・未登録状態
 * 新規グループの初期状態
 */
export const NewGroup: Story = {
  args: {
    groupId: 4,
    isDeadline: false,
    isRegistered: false,
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '新規グループの初期状態です。必須項目として表示され、従業員申請の選択から開始できます。まだ何もデータが入っていない状態です。',
      },
    },
  },
};

/**
 * 未登録グループ状態
 * 代表・副代表のみで活動する状態
 */
export const UnregisteredGroup: Story = {
  args: {
    groupId: 2,
    isDeadline: false,
    isRegistered: true,
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '「代表」または「副代表」だけで活動する状態です。従業員申請が不要として登録済みの状態を表示します。',
      },
    },
  },
};

/**
 * 複数の状態を並べて表示
 * 全パターンの動作確認用
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          🆕 期限内・未登録（新規グループ）
        </h2>
        <Employees
          groupId={4}
          isDeadline={false}
          isRegistered={false}
          mutateCheckAllRegisteredGroups={mockMutateCheckAllRegisteredGroups}
        />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          ✅ 期限内・登録済み（従業員あり）
        </h2>
        <Employees
          groupId={1}
          isDeadline={false}
          isRegistered={true}
          mutateCheckAllRegisteredGroups={mockMutateCheckAllRegisteredGroups}
        />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          👥 期限内・未登録グループ（代表・副代表のみ）
        </h2>
        <Employees
          groupId={2}
          isDeadline={false}
          isRegistered={true}
          mutateCheckAllRegisteredGroups={mockMutateCheckAllRegisteredGroups}
        />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          🔒 期限後・登録済み（編集不可）
        </h2>
        <Employees
          groupId={3}
          isDeadline={true}
          isRegistered={true}
          mutateCheckAllRegisteredGroups={mockMutateCheckAllRegisteredGroups}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '異なる状態の従業員申請コンポーネントを並べて表示し、各状態での動作を確認できます。実際のアプリケーションで遭遇する様々なシナリオを網羅しています。',
      },
    },
  },
};

/**
 * インタラクションテスト用
 * フォーム操作のテストケース
 */
export const Interactive: Story = {
  args: {
    groupId: 1,
    isDeadline: false,
    isRegistered: false,
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          'フォームの操作性をテストするためのストーリーです。ラジオボタンの選択、従業員の追加・削除、フォームバリデーションなどの動作を確認できます。',
      },
    },
  },
  play: async () => {
    // Storybookのインタラクションテストのサンプル
    // 実際のテストコードはここに記述
  },
};

/**
 * 「はい」登録の挙動テスト
 * 従業員申請ありでの登録完了時の動作確認
 */
export const YesRegistrationBehavior: Story = {
  args: {
    groupId: 4,
    isDeadline: false,
    isRegistered: false,
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '「はい」を選択して従業員申請を行う場合の挙動をテストします。登録完了時にmutateCheckAllRegisteredGroupsが呼ばれることを確認できます。',
      },
    },
  },
};

/**
 * 「いいえ」登録の挙動テスト
 * 従業員申請なしでの登録完了時の動作確認
 */
export const NoRegistrationBehavior: Story = {
  args: {
    groupId: 4,
    isDeadline: false,
    isRegistered: false,
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '「いいえ」を選択して代表・副代表のみで活動する場合の挙動をテストします。登録完了時にmutateCheckAllRegisteredGroupsが呼ばれることを確認できます。',
      },
    },
  },
};

/**
 * 削除操作の挙動テスト
 * 従業員削除時の動作確認
 */
export const DeleteBehavior: Story = {
  args: {
    groupId: 1,
    isDeadline: false,
    isRegistered: true,
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '従業員データの削除操作時の挙動をテストします。削除完了時にmutateCheckAllRegisteredGroupsが呼ばれることを確認できます。',
      },
    },
  },
};
