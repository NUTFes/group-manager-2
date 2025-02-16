import { Meta, StoryObj } from "@storybook/react";
import RegisterCarousel from "./RegisterCarousel";
import "@globals";

export default {
  title: "Components/Carousel",
  tags: ["autodocs"],
  component: RegisterCarousel,
  parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof RegisterCarousel>;

type Story = StoryObj<typeof RegisterCarousel>;

export const Default: Story = {
  args: {},
};
