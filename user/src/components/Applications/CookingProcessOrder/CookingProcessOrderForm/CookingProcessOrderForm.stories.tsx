import '@globals';
import { Meta, StoryContext, StoryFn, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import CookingProcessOrderForm from './CookingProcessOrderForm';

const FormProviderDecorator = (Story: StoryFn, context: StoryContext) => {
  const methods = useForm({
    defaultValues: {
      cookingProcessOrders: [
        {
          preOpenKitchen: false,
          duringOpenKitchen: false,
          tent: '',
          confirmCookingProcess: [],
        },
      ],
    },
  });

  return (
    <FormProvider {...methods}>
      <Story {...context} />
    </FormProvider>
  );
};

export default {
  title: 'Components/Applications/CookingProcessOrderForm',
  tags: ['autodocs'],
  component: CookingProcessOrderForm,
  decorators: [FormProviderDecorator],
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof CookingProcessOrderForm>;

type Story = StoryObj<typeof CookingProcessOrderForm>;

export const Default: Story = {
  args: {
    index: 0,
    foodProductName: 'コーヒー',
  },
};

export const WithSampleData: Story = {
  args: {
    index: 0,
    foodProductName: 'ケーキ',
  },
  decorators: [
    (Story) => {
      const methods = useForm({
        defaultValues: {
          cookingProcessOrders: [
            {
              preOpenKitchen: true,
              duringOpenKitchen: false,
              tent: '1. ケーキの材料を準備する\n2. オーブンを180度に予熱する\n3. 生地を作って焼く\n4. 冷ましてから盛り付ける',
              confirmCookingProcess: ['1', '2'],
            },
          ],
        },
      });

      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
};

export const EmptyForm: Story = {
  args: {
    index: 0,
    foodProductName: 'からあげ',
  },
};
