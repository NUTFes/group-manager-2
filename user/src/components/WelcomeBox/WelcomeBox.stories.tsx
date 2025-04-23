import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import WelcomeBox from './WelcomeBox';

export default {
  title: 'Components/WelcomeBox',
  tags: ['autodocs'],
  component: WelcomeBox,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof WelcomeBox>;

type Story = StoryObj<typeof WelcomeBox>;

export const Default: Story = {
  args: {},
};
