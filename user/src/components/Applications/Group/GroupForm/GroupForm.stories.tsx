import { GROUP_CATEGORY } from '@/utils/constants';
import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import GroupApplicationForm from './GroupForm';

const mockGroupCategories = [
  { id: 1, name: '模擬店' },
  { id: 2, name: 'ステージ発表' },
  { id: 3, name: '展示' },
];

export default {
  title: 'Components/GroupApplicationForm',
  tags: ['autodocs'],
  component: GroupApplicationForm,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof GroupApplicationForm>;

type Story = StoryObj<typeof GroupApplicationForm>;

export const Default: Story = {
  args: {
    groupCategories: mockGroupCategories,
  },
};

export const Edit: Story = {
  args: {
    groupCategories: mockGroupCategories,
    groups: {
      id: 1,
      userId: 1,
      fesYearId: 1,
      name: '技大祭実行委員会',
      projectName: 'ギダイジャー',
      isInternational: false,
      isExternal: false,
      groupCategoryId: GROUP_CATEGORY.FOOD_SALES,
      activity: '技大祭の運営',
      committee: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    toEdit: () => console.log('Cancel edit'),
  },
};

export const Submitting: Story = {
  args: {
    groupCategories: mockGroupCategories,
  },
  parameters: {
    mockData: {
      createIsMutating: true,
    },
  },
};
