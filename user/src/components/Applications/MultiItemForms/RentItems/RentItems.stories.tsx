// src/components/RentItems/RentItems.stories.tsx
import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import RentItems from './RentItems';

export default {
  title: 'Components/RentItems',
  tags: ['autodocs'],
  component: RentItems,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof RentItems>;

type Story = StoryObj<typeof RentItems>;

export const Default: Story = {
  args: {
    canAdd: true,
    canEdit: true,
    isRegistered: false,
    groupId: 1,
  },
};

export const Existing: Story = {
  args: {
    canAdd: true,
    canEdit: true,
    isRegistered: true,
    groupId: 1,
  },
};

export const Closed: Story = {
  args: {
    canAdd: false,
    canEdit: false,
    isRegistered: false,
    groupId: 1,
  },
};
