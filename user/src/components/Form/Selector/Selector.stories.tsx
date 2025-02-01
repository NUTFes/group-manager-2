import { Meta, StoryObj } from '@storybook/react';
import Selector from './Selector';
import "../../styles/globals.css";

export default {
title: 'Components/Selector',
tags: ["autodocs"],
component: Selector,
parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof Selector>;

type Story = StoryObj<typeof Selector>;

export const Default: Story = {
  args: {

  },
};