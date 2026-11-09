import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Modal from './Modal';

export default {
  title: 'Components/Modal',
  tags: ['autodocs'],
  component: Modal,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Modal>;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: { isOpen: true, onClose: () => {} },
};
