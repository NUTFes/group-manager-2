import { Meta, StoryObj } from "@storybook/react";
import TextArea from "./TextArea";
import "@globals";

export default {
  title: "Components/TextArea",
  tags: ["autodocs"],
  component: TextArea,
  parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof TextArea>;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {},
};
