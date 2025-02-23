import { Meta, StoryObj } from '@storybook/react';
import Status from './Status';
import "../../styles/globals.css";

export default {
title: 'Components/Status',
tags: ["autodocs"],
component: Status,
parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof Status>;

type Story = StoryObj<typeof Status>;

export const Default: Story = {
  args: {
    statusType:"reception",
    status:"open"
  },
};
