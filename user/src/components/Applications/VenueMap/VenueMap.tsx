import { FC } from 'react';
import {
  HealthCenterSubmissionStatus,
  canEditApplication,
} from '@/api/healthCenterSubmissionStatusApi';
import AccordionMenu from '@/components/AccordionMenu';
import FormList from '@/components/FormList';
import { FormItem } from '@/components/FormList/type';
import ImagePreview from '@/components/ImagePreview';
import VenueMapForm from './VenueMapForm';
import { useVenueMapHooks } from './hooks';

type VenueMapProps = {
  groupId: number;
  isDeadline?: boolean;
  isRegistered?: boolean;
  status?: HealthCenterSubmissionStatus;
};

// Content コンポーネントの props 型定義を修正
type ContentProps = {
  isLoading: boolean;
  hasError: boolean;
  isDeadline?: boolean;
  isEditing: boolean | null;
  toEdit: () => void;
  venueMapData: ReturnType<typeof useVenueMapHooks>['venueMap'];
  formItems: FormItem[];
  groupId: number;
  handleFormSubmitted: () => void;
  venueMapTexts: ReturnType<typeof useVenueMapHooks>['venueMapTexts'];
  isResubmission?: boolean;
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
  isResubmission,
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

  if (isResubmission) {
    return (
      <VenueMapForm
        groupId={groupId}
        venueMap={venueMapData}
        toEdit={toEdit} // フォーム側でキャンセル時に使用
        onSubmitted={handleFormSubmitted}
      />
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

const VenueMap: FC<VenueMapProps> = ({
  groupId,
  isDeadline,
  isRegistered,
  status,
}) => {
  const venueMapHooks = useVenueMapHooks(groupId, isRegistered, status);
  const {
    venueMap,
    isLoading,
    hasError,
    isEditing,
    toEdit,
    handleFormSubmitted,
    venueMapTexts,
    isResubmission,
  } = venueMapHooks;

  const formItems: FormItem[] = venueMap
    ? [
        {
          label: venueMapTexts.summary.pictureLabel,
          content: (
            <ImagePreview
              src={venueMap.picturePath}
              alt={venueMap.pictureName ?? venueMapTexts.summary.pictureLabel}
              emptyFallback={venueMapTexts.summary.notSet}
            />
          ),
        },
      ]
    : [];

  return (
    <AccordionMenu
      title={venueMapTexts.title}
      isEdit={canEditApplication(isDeadline, status)}
      isExist={isRegistered}
      required
      status={status}
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
        isResubmission={isResubmission}
      />
    </AccordionMenu>
  );
};

export default VenueMap;
