import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import CookingProcessOrder from './CookingProcessOrder';

export default {
  title: 'Components/Applications/CookingProcessOrder',
  tags: ['autodocs'],
  component: CookingProcessOrder,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof CookingProcessOrder>;

type Story = StoryObj<typeof CookingProcessOrder>;

export const Default: Story = {
  args: {},
};
