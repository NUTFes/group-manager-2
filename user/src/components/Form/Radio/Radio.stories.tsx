import { Meta, StoryObj } from '@storybook/react';
import Radio from './Radio';
import "../../styles/globals.css";

export default {
title: 'Components/Radio',
tags: ["autodocs"],
component: Radio,
parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof Radio>;

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {

  },
};