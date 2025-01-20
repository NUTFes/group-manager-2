import { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";
import "../../styles/globals.css";

export default {
  title: "Components/Button",
  tags: ["autodocs"],
  component: Button,
  parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "登録",
    size: "pc",
    color: "main",
    variant: true,
    icon: "pencil",
    onClick: () => alert("clicked"),
  },
};
