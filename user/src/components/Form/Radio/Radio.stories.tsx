import React from 'react';
import '@globals';
import { useArgs } from '@storybook/preview-api';
import { Meta, StoryFn } from '@storybook/react';
import Radio from './Radio';

export default {
  title: 'Components/Radio',
  tags: ['autodocs'],
  component: Radio,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Radio>;

// サンプルの options データ
const sampleOptions = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' },
];

const Template: StoryFn<typeof Radio> = (args) => {
  // useArgs で現在の args と更新用関数を取得
  const [{ value }, updateArgs] = useArgs();

  // ラジオボタンの onChange イベントで args の value を更新
  const handleChange = (newValue: string) => {
    updateArgs({ value: newValue });
    if (args.onChange) {
      args.onChange(newValue);
    }
  };

  return <Radio {...args} value={value} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Choose an option',
  value: '2',
  onChange: (value: string) => console.log('Selected:', value),
  required: true,
  note: 'value の値によって，デフォルトの選択肢が選択されます',
  error: 'エラー',
  options: sampleOptions,
};
