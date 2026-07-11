import { useState } from 'react';
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

/**
 * Storybook用のフォーム状態管理ラッパー
 * needApplicationの状態を管理し、フォームのインタラクションをテスト可能にします
 */
interface EmployeesWrapperProps {
  groupId: number;
  isDeadline: boolean;
  isRegistered: boolean;
  mutateCheckAllRegisteredGroups: () => void;
  /**
   * needApplicationの初期値
   * - undefined: 未選択状態
   * - true: 「はい」選択済み（従業員申請する）
   * - false: 「いいえ」選択済み（代表・副代表のみ）
   */
  initialNeedApplication?: boolean;
}

const EmployeesWrapper: React.FC<EmployeesWrapperProps> = ({
  groupId,
  isDeadline,
  isRegistered,
  mutateCheckAllRegisteredGroups,
  initialNeedApplication,
}) => {
  const [needApplication] = useState<boolean | undefined>(
    initialNeedApplication
  );

  console.log(
    `🎯 needApplication状態: ${needApplication} (groupId: ${groupId})`
  );

  return (
    <div>
      {/* デバッグ用：現在の状態表示 */}
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-blue-800">
          📊 Storybook Debug Info
        </h3>
        <div className="space-y-1 text-xs text-blue-700">
          <div>GroupID: {groupId}</div>
          <div>IsDeadline: {isDeadline ? 'Yes' : 'No'}</div>
          <div>IsRegistered: {isRegistered ? 'Yes' : 'No'}</div>
          <div>
            InitialNeedApplication:{' '}
            {needApplication === undefined
              ? 'Unselected'
              : needApplication
                ? 'Yes (設定値)'
                : 'No (設定値)'}
          </div>
          <div className="mt-2 text-xs text-blue-600">
            💡
            現在の実装では、コンポーネント内部でAPIデータから初期状態を決定します
          </div>
          <div className="text-xs text-blue-600">
            🔧
            ラジオボタンの初期選択は、APIのemployeesデータ・unregistered-groupsデータで決まります
          </div>
        </div>
      </div>

      <Employees
        groupId={groupId}
        canAdd={!isDeadline}
        canEdit={!isDeadline}
        isRegistered={isRegistered}
        mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
      />
    </div>
  );
};

