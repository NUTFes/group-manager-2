import { Meta, StoryObj } from '@storybook/react';
import PurchaseLists from './PurchaseLists';
import { FES_DATE_ID, NET_ORDER_SHOP_ID } from './constants';
import { PurchaseItem } from './schema';

const getStorageKey = (groupId: number) =>
  `purchase_lists_group_${groupId}_new`;

// モックデータ操作関数
const mockDataSetter = (
  groupId: number,
  data: (PurchaseItem & { groupId: number })[]
) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(getStorageKey(groupId), JSON.stringify(data));
  }
};

const clearMockData = (groupId: number) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(getStorageKey(groupId));
  }
};

// Storybookの基本設定
export default {
  title: 'Components/PurchaseLists',
  component: PurchaseLists,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '購入品申請を行うためのコンポーネント。',
      },
    },
  },
  argTypes: {
    groupId: {
      control: 'number',
      description: 'データを一意に識別するためのグループID。',
      table: {
        defaultValue: { summary: '1' },
      },
    },
    canAdd: {
      control: 'boolean',
      description: '新規追加が可能かどうかのフラグ。',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    canEdit: {
      control: 'boolean',
      description: '編集・削除が可能かどうかのフラグ。',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    isRegistered: {
      control: 'boolean',
      description:
        '申請データが登録済みとして扱うかのフラグ。AccordionMenuのisExistに影響します。',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} as Meta<typeof PurchaseLists>;

type Story = StoryObj<typeof PurchaseLists>;

// --- 各シナリオのStory定義 ---

/**
 * 新規に購入品を申請するシナリオ。
 * フォームが表示され、ユーザーは購入情報を入力できます。
 */
export const NewApplication: Story = {
  args: {
    groupId: 100,
    canAdd: true,
    canEdit: true,
    isRegistered: false,
  },
  decorators: [
    (Story, context) => {
      const { groupId } = context.args as { groupId: number };
      clearMockData(groupId);
      return <Story />;
    },
  ],
};

/**
 * 既に登録済みの購入品データが存在するシナリオ。
 * データはFormList形式で表示され、「修正する」ボタンから編集モードに移行できます。
 */
export const WithExistingData: Story = {
  args: {
    groupId: 202,
    canAdd: true,
    canEdit: true,
    isRegistered: true,
  },
  decorators: [
    (Story, context) => {
      const { groupId } = context.args as { groupId: number };
      clearMockData(groupId);
      const mockData: (PurchaseItem & { groupId: number })[] = [
        {
          id: Date.now(),
          foodProductId: 1,
          items: '新鮮な野菜セット（キャベツ、トマト、きゅうり）',
          isFresh: true,
          shopId: 1,
          purchaseDate: '2025/07/15',
          fesDateId: FES_DATE_ID,
          url: '',
          remark: '特売品',
          groupId: groupId,
        },
        {
          id: Date.now() + 1,
          foodProductId: 2,
          items: '冷凍シーフードミックス, パスタソース',
          isFresh: false,
          shopId: NET_ORDER_SHOP_ID,
          purchaseDate: '2025/07/10',
          fesDateId: FES_DATE_ID,
          url: 'https://example.com/seafood-mix',
          remark: '',
          groupId: groupId,
        },
      ];
      mockDataSetter(groupId, mockData);
      return <Story />;
    },
  ],
};

/**
 * 申請期限が過ぎており、登録済みのデータが存在するシナリオ。
 * データは表示されますが、編集や削除は行えません。
 */
export const AfterDeadlineWithData: Story = {
  args: {
    groupId: 203,
    canAdd: false,
    canEdit: false,
    isRegistered: true,
  },
  decorators: [
    (Story, context) => {
      const { groupId } = context.args as { groupId: number };
      clearMockData(groupId);
      const mockData: (PurchaseItem & { groupId: number })[] = [
        {
          id: Date.now(),
          foodProductId: 4,
          items: 'たこ、小麦粉、ソース',
          isFresh: false,
          shopId: 13,
          purchaseDate: '2025/06/01',
          fesDateId: FES_DATE_ID,
          url: '',
          remark: '最終確定済みデータ',
          groupId: groupId,
        },
      ];
      mockDataSetter(groupId, mockData);
      return <Story />;
    },
  ],
};

/**
 * 申請期限が過ぎており、登録済みのデータも存在しないシナリオ。
 * 新規申請・編集不可のメッセージが表示されます。
 */
export const AfterDeadlineNoData: Story = {
  args: {
    groupId: 204,
    canAdd: false,
    canEdit: false,
    isRegistered: false,
  },
  decorators: [
    (Story, context) => {
      const { groupId } = context.args as { groupId: number };
      clearMockData(groupId);
      return <Story />;
    },
  ],
};

/**
 * 備考欄が必須となる「その他」の店舗を選択した場合のバリデーション確認用（FormList表示）。
 * ユーザーが手動で操作して確認するシナリオ。
 */
export const ForOtherShopValidation: Story = {
  args: {
    groupId: 205,
    canAdd: true,
    canEdit: true,
    isRegistered: false,
  },
  decorators: [
    (Story, context) => {
      const { groupId } = context.args as { groupId: number };
      clearMockData(groupId);

      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          '「購入場所」で「その他」を選択した際に、備考欄が必須となるバリデーションを確認するための初期状態です。フォームを手動で操作して確認してください。',
      },
    },
  },
};
