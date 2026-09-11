import '@globals';
import type { Meta, StoryObj } from '@storybook/react';
import ImagePreview from './ImagePreview';

const meta = {
  title: 'Components/ImagePreview',
  component: ImagePreview,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ImagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: '/symbolmark.png',
    alt: '画像プレビューのサンプル',
  },
};

export const EmptyFallback: Story = {
  args: {
    src: null,
    alt: '画像プレビュー',
    emptyFallback: <p>画像が設定されていません</p>,
  },
};

export const CustomThumbnail: Story = {
  args: {
    src: '/symbolmark.png',
    alt: 'カスタムサイズの画像プレビュー',
    thumbnailClassName: 'h-32 w-64',
    unoptimized: true,
  },
};
