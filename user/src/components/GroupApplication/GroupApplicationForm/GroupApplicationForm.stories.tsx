import { Meta, StoryObj } from '@storybook/react';
import GroupApplicationForm from './GroupApplicationForm';
import "@globals";

export default {
title: 'Components/GroupApplicationForm',
tags: ["autodocs"],
component: GroupApplicationForm,
parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof GroupApplicationForm>;

type Story = StoryObj<typeof GroupApplicationForm>;

export const Default: Story = {
  args: {

  },
};