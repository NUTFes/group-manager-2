import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Upload from './Upload';

export default {
  title: 'Components/Upload',
  tags: ['autodocs'],
  component: Upload,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Upload>;

type Story = StoryObj<typeof Upload>;

export const Default: Story = {
  args: {
    title: 'PR画像',
    note: [
      'ファイル形式：png、jpeg',
      'ファイルサイズ：10MB未満',
      '画像、イラストの形：正方形（できれば料理の写真)',
    ],
    error: '画像の送信に失敗しました。',
    onClick: () => alert('クリックされたよ'),
    idDisable: false,
  },
};
