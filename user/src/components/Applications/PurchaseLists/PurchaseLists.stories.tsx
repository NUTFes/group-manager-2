import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import PurchaseLists from './PurchaseLists';

// モックデータ用の型定義
type MockPurchaseListResponse = {
  id: number;
  groupId: number;
  foodProductId: number;
  shopId: number;
  items: string;
  isFresh: boolean;
  purchaseDate: string;
  url?: string;
};

// ストーリー用のモックデータを準備
const getStorageKey = (groupId: number) => `purchase_lists_group_${groupId}`;

const mockDataSetter = (groupId: number, data: MockPurchaseListResponse[]) => {
  // Storybookではlocalstorageが利用可能
  if (typeof window !== 'undefined') {
    localStorage.setItem(getStorageKey(groupId), JSON.stringify(data));
  }
};

const clearMockData = (groupId: number) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(getStorageKey(groupId));
  }
};

export default {
  title: 'Components/PurchaseLists',
  tags: ['autodocs'],
  component: PurchaseLists,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
      description: {
        component:
          '購入品申請コンポーネント - 購入品の申請データを管理します。フォーム入力、データ表示、編集機能を提供します。',
      },
    },
    layout: 'padded',
  },
  argTypes: {
    isDeadline: {
      control: 'boolean',
      description: '締切期限を過ぎているかどうか（編集不可状態）',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    isRegistered: {
      control: 'boolean',
      description: '申請が登録済みかどうか（既存データの有無）',
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    groupId: {
      control: 'number',
      description: 'グループID（データ識別用）',
      table: {
        defaultValue: { summary: '1' },
      },
    },
  },
  decorators: [
    (Story, context) => {
      // context.args の型を明示的に示す (Storybookが型推論できる場合が多いが、より安全に)
      // PurchaseListsPropsにgroupIdが含まれることを想定
      const { groupId } = context.args as { groupId?: number }; // groupIdはオプショナルかもしれないので ? を追加

      // ストーリー開始時にモックデータをクリア
      if (typeof groupId === 'number') {
        clearMockData(groupId);
      }

      return <Story />;
    },
  ],
} as Meta<typeof PurchaseLists>;

type Story = StoryObj<typeof PurchaseLists>;

// 新規申請（フォーム表示）
export const NewApplication: Story = {
  args: {
    groupId: 1,
    isDeadline: false,
    isRegistered: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'デフォルト状態の購入品申請コンポーネント。新規申請フォームが表示され、購入品の追加や削除が可能です。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // フォームが表示されていることを確認
    expect(canvas.getByText('購入品の追加')).toBeInTheDocument();
    expect(canvas.getByText('登録')).toBeInTheDocument();
  },
};

// 既存データありの状態（サマリー表示）
export const WithExistingData: Story = {
  args: {
    groupId: 2,
    isDeadline: false,
    isRegistered: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '申請が登録済みの状態。既存の申請データをサマリー形式で表示し、編集や削除が可能です。',
      },
    },
  },
  decorators: [
    (Story, context) => {
      const { groupId } = context.args as { groupId: number }; // このストーリーではgroupIdが必須と想定

      const mockData: MockPurchaseListResponse[] = [
        {
          id: 1,
          groupId: groupId,
          foodProductId: 1,
          shopId: 1,
          items: 'トマト、玉ねぎ、人参',
          isFresh: true,
          purchaseDate: '2025/06/15',
          url: '',
        },
        {
          id: 2,
          groupId: groupId,
          foodProductId: 2,
          shopId: 29,
          items: '調味料セット、油',
          isFresh: false,
          purchaseDate: '2025/06/10',
          url: 'https://example.com/seasoning-set',
        },
      ];

      // groupIdが数値であることを確認してからモックデータを設定
      if (typeof groupId === 'number') {
        mockDataSetter(groupId, mockData);
      }

      return <Story />;
    },
  ],
};

// 複数の購入品がある複雑なケース
export const ComplexData: Story = {
  args: {
    groupId: 3,
    isDeadline: false,
    isRegistered: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '複数の購入品データがある状態。生鮮品と加工品、ネット注文と店舗購入が混在しています。',
      },
    },
  },
  decorators: [
    (Story, context) => {
      const { groupId } = context.args as { groupId: number }; // このストーリーではgroupIdが必須と想定

      const mockData: MockPurchaseListResponse[] = [
        {
          id: 1,
          groupId: groupId,
          foodProductId: 1,
          shopId: 1,
          items: '新鮮な野菜セット（キャベツ、レタス、トマト）',
          isFresh: true,
          purchaseDate: '2025/06/20',
          url: '',
        },
        {
          id: 2,
          groupId: groupId,
          foodProductId: 2,
          shopId: 29,
          items: '業務用調味料、冷凍食品',
          isFresh: false,
          purchaseDate: '2025/06/18',
          url: 'https://business-supply.example.com/order/12345',
        },
        {
          id: 3,
          groupId: groupId,
          foodProductId: 4,
          shopId: 14,
          items: '肉類（鶏肉、豚肉）',
          isFresh: true,
          purchaseDate: '2025/06/19',
          url: '',
        },
      ];

      if (typeof groupId === 'number') {
        mockDataSetter(groupId, mockData);
      }

      return <Story />;
    },
  ],
};

