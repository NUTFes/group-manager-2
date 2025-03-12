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
  { id: '1', name: 'B1[学部1年]' },
  { id: '2', name: 'B2[学部2年]' },
  { id: '3', name: 'B3[学部3年]' },
  { id: '4', name: 'B4[学部4年]' },
  { id: '5', name: 'M1[修士1年]' },
  { id: '6', name: 'M2[修士2年]' },
  { id: '7', name: 'D1[博士1年]' },
  { id: '8', name: 'D2[博士2年]' },
  { id: '9', name: 'D3[博士3年]' },
  { id: '10', name: 'GD1[イノベ1年]' },
  { id: '11', name: 'GD2[イノベ2年]' },
  { id: '12', name: 'GD3[イノベ3年]' },
  { id: '13', name: 'GD4[イノベ4年]' },
  { id: '14', name: 'GD5[イノベ5年]' },
  { id: '15', name: '教員:university staff' },
  { id: '16', name: 'その他:other' },
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
    label: 'test',
    required: false,
    note: '注意書き',
    error: 'エラー',
    options: options,
  },
};
