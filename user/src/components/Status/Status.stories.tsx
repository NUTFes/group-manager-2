import { Meta, StoryObj } from '@storybook/react';
import '../../styles/globals.css';
import Status from './Status';

export default {
  title: 'Components/Status',
  tags: ['autodocs'],
  component: Status,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Status>;

type Story = StoryObj<typeof Status>;

export const Default: Story = {
  args: {
    statusType: 'reception',
    status: 'open',
  },
};
