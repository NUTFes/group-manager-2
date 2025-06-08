import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import CookingProcessOrderForm from './CookingProcessOrderForm';

export default {
  title: 'Components/Applications/CookingProcessOrderForm',
  tags: ['autodocs'],
  component: CookingProcessOrderForm,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof CookingProcessOrderForm>;

type Story = StoryObj<typeof CookingProcessOrderForm>;

export const Default: Story = {
  args: {},
};
