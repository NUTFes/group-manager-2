import { Meta, StoryObj } from '@storybook/react';
import GroupApplication from './GroupApplication';
import "@globals";

export default {
title: 'Components/GroupApplication',
tags: ["autodocs"],
component: GroupApplication,
parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof GroupApplication>;

type Story = StoryObj<typeof GroupApplication>;

export const Default: Story = {
  args: {

  },
};