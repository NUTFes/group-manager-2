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
      group: { id: 1, name: 'nutfes' },
      assignRentalItems: [
        {
          rentalItemName: '机',
          stockPlaceName: 'AL1',
          rentalPlaceName: '',
          num: 1,
        },
        {
          rentalItemName: '椅子',
          stockPlaceName: 'AL2',
          rentalPlaceName: 'AL2',
          num: 4,
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
      group: { id: 1, name: 'nutfes' },
      assignRentalItems: [],
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
