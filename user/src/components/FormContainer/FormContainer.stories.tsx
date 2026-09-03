import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import FormContainer from './FormContainer';

export default {
  title: 'Components/FormContainer',
  tags: ['autodocs'],
  component: FormContainer,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof FormContainer>;

type Story = StoryObj<typeof FormContainer>;

export const Default: Story = {
  args: {},
};
