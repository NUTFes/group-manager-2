import { Meta, StoryObj } from '@storybook/react';
import ViceRepresentative from './ViceRepresentative';
import "@globals";

export default {
title: 'Components/ViceRepresentative',
tags: ["autodocs"],
component: ViceRepresentative,
parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof ViceRepresentative>;

type Story = StoryObj<typeof ViceRepresentative>;

export const Default: Story = {
  args: {

  },
};