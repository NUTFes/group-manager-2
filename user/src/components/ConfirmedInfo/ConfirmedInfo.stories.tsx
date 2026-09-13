import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import ConfirmedInfo from './ConfirmedInfo';

export default {
  title: 'Components/ConfirmedInfo',
  tags: ['autodocs'],
  component: ConfirmedInfo,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof ConfirmedInfo>;

type Story = StoryObj<typeof ConfirmedInfo>;

export const Default: Story = {
  args: {
    isLoading: false,
    hasError: false,
    getShareUrl: () =>
      'https://example.com/confirmed?group_id=1&secret=xxxxxxxx',
    confirmedInfo: {
      group: {
        id: 1,
        name: 'nutfes',
        projectName: '〇〇カフェ',
        places: ['講義棟103'],
      },
      rentalItems: [
        {
          rentalItemName: '机',
          rentalPlaceName: '講義棟103',
          // 同じ物品を複数の在庫場所から借りるケース
          stocks: [
            { stockPlaceName: '講義棟103', num: 10 },
            { stockPlaceName: '講義棟104', num: 3 },
          ],
        },
        {
          rentalItemName: '椅子',
          rentalPlaceName: '講義棟103',
          stocks: [{ stockPlaceName: '講義棟103', num: 20 }],
        },
      ],
    },
  },
};

// 会場・企画名・貸出場所がいずれも未設定の状態
export const Unassigned: Story = {
  args: {
    isLoading: false,
    hasError: false,
    getShareUrl: () =>
      'https://example.com/confirmed?group_id=1&secret=xxxxxxxx',
    confirmedInfo: {
      group: { id: 1, name: 'nutfes', projectName: null, places: [] },
      rentalItems: [
        {
          rentalItemName: '長机',
          rentalPlaceName: '',
          stocks: [{ stockPlaceName: '体育館倉庫', num: 1 }],
        },
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    isLoading: false,
    hasError: false,
    getShareUrl: () =>
      'https://example.com/confirmed?group_id=1&secret=xxxxxxxx',
    confirmedInfo: {
      group: {
        id: 1,
        name: 'nutfes',
        projectName: '〇〇カフェ',
        places: ['講義棟103'],
      },
      rentalItems: [],
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    hasError: false,
    getShareUrl: () => '',
  },
};

export const Error: Story = {
  args: {
    isLoading: false,
    hasError: true,
    getShareUrl: () => '',
  },
};
