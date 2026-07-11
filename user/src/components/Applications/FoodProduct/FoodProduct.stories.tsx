import type { Meta, StoryObj } from '@storybook/react';
import FoodProduct from './FoodProduct';

const meta = {
  title: 'Components/FoodProduct',
  component: FoodProduct,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    groupId: {
      control: 'number',
      description: '団体ID（既存データ取得に使用）',
    },
  },
} satisfies Meta<typeof FoodProduct>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupId: 1,
    canAdd: true,
    canEdit: true,
    isRegistered: false,
  },
};
