import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import PowerForm from './PowerForm';

export default {
  title: 'Components/PowerForm',
  tags: ['autodocs'],
  component: PowerForm,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof PowerForm>;

type Story = StoryObj<typeof PowerForm>;

export const Default: Story = {
  args: {},
};
