// src/components/RentItems/RentItemsForm/RentItemsForm.stories.tsx
import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import RentItemsForm from './RentItemsForm';

export default {
  title: 'Components/RentItemsForm',
  tags: ['autodocs'],
  component: RentItemsForm,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof RentItemsForm>;

type Story = StoryObj<typeof RentItemsForm>;

// 実際のAPIを使用する基本ストーリー
export const Default: Story = {};
