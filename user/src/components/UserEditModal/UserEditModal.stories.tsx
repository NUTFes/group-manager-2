import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import UserEditModal from './UserEditModal';

export default {
  title: 'Components/UserEditModal',
  tags: ['autodocs'],
  component: UserEditModal,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof UserEditModal>;

type Story = StoryObj<typeof UserEditModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {
      console.log('Modal closed');
    },
  },
};
