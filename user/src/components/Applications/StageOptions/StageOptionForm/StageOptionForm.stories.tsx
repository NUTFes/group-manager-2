import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import StageOptionForm from './StageOptionForm';

export default {
  title: 'Components/StageOptionForm',
  tags: ['autodocs'],
  component: StageOptionForm,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof StageOptionForm>;

type Story = StoryObj<typeof StageOptionForm>;

export const Default: Story = {
  args: {},
};
