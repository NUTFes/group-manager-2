import type { Meta, StoryObj } from '@storybook/react';
import PublicRelations from './PublicRelations';

const meta = {
  title: 'Components/PublicRelations',
  component: PublicRelations,
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
} satisfies Meta<typeof PublicRelations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupId: 1, // デフォルト値
    isDeadline: false, // デフォルト値
    isRegistered: false, // デフォルト値
  },
};
