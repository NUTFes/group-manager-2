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
    title: 'Accordion Title',
    isEdit: true,
    isExit: false,
    required: true,
    children: <div>Accordion content</div>,
  },
};
