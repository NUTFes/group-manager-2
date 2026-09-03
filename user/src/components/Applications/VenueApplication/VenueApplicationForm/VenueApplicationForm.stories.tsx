import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import VenueApplicationForm from './VenueApplicationForm';

export default {
  title: 'Components/VenueApplicationForm',
  tags: ['autodocs'],
  component: VenueApplicationForm,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof VenueApplicationForm>;

type Story = StoryObj<typeof VenueApplicationForm>;

export const Default: Story = {
  args: {},
};
