import { PublicRelationResponse } from '@/api/publicRelationsApi';
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
    toEdit: {
      action: 'toggled edit mode',
      description: '編集モードを切り替える関数',
    },
    publicRelation: {
      description: '既存のPRデータ',
    },
  },
} satisfies Meta<typeof PublicRelationsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// モック用のPRデータ
const mockPublicRelation: PublicRelationResponse = {
  id: 1,
  groupId: 1,
  blurb: 'モックPRテキスト',
  pictureName: 'mock_image.png',
  picturePath: 'https://example.com/image.png',
  isAnnouncementRequested: true,
  createdAt: '2025-04-22T12:00:00Z',
  updatedAt: '2025-04-22T12:00:00Z',
};

export const Default: Story = {
  args: {
    groupId: 0, // デフォルト値
    toEdit: () => console.log('Edit mode toggled'),
  },
};

export const WithExistingData: Story = {
  args: {
    groupId: 1, // 実在する団体IDを指定
    toEdit: () => console.log('Edit mode toggled'),
    publicRelation: mockPublicRelation,
  },
};
