import '@globals';
import { Meta, StoryObj } from '@storybook/react';
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
      const { groupId } = context.args as { groupId?: number };

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
      const { groupId } = context.args as { groupId: number };

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
      const { groupId } = context.args as { groupId: number };

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
      const { groupId } = context.args as { groupId: number };

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
};
