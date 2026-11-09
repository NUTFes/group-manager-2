import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import MultiItemFormButton from './MultiItemFormButton';

export default {
  title: 'Components/MultiItemFormButton',
  tags: ['autodocs'],
  component: MultiItemFormButton,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof MultiItemFormButton>;

type Story = StoryObj<typeof MultiItemFormButton>;

export const Default: Story = {
  args: {
    children: '登録',
    size: 'pc',
    color: 'add',
    type: 'button',
    onClick: () => alert('clicked'),
    isDisable: true,
  },
};
