import { FC } from 'react';
import Button from '@/components/Button/Button';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import { SHOP_OPTIONS } from '../constants';
import { PurchaseLists, PurchaseListsSummaryViewProps } from '../types';

export const createFormItemsForPurchaseLists = (
  item: PurchaseLists,
  foodProductOptions: { id: number; name: string }[]
): FormItem[] => {
  const items: FormItem[] = [];

  const shopName =
    SHOP_OPTIONS.find((shop) => shop.id === item.shopId)?.name || '不明';
  const foodProductName =
    foodProductOptions.find((product) => product.id === item.foodProductId)
      ?.name || '不明';

  items.push({ label: '販売品名', content: foodProductName });
  items.push({ label: '食材・材料', content: item.items });
  items.push({
    label: '商品の種類',
    content: item.isFresh ? '生鮮品' : '加工品',
  });
  items.push({ label: '購入場所', content: shopName });
  items.push({ label: '購入日', content: item.purchaseDate });

  if (item.url) {
    items.push({ label: 'URL', content: item.url });
  }

  return items;
};

export const PurchaseListsSummaryView: FC<PurchaseListsSummaryViewProps> = ({
  purchaseLists,
  onEdit,
  onDeleteItem,
  isDeadline,
  foodProductOptions,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {purchaseLists.map((item, index) => (
        <div key={`bought-item-${index}`} className="mb-4">
          <FormList
            items={createFormItemsForPurchaseLists(item, foodProductOptions)}
            onEdit={isDeadline ? undefined : onEdit}
            isDelete={!isDeadline}
            onDelete={item.id ? () => onDeleteItem(item.id!) : undefined}
          />
        </div>
      ))}

      {!isDeadline && (
        <div className="flex w-full items-center justify-center gap-4">
          <Button
            size="pc"
            color="main"
            type="button"
            icon="pencil"
            onClick={onEdit}
          >
            修正
          </Button>
        </div>
      )}
    </div>
  );
};
