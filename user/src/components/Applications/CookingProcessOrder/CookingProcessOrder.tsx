import { FC } from 'react';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import CookingProcessOrderForm from './CookingProcessOrderForm';
import { useCookingProcessOrder } from './hooks';

type CookingProcessOrderProps = {
  isEdit: boolean;
  isRegistered: boolean | undefined;
  groupId: number;
};

const CookingProcessOrder: FC<CookingProcessOrderProps> = ({
  isEdit,
  isRegistered,
  groupId,
}) => {
  const {
    mergedData,
    isLoading,
    isExist,
    isEditing,
    handleEditClick,
    mutateCookingProcessOrders,
  } = useCookingProcessOrder(groupId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const onSuccess = () => {
    mutateCookingProcessOrders();
    handleEditClick();
  };

  return (
    <AccordionMenu
      title="調理工程申請"
      note="販売品申請を先に申請してください。"
      isEdit={isEdit}
      isExist={isExist}
      isRegistered={isRegistered}
      required
    >
      {mergedData.length === 0 && !isLoading && (
        <div>
          申請対象の販売品がありません。先に販売品申請を行ってください。
        </div>
      )}
      {mergedData.map(({ foodProduct, cookingProcessOrder }) => (
        <div key={foodProduct.id} className="mb-8">
          <div className="relative mb-4 h-16 w-72">
            <div className="absolute left-0 top-0 h-3.5 w-72">
              <div className="text-font-color absolute left-0 top-0 justify-start font-['Noto_Sans_JP'] text-xs font-black">
                販売品名
              </div>
            </div>
            <div className="absolute left-0 top-[25px] h-9 w-72">
              <div className="text-font-color absolute left-0 top-0 justify-start font-['Noto_Sans_JP'] text-base font-medium">
                {foodProduct.name}
              </div>
            </div>
          </div>

          {isEditing ? (
            <CookingProcessOrderForm
              groupId={groupId}
              foodProductId={foodProduct.id}
              foodProductName={foodProduct.name}
              onSuccess={onSuccess}
              defaultValues={cookingProcessOrder}
            />
          ) : (
            <FormList
              items={
                cookingProcessOrder
                  ? [
                      {
                        label: '調理場の仕様有無(営業前)',
                        content: cookingProcessOrder.preOpenKitchen
                          ? '使用する'
                          : '使用しない',
                      },
                      {
                        label: '調理場の仕様有無(営業中)',
                        content: cookingProcessOrder.duringOpenKitchen
                          ? '使用する'
                          : '使用しない',
                      },
                      {
                        label: '調理内容',
                        content: cookingProcessOrder.tent || '',
                      },
                    ]
                  : [{ label: '調理工程', content: '未登録' }]
              }
              isEdit={isEdit}
              onEdit={handleEditClick}
            />
          )}
        </div>
      ))}
    </AccordionMenu>
  );
};

export default CookingProcessOrder;
