import { Meta, StoryObj } from '@storybook/react';
import TermsOfService from './TermsOfService';
import "@globals";

export default {
title: 'Components/TermsOfService',
tags: ["autodocs"],
component: TermsOfService,
parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof TermsOfService>;

type Story = StoryObj<typeof TermsOfService>;

export const Default: Story = {
  args: {

  },
};