import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Employees from './Employees';

export default {
  title: 'Components/Employees',
  tags: ['autodocs'],
  component: Employees,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Employees>;

type Story = StoryObj<typeof Employees>;

export const Default: Story = {
  args: {},
};