// Storybook用のSWR設定
const swrConfig = {
  dedupingInterval: 0,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 0,
  fallback: {
    // 従業員データのモック
    '/api/employees/1': [], // 期限内・未登録（従業員データなし）
    '/api/employees/2': [
      { id: 1, name: '技大 太郎', studentId: '12345678' },
      { id: 2, name: '技大 花子', studentId: '87654321' },
    ], // 期限内・従業員申請あり
    '/api/employees/3': [], // 期限内・「申請しない」登録済み（従業員データなし）
    '/api/employees/4': [], // 申請期限後・未登録
    '/api/employees/5': [
      { id: 1, name: '技大 太郎', studentId: '12345678' },
      { id: 2, name: '技大 花子', studentId: '87654321' },
    ], // 申請期限後・従業員申請あり
    '/api/employees/6': [], // 申請期限後・「申請しない」登録済み（従業員データなし）

    // 未登録グループデータのモック
    '/api/unregistered-groups/1': null, // 期限内・未登録（未登録グループデータなし）
    '/api/unregistered-groups/2': null, // 期限内・従業員申請あり（未登録グループデータなし）
    '/api/unregistered-groups/3': { id: 1, groupId: 3 }, // 期限内・「申請しない」登録済み
    '/api/unregistered-groups/4': null, // 申請期限後・未登録（未登録グループデータなし）
    '/api/unregistered-groups/5': null, // 申請期限後・従業員申請あり（未登録グループデータなし）
    '/api/unregistered-groups/6': { id: 1, groupId: 6 }, // 申請期限後・「申請しない」登録済み

    // グループ登録状況確認データのモック
    '/api/check_all_registered/1': {
      status: { code: 200, message: 'success' },
      data: { employee: false, group: true, subRep: true },
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
    '/api/check_all_registered/5': {
      status: { code: 200, message: 'success' },
      data: { employee: true, group: true, subRep: true },
    },
    '/api/check_all_registered/6': {
      status: { code: 200, message: 'success' },
      data: { employee: true, group: true, subRep: true },
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
  component: EmployeesWrapper, // ラッパーコンポーネントを使用
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

  - \`useEmployeesBusinessHooks\`: ビジネスロジック全般
  - \`useUnregisteredGroupHooks\`: 未登録グループの管理
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
    initialNeedApplication: {
      description:
        'needApplicationの初期値（undefined: 未選択、true: はい、false: いいえ）',
      control: {
        type: 'radio',
        options: [undefined, true, false],
        labels: {
          undefined: '未選択',
          true: 'はい（従業員申請する）',
          false: 'いいえ（代表・副代表のみ）',
        },
      },
    },
    mutateCheckAllRegisteredGroups: {
      description: 'グループ登録状況を更新するコールバック関数',
      action: 'mutateCheckAllRegisteredGroups',
    },
  },
} as Meta<typeof EmployeesWrapper>;

type Story = StoryObj<typeof EmployeesWrapper>;

/**
 * 期限内・未登録状態（フォームインタラクション可能）
 */
export const Default: Story = {
  args: {
    groupId: 1,
    isDeadline: false,
    isRegistered: false,
    initialNeedApplication: undefined, // 未選択状態でスタート
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '🆕 新規グループの初期状態です。従業員データも未登録グループデータもない状態で、ラジオボタンは未選択状態から開始します。現在の実装では、コンポーネント内部でAPIデータから状態を決定するため、外部からの初期値注入はできません。実際のフォーム操作をテストできます。',
      },
    },
  },
};

/**
 * 期限内・従業員申請済み（「はい」選択済み）
 */
export const BeforeDeadlineWithEmployees: Story = {
  args: {
    groupId: 2,
    isDeadline: false,
    isRegistered: true,
    initialNeedApplication: true, // 「はい」選択済み
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '✅ 既に従業員申請が登録済みの状態です。従業員データが存在するため、コンポーネントが自動的に従業員一覧モードで表示されます。アコーディオンが開いた状態で表示され、編集ボタンから内容を変更できます。',
      },
    },
  },
};

/**
 * 期限内・「申請しない」登録済み（「いいえ」選択済み）
 */
export const BeforeDeadlineUnregisteredGroup: Story = {
  args: {
    groupId: 3,
    isDeadline: false,
    isRegistered: true,
    initialNeedApplication: false, // 「いいえ」選択済み
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '🚫 代表・副代表のみで活動する状態です。未登録グループデータが存在するため、コンポーネントが自動的に「従業員申請は不要(登録済み)」メッセージを表示します。編集ボタンから変更可能です。',
      },
    },
  },
};

/**
 * 申請期限後・未登録
 */
export const AfterDeadlineNoApplication: Story = {
  args: {
    groupId: 4,
    isDeadline: true,
    isRegistered: false,
    initialNeedApplication: undefined, // 期限後なので選択不可
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '⏰ 申請期限が過ぎており、何も登録されていない状態です。期限切れメッセージが表示され、新規申請はできません。この状態では「申請期限が過ぎています」というメッセージが表示されます。',
      },
    },
  },
};

/**
 * 申請期限後・従業員申請済み（「はい」選択済み・読み取り専用）
 */
export const AfterDeadlineWithEmployees: Story = {
  args: {
    groupId: 5,
    isDeadline: true,
    isRegistered: true,
    initialNeedApplication: true, // 「はい」選択済み（読み取り専用）
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '📋 申請期限が過ぎた状態で、従業員データが登録済みの場合です。従業員の一覧が表示されますが、編集ボタンは表示されず閲覧専用になります。',
      },
    },
  },
};

/**
 * 申請期限後・「申請しない」登録済み（「いいえ」選択済み・読み取り専用）
 */
export const AfterDeadlineUnregistered: Story = {
  args: {
    groupId: 6,
    isDeadline: true,
    isRegistered: true,
    initialNeedApplication: false, // 「いいえ」選択済み（読み取り専用）
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '🔒 申請期限が過ぎた状態で、代表・副代表のみで活動として登録済みの場合です。「従業員申請は不要(登録済み)」と表示されますが、編集ボタンは表示されません。',
      },
    },
  },
};

/**
 * 複数の状態を並べて表示
 * 全パターンの動作確認用（フォーム状態管理付き）
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          🆕 期限内・未登録状態（インタラクティブ）
        </h2>
        <EmployeesWrapper
          groupId={1}
          isDeadline={false}
          isRegistered={false}
          initialNeedApplication={undefined}
          mutateCheckAllRegisteredGroups={mockMutateCheckAllRegisteredGroups}
        />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          ✅ 期限内・従業員申請済み（「はい」選択済み）
        </h2>
        <EmployeesWrapper
          groupId={2}
          isDeadline={false}
          isRegistered={true}
          initialNeedApplication={true}
          mutateCheckAllRegisteredGroups={mockMutateCheckAllRegisteredGroups}
        />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          🚫 期限内・「申請しない」登録済み（「いいえ」選択済み）
        </h2>
        <EmployeesWrapper
          groupId={3}
          isDeadline={false}
          isRegistered={true}
          initialNeedApplication={false}
          mutateCheckAllRegisteredGroups={mockMutateCheckAllRegisteredGroups}
        />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          ⏰ 申請期限後・未登録
        </h2>
        <EmployeesWrapper
          groupId={4}
          isDeadline={true}
          isRegistered={false}
          initialNeedApplication={undefined}
          mutateCheckAllRegisteredGroups={mockMutateCheckAllRegisteredGroups}
        />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          📋 申請期限後・従業員申請済み（読み取り専用）
        </h2>
        <EmployeesWrapper
          groupId={5}
          isDeadline={true}
          isRegistered={true}
          initialNeedApplication={true}
          mutateCheckAllRegisteredGroups={mockMutateCheckAllRegisteredGroups}
        />
      </div>
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          🔒 申請期限後・「申請しない」登録済み（読み取り専用）
        </h2>
        <EmployeesWrapper
          groupId={6}
          isDeadline={true}
          isRegistered={true}
          initialNeedApplication={false}
          mutateCheckAllRegisteredGroups={mockMutateCheckAllRegisteredGroups}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '📊 異なる状態の従業員申請コンポーネントを並べて表示し、各状態での動作を確認できます。実際のアプリケーションで遭遇する様々なシナリオを網羅しています。ラッパーコンポーネントによってフォーム状態が管理され、各パターンでのインタラクションをテストできます。全6パターン：未選択、はい選択済み、いいえ選択済み + 期限前後の組み合わせ。',
      },
    },
  },
};

/**
 * インタラクションテスト用
 * フォーム操作のテストケース（ラジオボタン選択可能）
 */
export const Interactive: Story = {
  args: {
    groupId: 1,
    isDeadline: false,
    isRegistered: false,
    initialNeedApplication: undefined, // フォームのインタラクションをテスト可能
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '🎮 フォームの操作性をテストするためのストーリーです。初期状態では従業員データも未登録グループデータもないため、ラジオボタンが未選択状態で表示されます。ラジオボタンの選択、従業員の追加・削除、フォームバリデーションなどの動作を確認できます。Debug Infoで設定値と実際の動作の違いを確認できます。',
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
    groupId: 2,
    isDeadline: false,
    isRegistered: false,
    initialNeedApplication: true, // 「はい」を事前選択
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '✅「はい」を選択して従業員申請を行う場合の挙動をテストします。登録完了時に`mutateCheckAllRegisteredGroups`が呼ばれ、トーストメッセージ「従業員申請が完了しました」が表示されることを確認できます。',
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
    groupId: 3,
    isDeadline: false,
    isRegistered: false,
    initialNeedApplication: false, // 「いいえ」を事前選択
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '🚫「いいえ」を選択して代表・副代表のみで活動する場合の挙動をテストします。登録完了時に`mutateCheckAllRegisteredGroups`が呼ばれ、トーストメッセージ「従業員申請を行わない登録が完了しました」が表示されることを確認できます。',
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
    groupId: 2,
    isDeadline: false,
    isRegistered: true,
    initialNeedApplication: true, // 従業員データがある状態
    mutateCheckAllRegisteredGroups: mockMutateCheckAllRegisteredGroups,
  },
  parameters: {
    docs: {
      description: {
        story:
          '🗑️ 従業員データの削除操作時の挙動をテストします。削除完了時に`mutateCheckAllRegisteredGroups`が呼ばれ、トーストメッセージ「従業員を削除しました」が表示されることを確認できます。既存の従業員データがある状態からテストできます。',
      },
    },
  },
};
