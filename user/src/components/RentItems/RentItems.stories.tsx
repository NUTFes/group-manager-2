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
        isEdit: true,
        isExist: false,
    },
};

export const Existing: Story = {
    args: {
        isEdit: true,
        isExist: true,
    },
};

export const Closed: Story = {
    args: {
        isEdit: false,
        isExist: false,
    },
};