import '@globals';
import { zodResolver } from '@hookform/resolvers/zod';
import { Meta, StoryFn } from '@storybook/react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
    DEFAULT_PURCHASE_ITEM,
    NET_ORDER_SHOP_ID,
    OTHER_SHOP_ID,
} from '../constants';
import {
    PurchaseItem,
    PurchaseListsFormData,
    purchaseListsFormSchema,
} from '../schema';
import PurchaseListsForm, { PurchaseListsFormProps } from './PurchaseListsForm';

const FOOD_PRODUCT_OPTIONS = [
  { id: 0, name: '選択してください' },
  { id: 1, name: 'からあげ' },
  { id: 2, name: 'フランクフルト' },
  { id: 3, name: 'チョコバナナ' },
  { id: 4, name: 'たこやき' },
];

export default {
  title: 'Components/PurchaseListsForm',
  tags: ['autodocs'],
  component: PurchaseListsForm,
  parameters: {
    docs: {
      source: {
        type: 'auto',
      },
    },
  },
} as Meta<typeof PurchaseListsForm>;

const PurchaseListsFormWrapper: React.FC<
  Omit<
    PurchaseListsFormProps,
    | 'control'
    | 'fields'
    | 'append'
    | 'remove'
    | 'onSubmit'
    | 'onCancel'
    | 'errors'
    | 'isValid'
  > & {
    initialData?: PurchaseListsFormData;
    onSubmitCallback?: (data: PurchaseListsFormData) => void;
  }
> = ({
  foodProductOptions,
  initialData = { purchaseLists: [DEFAULT_PURCHASE_ITEM] },
  onSubmitCallback = (data) => console.log('Form submitted:', data),
  ...props
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseListsFormData>({
    resolver: zodResolver(purchaseListsFormSchema),
    defaultValues: initialData,
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'purchaseLists',
  });

  const onSubmit = handleSubmit(onSubmitCallback);

  const handleAppend = (item: Partial<PurchaseItem>) => {
    append(item as PurchaseItem);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <PurchaseListsForm
        control={control}
        fields={fields}
        append={handleAppend}
        remove={remove}
        onSubmit={onSubmit}
        errors={errors}
        foodProductOptions={foodProductOptions}
        {...props}
      />
    </div>
  );
};

const Template: StoryFn<typeof PurchaseListsFormWrapper> = (args) => {
  return <PurchaseListsFormWrapper {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  foodProductOptions: FOOD_PRODUCT_OPTIONS,
};

export const WithMultipleItems = Template.bind({});
WithMultipleItems.args = {
  foodProductOptions: FOOD_PRODUCT_OPTIONS,
  initialData: {
    purchaseLists: [
      {
        ...DEFAULT_PURCHASE_ITEM,
        foodProductId: 1,
        items: 'からあげ用の鶏肉',
        isFresh: true,
        shopId: 1,
        purchaseDate: '2025/6/15',
        remark: 'アピタで購入予定',
      },
      {
        ...DEFAULT_PURCHASE_ITEM,
        foodProductId: 2,
        items: 'フランクフルト',
        isFresh: false,
        shopId: 2,
        purchaseDate: '2025/6/16',
        remark: 'イオンで購入予定',
      },
    ],
  },
};

export const WithNetOrder = Template.bind({});
WithNetOrder.args = {
  foodProductOptions: FOOD_PRODUCT_OPTIONS,
  initialData: {
    purchaseLists: [
      {
        ...DEFAULT_PURCHASE_ITEM,
        foodProductId: 3,
        items: 'チョコレート、バナナ',
        isFresh: true,
        shopId: NET_ORDER_SHOP_ID, // ネット注文
        purchaseDate: '2025/6/20',
        url: 'https://example.com/chocolate-banana',
        remark: 'ネット注文で購入',
      },
    ],
  },
};

export const WithOtherShop = Template.bind({});
WithOtherShop.args = {
  foodProductOptions: FOOD_PRODUCT_OPTIONS,
  initialData: {
    purchaseLists: [
      {
        ...DEFAULT_PURCHASE_ITEM,
        foodProductId: 4,
        items: 'たこ焼き粉、たこ',
        isFresh: true,
        shopId: OTHER_SHOP_ID, // その他
        purchaseDate: '2025/6/18',
        remark:
          'ローカル商店\n住所: 長岡市○○町\n電話: 0258-XX-XXXX\n営業時間: 9:00-18:00',
      },
    ],
  },
};

export const EmptyForm = Template.bind({});
EmptyForm.args = {
  foodProductOptions: FOOD_PRODUCT_OPTIONS,
  initialData: {
    purchaseLists: [DEFAULT_PURCHASE_ITEM],
  },
};

export const WithValidationErrors = Template.bind({});
WithValidationErrors.args = {
  foodProductOptions: FOOD_PRODUCT_OPTIONS,
  initialData: {
    purchaseLists: [
      {
        ...DEFAULT_PURCHASE_ITEM,
        foodProductId: 0,
        items: '',
        shopId: 0,
        purchaseDate: '',
      },
    ],
  },
};
