import { useState } from 'react';
import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';

export default {
  title: 'Components/Checkbox',
  tags: ['autodocs'],
  component: Checkbox,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

type Option = {
  id: string;
  name: string;
};

const options: Option[] = [
  { id: '1', name: 'ゴミ箱の設置位置を記載しました。' },
  { id: '2', name: '保存場所を記載しました。' },
  { id: '3', name: '申請した物品をすべて平面図に記載しました。' },
  { id: '4', name: '火気・電化製品の使用場所を明記しました。' },
];

export const Default: Story = {
  render: (args) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    return (
      <Checkbox
        {...args}
        value={selectedValues}
        onChange={(newValues: string[]) => {
          setSelectedValues(newValues);
        }}
      />
    );
  },
  args: {
    label: '平面図確認事項',
    required: true,
    note: '注意書き',
    error: 'エラー',
    options: options,
  },
};
