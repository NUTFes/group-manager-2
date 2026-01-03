import type { Meta, StoryObj } from '@storybook/react';
// import { rest } from 'msw';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VenueMapForm from './VenueMapForm';

const meta = {
  title: 'Components/VenueMapForm',
  component: VenueMapForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <ToastContainer />
      </>
    ),
  ],
  parameters: {
    // layout: 'fullscreen',
  },
  argTypes: {
    groupId: { control: 'number', description: 'グループID' },
  },
} satisfies Meta<typeof VenueMapForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockVenueMapData = {
  id: 1,
  groupId: 1,
  pictureName: 'existing_map.png',
  picturePath: 'https://placehold.co/400x400.png',
  trashPosition: true,
  foodStorage: true,
  allItemsListed: true,
  fireHazardousMaterials: false,
  partitionPlacement: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// --- ストーリーの定義 ---

export const Default: Story = {
  args: {
    groupId: 1,
  },
  // parameters: {
  //   msw: {
  //     handlers: [
  //       rest.get('/api/v1/groups/1/venue_map', (req, res, ctx) => {
  //         return res(ctx.status(200), ctx.json({ data: null }));
  //       }),
  //       rest.post('/api/v1/venue_maps', (req, res, ctx) => {
  //         return res(ctx.status(201), ctx.json({ data: mockVenueMapData }));
  //       }),
  //     ],
  //   },
  // },
};

export const Editing: Story = {
  args: {
    groupId: 1,
    venueMap: mockVenueMapData,
  },
  // parameters: {
  //   msw: {
  //     handlers: [
  //       rest.get('/api/v1/groups/1/venue_map', (req, res, ctx) => {
  //         return res(ctx.status(200), ctx.json({ data: mockVenueMapData }));
  //       }),
  //       rest.patch('/api/v1/venue_maps/1', (req, res, ctx) => {
  //         return res(ctx.status(200), ctx.json({ data: mockVenueMapData }));
  //       }),
  //     ],
  //   },
  // },
};
