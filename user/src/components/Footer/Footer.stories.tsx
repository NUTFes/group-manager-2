import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Footer from './Footer';

export default {
  title: 'Components/Footer',
  tags: ['autodocs'],
  component: Footer,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Footer>;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
