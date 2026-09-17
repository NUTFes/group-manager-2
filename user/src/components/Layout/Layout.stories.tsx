import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Layout from './Layout';

export default {
  title: 'Components/Layout',
  tags: ['autodocs'],
  component: Layout,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof Layout>;

type Story = StoryObj<typeof Layout>;

export const Default: Story = {
  args: {
    headerOnClick: () => alert('Header button clicked from Storybook!'),
    children: (
      <div className="p-4">
        <h2 className="text-xl">Main Content Area</h2>
        <p>This is an example of the main content.</p>
      </div>
    ),
  },
};
