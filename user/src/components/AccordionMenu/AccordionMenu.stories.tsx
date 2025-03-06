import { useState } from 'react';
import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import AccordionMenu from './AccordionMenu';

export default {
  title: 'Components/AccordionMenu',
  component: AccordionMenu,
} as Meta<typeof AccordionMenu>;

export const Default: StoryObj<typeof AccordionMenu> = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <AccordionMenu
        {...args}
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
      />
    );
  },
  args: {
    title: '副代表申請',
    isEdit: true,
    isExist: false,
    required: true,
    children: <div>Accordion content</div>,
    note: '個人参加者の場合のみ、副代表申請は不要です。',
  },
};
