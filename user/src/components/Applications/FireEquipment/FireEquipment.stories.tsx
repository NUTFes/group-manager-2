import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import FireEquipment from './FireEquipment';

export default {
  title: 'Components/FireEquipment',
  tags: ['autodocs'],
  component: FireEquipment,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof FireEquipment>;

type Story = StoryObj<typeof FireEquipment>;

export const Default: Story = {
  args: {
    groupId: 0,
    canAdd: true,
    canEdit: true,
    isRegistered: false,
  },
};