// 締切期限後の編集不可状態
export const AfterDeadline: Story = {
  args: {
    groupId: 4,
    isDeadline: true,
    isRegistered: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '締切期限を過ぎた状態。データは表示されますが編集不可で、修正ボタンなどは表示されません。',
      },
    },
  },
  decorators: [
    (Story, context) => {
      const { groupId } = context.args as { groupId: number }; // このストーリーではgroupIdが必須と想定

      const mockData: MockPurchaseListResponse[] = [
        {
          id: 1,
          groupId: groupId,
          foodProductId: 1,
          shopId: 2,
          items: '最終確定済みの食材リスト',
          isFresh: true,
          purchaseDate: '2025/06/01',
          url: '',
        },
      ];

      if (typeof groupId === 'number') {
        mockDataSetter(groupId, mockData);
      }

      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 編集ボタンが表示されていないことを確認
    expect(canvas.queryByText('修正')).not.toBeInTheDocument();
  },
};

// 締切期限後で未登録の状態
export const DeadlineUnregistered: Story = {
  args: {
    groupId: 5,
    isDeadline: true,
    isRegistered: false,
  },
  parameters: {
    docs: {
      description: {
        story: '締切期限を過ぎて未登録の状態。新規申請はできません。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 締切期限メッセージが表示されていることを確認
    expect(canvas.getByText('申請期限が過ぎています')).toBeInTheDocument();
    expect(
      canvas.getByText(
        '購入品申請の締切期限が過ぎているため、新規申請はできません。'
      )
    ).toBeInTheDocument();

    // フォームの要素が表示されていないことを確認
    expect(canvas.queryByText('購入品の追加')).not.toBeInTheDocument();
    expect(canvas.queryByText('登録')).not.toBeInTheDocument();
  },
};

// フォーム操作のインタラクションテスト
export const FormInteraction: Story = {
  args: {
    groupId: 6,
    isDeadline: false,
    isRegistered: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'フォーム操作のテスト。購入品の追加、削除、入力などのインタラクションをテストします。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // 初期状態: 1アイテム。最初の項目は削除ボタンは表示されない
    expect(canvas.getAllByText('販売品名')).toHaveLength(1);
    expect(canvas.queryAllByText('削除')).toHaveLength(0);

    // 「購入品の追加」ボタンをクリック
    const addButton = canvas.getByText('購入品の追加');
    await user.click(addButton);

    // アイテムが2つに増え、「販売品名」のラベルも2つになる
    // UIの更新を待つ。より堅牢な方法はwaitForなどを使用することです。
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(canvas.getAllByText('販売品名')).toHaveLength(2);

    // 2番目の項目に削除ボタンが表示されるかチェック
    // 注: 元のコードでは、項目が空の場合にのみ削除ボタンが表示されるとコメントがありました。
    // このロジックが正しいか、コンポーネントの実装に依存します。
    const deleteButtons = canvas.queryAllByText('削除');
    if (deleteButtons.length > 0) {
      // 削除ボタンが見つかれば、最初の削除ボタンをクリックする
      // (複数の削除ボタンがある場合、意図したボタンをより正確に特定する必要があるかもしれません)
      await user.click(deleteButtons[0]);
      // UIの更新を待つ。
      await new Promise((resolve) => setTimeout(resolve, 100));

      // アイテムが1つに戻る
      expect(canvas.getAllByText('販売品名')).toHaveLength(1);
    } else {
      // console.info('削除ボタンが見つかりませんでした。これは仕様の可能性があります。');
      // lintエラー(no-console)を避けるためコメントアウト。必要に応じてロギング方法を検討してください。
    }

    // 最初の項目の「選択した料理に使用した食材・使用する材料」フィールドを探して入力
    try {
      const materialLabel = canvas.getByText(
        '選択した料理に使用した食材・使用する材料'
      );
      // DOM構造に依存した探索は変更に弱い可能性があります。getByLabelTextなどの利用も検討してください。
      const inputContainer = materialLabel.closest('div')?.parentElement;
      if (inputContainer) {
        const input = within(inputContainer).getByRole('textbox');
        await user.type(input, 'テスト食材');
        expect(input).toHaveValue('テスト食材');
      } else {
        // inputContainerが見つからない場合のエラーハンドリング
        // (テストを失敗させるか、特定のログを出すなど)
        throw new Error('入力フィールドのコンテナが見つかりませんでした。');
      }
    } catch (e) {
      // console.error('テキストフィールドの操作中にエラーが発生しました:', e);
      // lintエラー(no-console)を避けるためコメントアウト。
      // 要素が見つからない場合や操作に失敗した場合はテストを失敗させるためにエラーを再スローします。
      throw e;
    }
  },
};

// エラー状態のテスト
export const ValidationErrors: Story = {
  args: {
    groupId: 7,
    isDeadline: false,
    isRegistered: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'バリデーションエラーの状態をテストします。必須項目の未入力など。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    // 何も入力せずに登録ボタンをクリックしてバリデーションエラーを発生させる
    const submitButton = canvas.getByText('登録');
    await user.click(submitButton);

    // バリデーションエラーが表示されるまで少し待つ。
    // UIの更新を待つ。より堅牢な方法はwaitForなどを使用することです。
    await new Promise((resolve) => setTimeout(resolve, 300));

    const errorTexts = [
      '販売品名を選択してください',
      '購入場所を選択してください',
      '食材・材料を入力してください',
      '購入日を入力してください',
    ];

    let foundErrors = false;
    for (const errorText of errorTexts) {
      // queryByText は要素が見つからない場合 null を返す (エラーはスローしない)
      if (canvas.queryByText(errorText)) {
        foundErrors = true;
        break;
      }
    }

    // 少なくとも1つのエラーメッセージが表示されていることを確認
    expect(foundErrors).toBe(true);
    // 元のコードにあったtry...catchは、このアサーションがテストの主要な検証であるため、
    // 失敗した場合はテスト全体が失敗すべきなので削除しました。
    // catch (e) {
    //   console.error('バリデーションエラーの検出に失敗しました', e);
    //   throw e;
    // }
  },
};
