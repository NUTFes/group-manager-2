import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import StageForm from './StageForm';

export default {
  title: 'Components/StageForm',
  tags: ['autodocs'],
  component: StageForm,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof StageForm>;

type Story = StoryObj<typeof StageForm>;

export const Default: Story = {
  args: {},
};
