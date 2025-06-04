import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import EmployeesForm from './EmployeesForm';

export default {
  title: 'Components/EmployeesForm',
  tags: ['autodocs'],
  component: EmployeesForm,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof EmployeesForm>;

type Story = StoryObj<typeof EmployeesForm>;

export const Default: Story = {
  args: {},
};
