import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import ViceRepresentativeForm from './ViceRepresentativeForm';

type Story = StoryObj<typeof ViceRepresentativeForm>;

export default {
  title: 'Components/ViceRepresentativeForm',
  tags: ['autodocs'],
  component: ViceRepresentativeForm,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof ViceRepresentativeForm>;

export const Default: Story = {
  args: {},
};
