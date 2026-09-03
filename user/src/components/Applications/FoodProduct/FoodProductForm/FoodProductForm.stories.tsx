import type { Meta, StoryObj } from '@storybook/react';
import FoodProductForm from './FoodProductForm';

const meta = {
  title: 'Components/FoodProductForm',
  component: FoodProductForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    groupId: {
      control: 'number',
      description: '団体ID（既存データ取得に使用）',
    },
    toEdit: {
      action: 'toggled edit mode',
      description: '編集モードを切り替える関数',
    },
  },
} satisfies Meta<typeof FoodProductForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupId: 0,
    toEdit: () => console.log('Edit mode toggled'),
  },
};
