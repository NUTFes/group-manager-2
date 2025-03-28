import { Meta, StoryObj } from '@storybook/react';
import VenueApplication from './VenueApplication';
import "@globals";

export default {
title: 'Components/VenueApplication',
tags: ["autodocs"],
component: VenueApplication,
parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof VenueApplication>;

type Story = StoryObj<typeof VenueApplication>;

export const Default: Story = {
  args: {

  },
};