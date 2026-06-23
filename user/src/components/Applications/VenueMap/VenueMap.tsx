import { FC, useState } from 'react';
import Image from 'next/image';
import AccordionMenu from '@/components/AccordionMenu/AccordionMenu';
import FormList from '@/components/FormList/FormList';
import { FormItem } from '@/components/FormList/type';
import Modal from '@/components/Modal/Modal';
import VenueMapForm from './VenueMapForm';
import { useVenueMapHooks } from './hooks';

type VenueMapProps = {
  groupId: number;
  isDeadline?: boolean;
  isRegistered?: boolean;
};

// Content コンポーネントの props 型定義を修正
type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline?: boolean;
  isEditing: boolean;
  toEdit: () => void;
  venueMapData: ReturnType<typeof useVenueMapHooks>['venueMap'];
  formItems: ReturnType<typeof useVenueMapHooks>['formItems'];
  groupId: number;
  handleFormSubmitted: () => void;
  venueMapTexts: ReturnType<typeof useVenueMapHooks>['venueMapTexts'];
};

const Content: FC<ContentProps> = ({
  isLoading,
  hasError,
  isDeadline,
  isEditing,
  toEdit,
  venueMapData,
  formItems,
  groupId,
  handleFormSubmitted,
  venueMapTexts,
}) => {
  if (isLoading) {
    return <div className="py-10 text-center">{venueMapTexts.loading}</div>;
  }

  if (hasError) {
    return (
      <div className="py-10 text-center text-red-500">
        {venueMapTexts.errors.fetch}
      </div>
    );
  }

  // 締め切り後は常にFormListを表示 (編集不可)
  if (isDeadline) {
    return <FormList items={formItems} />;
  }

  if (isEditing) {
    return (
      <VenueMapForm
        groupId={groupId}
        venueMap={venueMapData}
        toEdit={toEdit} // フォーム側でキャンセル時に使用
        onSubmitted={handleFormSubmitted}
      />
    );
  }

  if (formItems.length > 0) {
    return <FormList items={formItems} isEdit onEdit={toEdit} />;
  }

  return (
    <VenueMapForm
      groupId={groupId}
      venueMap={venueMapData}
      toEdit={toEdit}
      onSubmitted={handleFormSubmitted}
    />
  );
};

const VenueMap: FC<VenueMapProps> = ({ groupId, isDeadline, isRegistered }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const venueMapHooks = useVenueMapHooks(groupId);
  const {
    venueMap,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    handleFormSubmitted,
    venueMapTexts,
  } = venueMapHooks;

  const formItems: FormItem[] = venueMap
    ? [
        {
          label: venueMapTexts.summary.pictureLabel,
          content: venueMap.picturePath ? (
            <Image
              src={venueMap.picturePath}
              alt={venueMap.pictureName ?? ''}
              width={512}
              height={512}
              className="h-auto w-full cursor-pointer rounded object-contain"
              onClick={() => setIsModalOpen(true)}
            />
          ) : (
            venueMapTexts.summary.notSet
          ),
        },
      ]
    : [];

  return (
    <>
      <AccordionMenu
        title={venueMapTexts.title}
        isEdit={!isDeadline}
        isExist={isRegistered}
        required
      >
        <Content
          isLoading={isLoading}
          hasError={hasError}
          isDeadline={isDeadline}
          isEditing={isEditing}
          toEdit={toEdit}
          venueMapData={venueMap}
          formItems={formItems}
          groupId={groupId}
          handleFormSubmitted={handleFormSubmitted}
          venueMapTexts={venueMapTexts}
        />
      </AccordionMenu>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {venueMap?.picturePath && (
          <div
            className="relative h-[80vh] w-[80vw] max-w-[880px]"
            onClick={() => setIsModalOpen(false)}
          >
            <Image
              src={venueMap.picturePath}
              alt={venueMap.pictureName ?? ''}
              fill
              className="object-contain"
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default VenueMap;
