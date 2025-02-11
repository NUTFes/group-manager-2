import React, { useState } from "react";
import { Meta, StoryObj, StoryFn } from "@storybook/react";
import Selector from "./Selector";
import "@globals";

export default {
  title: "Components/Selector",
  tags: ["autodocs"],
  component: Selector,
  argTypes: {
    options: {
      control: "object",
    },
  },
  parameters: {
    docs: {
      source: {
        type: "auto",
      },
    },
  },
} as Meta<typeof Selector>;

const Template: StoryFn<typeof Selector> = (args) => {
  const [value, setValue] = useState(args.value);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    args.onChange?.(newValue);
  };

  return <Selector {...args} value={value} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {
  label: "サンプルラベル",
  value: "",
  required: false,
  note: "注意書きなど",
  error: "",
  options: [
    { id: "", name: "選択してください" },
    { id: "1", name: "オプション1" },
    { id: "2", name: "オプション２" },
  ],
};
