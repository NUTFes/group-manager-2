import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import EditButton from './EditButton';

export default {
  title: 'Components/EditButton',
  tags: ['autodocs'],
  component: EditButton,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof EditButton>;

type Story = StoryObj<typeof EditButton>;

export const Default: Story = {
  args: {},
};
