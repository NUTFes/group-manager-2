import type { Meta, StoryObj } from '@storybook/react';
import PublicRelationsForm from './PublicRelationsForm';

const meta = {
  title: 'Components/PublicRelationsForm',
  component: PublicRelationsForm,
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
} satisfies Meta<typeof PublicRelationsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupId: 0, // デフォルト値
  },
};

export const WithExistingData: Story = {
  args: {
    groupId: 1, // 実在する団体IDを指定
  },
};
