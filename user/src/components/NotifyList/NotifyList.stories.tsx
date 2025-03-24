import { Announcement } from '@/types/announcement';
import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import NotifyList from './NotifyList';

export default {
  title: 'Components/NotifyList',
  tags: ['autodocs'],
  component: NotifyList,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof NotifyList>;

type Story = StoryObj<typeof NotifyList>;

const announcements: Announcement[] = [
  {
    id: 1,
    group_id: 1,
    message: '○○○○の申請が始まりました。',
    status: 'active',
    created_at: '2024-04-25T09:00:00Z',
    updated_at: '2024-04-25T09:00:00Z',
  },
  {
    id: 2,
    group_id: 1,
    message: '○○○○の申請が始まりました。',
    status: 'active',
    created_at: '2024-04-25T09:00:00Z',
    updated_at: '2024-04-25T09:00:00Z',
  },
  {
    id: 3,
    group_id: 1,
    message: '○○○○の申請が始まりました。',
    status: 'active',
    created_at: '2024-04-25T09:00:00Z',
    updated_at: '2024-04-25T09:00:00Z',
  },
  {
    id: 4,
    group_id: 1,
    message: '○○○○の申請が始まりました。',
    status: 'active',
    created_at: '2024-04-25T09:00:00Z',
    updated_at: '2024-04-25T09:00:00Z',
  },
  {
    id: 5,
    group_id: 1,
    message: '○○○○の申請が始まりました。',
    status: 'active',
    created_at: '2024-04-25T09:00:00Z',
    updated_at: '2024-04-25T09:00:00Z',
  },
];

export const Default: Story = {
  args: { announcements: announcements },
};
