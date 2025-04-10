import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import FormList from './FormList';
import { FormItem } from './type';

export default {
  title: 'Components/FormList',
  tags: ['autodocs'],
  component: FormList,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof FormList>;

type Story = StoryObj<typeof FormList>;

const testItems: FormItem[] = [
  { label: '団体名', content: 'わたあめ同好会', isEditable: true },
  { label: '企画名', content: 'わたあめ屋さん' },
  { label: '国際団体ですか？', content: 'いいえ' },
  { label: '学外団体ですか？', content: 'いいえ' },
  { label: '参加形式', content: '食品販売' },
  { label: '企画内容', content: 'わたあめの販売' },
];

export const Default: Story = {
  args: { items: testItems, onEdit: () => alert('押されたよ'), isEdit: true },
};
