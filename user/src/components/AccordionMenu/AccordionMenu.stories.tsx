import '@globals';
import { Meta, StoryObj } from '@storybook/react';
import Button from '../Button';
import AccordionMenu from './AccordionMenu';

export default {
  title: 'Components/AccordionMenu',
  component: AccordionMenu,
} as Meta<typeof AccordionMenu>;

export const Default: StoryObj<typeof AccordionMenu> = {
  render: (args) => {
    return <AccordionMenu {...args} />;
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

export const Test: StoryObj<typeof AccordionMenu> = {
  render: (args) => {
    return (
      <AccordionMenu {...args}>
        <form>
          <Button size="pc" color="main" isDisable={false} type="button">
            Button
          </Button>
        </form>
      </AccordionMenu>
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
