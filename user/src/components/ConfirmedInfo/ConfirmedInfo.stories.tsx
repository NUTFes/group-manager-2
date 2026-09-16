import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import ConfirmedInfo from './ConfirmedInfo';

export default {
  title: 'Components/ConfirmedInfo',
  tags: ['autodocs'],
  component: ConfirmedInfo,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof ConfirmedInfo>;

type Story = StoryObj<typeof ConfirmedInfo>;

// 実際のAPIが返すのと同じ形式（data URI）。上のURLをQRコード化したもの
const QRCODE_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQAAAABRBrPYAAADn0lEQVR4nO1aMZKsOgy02MBkHAHfhJMNNnAybmJu8MggGPy6Be/HBP7lWWqoqV0v00GrZEktaat05/lTmVvPF/aFfWGPgi2CpzapNmZ3g4gXh5fV7hK/kFCSW2aYT+nAr118Mw8pTinSajsHixQYy3LLC0vqONnaYe3C3h1wqGmP3dHddWFu/wcMfhzN8m7msDu/utGm8DHcssKWAGObBJ9WNsJkjdYP4ZYNJgnuawMCdjMjwnPvfKORa9q0FeaWF4Z8W8Gndvb1AgNfzXzon2FH6nVluWWFtVSZm5ng0L37wWHlT5wH1Z+hJLfMsCQona6naawvvY093to41AzestyywmDO8rMhTpe3yKCBOdTGr3KoeAglueWFtbDuBffZaGw6kI7qJW0tklKwV6b6eBNuwhZp4qSuHHeU0XlYXaqXYVtQWOVRGglea99NqlQdvcUNNcVSpWYO4opyywtjZZlW17OyRNlQXmdhoWlRYnAOJbllhk0rtb1QDSIXtb6m6GUS1rRclltW2KWOzg98ahit8YzQZ8Upbm8LlTs0KKYtbnJvZ2RgCKQhzdrRfL4JN2H0qVAmsdyMvMwdDjAcMinYJ2kkVhmUFeGHhfVdoz+9BPDDdC8KKHKv1whlP05N2J7SNxTmlhe2HOhiUE/PHs3OOGhfQ314aN/68SbchLW4tH47xTzurXmJwGRZqXinZ/WnfoNIYLKFH710PynxNcdlST37C0y4D5MrNnldofApHjhgQUp+kkY6TTMe1VPf9TuVIWTwQF+7otzywloOAzdG6GgTGtVK39BYG0tzyw3jeAGVFEKXtzdxbkbB0O9XY/4LTLgFQ9alOjoVLxQ+UjFsDHAxy00syi0zbGLrTbsqy9EZAhYX+Kynz5o50HGydp6u5LQB1h1cysxBA7Yot7wwCt13E3FjIX0rHQlyQUO36gKuJLe8MOpeWZ05Bw5UR51vuLBQz8ai3DLDmIWa+Yeil/oh2IjIFSp8Z/YnTUGRgiIbGb2uelh8M6uWON//AhPuwf7txMX59WrTPHepToP0Sbn33IlzrpKaS0KgsPYattyMF+WWF3auJKbEHTGaNRRTKkPu4Nyzcu/5LG/hBuqlXUxgI9OlFMdH1dPr0a2imzbdRtno6WLa/gnccsGunThKDPSDTSoYmIjGcxxalFtemO7EzUvc+c8qvbYzXKrWbVWaW1bYtRMXVk8OzWT7bwLMrXFRbl/YF/aFFYL9BeoUL0L3KlsfAAAAAElFTkSuQmCC';

export const Default: Story = {
  args: {
    isLoading: false,
    hasError: false,
    getShareUrl: () =>
      'https://example.com/confirmed?group_id=1&secret=xxxxxxxx',
    qrcodePng: QRCODE_PNG,
    confirmedInfo: {
      group: {
        id: 1,
        name: 'nutfes',
        projectName: '〇〇カフェ',
        places: ['講義棟103'],
      },
      rentalItems: [
        {
          rentalItemName: '机',
          rentalPlaceName: '講義棟103',
          // 同じ物品を複数の在庫場所から借りるケース
          stocks: [
            {
              stockPlaceName: '講義棟103',
              num: 10,
              remark: '脚が折れているものが1台含まれます',
            },
            // 備考が長い場合にセル内で折り返ること
            {
              stockPlaceName: '講義棟104',
              num: 3,
              remark:
                '天板に汚れあり。使用前に確認してください。返却時も同様にご確認をお願いします',
            },
          ],
        },
        {
          rentalItemName: '椅子',
          rentalPlaceName: '講義棟103',
          stocks: [{ stockPlaceName: '講義棟103', num: 20, remark: null }],
        },
      ],
    },
  },
};

// 会場・企画名・貸出場所がいずれも未設定の状態。
// QRコードは別APIから取るため、取得できていない場合の表示も兼ねる
export const Unassigned: Story = {
  args: {
    isLoading: false,
    hasError: false,
    getShareUrl: () =>
      'https://example.com/confirmed?group_id=1&secret=xxxxxxxx',
    confirmedInfo: {
      group: { id: 1, name: 'nutfes', projectName: null, places: [] },
      rentalItems: [
        {
          rentalItemName: '長机',
          rentalPlaceName: '',
          stocks: [{ stockPlaceName: '体育館倉庫', num: 1, remark: null }],
        },
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    isLoading: false,
    hasError: false,
    getShareUrl: () =>
      'https://example.com/confirmed?group_id=1&secret=xxxxxxxx',
    confirmedInfo: {
      group: {
        id: 1,
        name: 'nutfes',
        projectName: '〇〇カフェ',
        places: ['講義棟103'],
      },
      rentalItems: [],
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    hasError: false,
    getShareUrl: () => '',
  },
};

export const Error: Story = {
  args: {
    isLoading: false,
    hasError: true,
    getShareUrl: () => '',
  },
};
