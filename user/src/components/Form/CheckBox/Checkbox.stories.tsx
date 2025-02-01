import { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';
import "../../styles/globals.css";

export default {
title: 'Components/Checkbox',
tags: ["autodocs"],
component: Checkbox,
parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {

  },
};