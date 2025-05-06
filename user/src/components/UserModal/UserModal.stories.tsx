import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import UserModal from './UserModal';

export default {
  title: 'Components/UserModal',
  tags: ['autodocs'],
  component: UserModal,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof UserModal>;

type Story = StoryObj<typeof UserModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {
      console.log('Modal closed');
    },
    user: {
      id: 1,
      email: 's223301@stn.nagaokaut.ac.jp',
      name: 'John Doe',
      role_id: 1,
      created_at: '2023-10-01T00:00:00Z',
      updated_at: '2023-10-01T00:00:00Z',
    },
  },
};
