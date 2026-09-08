import type { GetStaticProps } from 'next';
import { useGetCheckAllRegisteredGroups } from '@/api/checkAllRegisteredApi';
import { useGetGroupByUserId } from '@/api/groupApi';
import {
  HealthCenterSubmissionStatusResponse,
  useGetHealthCenterSubmissionStatus,
} from '@/api/healthCenterSubmissionStatusApi';
import {
  type UserPageSettings,
  useGetUserPageSettings,
} from '@/api/userPageSettingAPI';
import { GROUP_CATEGORY } from '@/utils/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CookingProcessOrder from '@/components/Applications/CookingProcessOrder';
import Employees from '@/components/Applications/Employees/Employees';
import FireEquipment from '@/components/Applications/FireEquipment';
import FoodProduct from '@/components/Applications/FoodProduct';
import Group from '@/components/Applications/Group';
import RentItems from '@/components/Applications/MultiItemForms/RentItems';
import Power from '@/components/Applications/Power';
import PublicRelations from '@/components/Applications/PublicRelations';
import PurchaseLists from '@/components/Applications/PurchaseLists/PurchaseLists';
import Stage from '@/components/Applications/Stage';
import StageOptions from '@/components/Applications/StageOptions';
import VenueApplications from '@/components/Applications/VenueApplication';
import VenueMap from '@/components/Applications/VenueMap';
import ViceRepresentative from '@/components/Applications/ViceRepresentative';
import NewsList from '@/components/NewsList';
import { useUser } from '@/hooks/useUser';

type CheckAllRegisteredGroups = {
  placeOrder?: boolean;
  rentalItem?: boolean;
  powerOrder?: boolean;
  publicRelation?: boolean;
  employee?: boolean;
  venueMap?: boolean;
  foodProduct?: boolean;
  purchaseList?: boolean;
  cookingProcessOrder?: boolean;
  stageOrder?: boolean;
  stageOption?: boolean;
  group?: boolean;
  subRep?: boolean;
  fireEquipmentOrder?: boolean;
};

type GroupCategoryContentProps = {
  groupCategoryId: number | undefined;
  userPageSettings: UserPageSettings | undefined;
  checkAllRegisteredGroups: CheckAllRegisteredGroups;
  groupId: number;
  mutateCheckAllRegisteredGroups: () => void;
  healthCenterSubmissionStatus:
    | HealthCenterSubmissionStatusResponse[]
    | undefined;
};

const GroupCategoryContent = ({
  groupCategoryId,
  userPageSettings,
  checkAllRegisteredGroups,
  groupId,
  mutateCheckAllRegisteredGroups,
  healthCenterSubmissionStatus,
}: GroupCategoryContentProps) => {
  const getStatus = (applicationType: string) =>
    healthCenterSubmissionStatus?.find(
      (submission) => submission.applicationType === applicationType
    )?.status;

  if (groupCategoryId === GROUP_CATEGORY.FOOD_SALES) {
    // 🍙 食品販売: 会場申請、物品申請、電力申請、PR文申請、従業員申請、模擬店平面図申請、販売品申請、購入品申請、調理工程申請、火器使用申請
    return (
      <>
        <VenueApplications
          isDeadline={!userPageSettings?.isEditPlace}
          isRegistered={checkAllRegisteredGroups?.placeOrder}
          groupId={groupId}
        />
        <RentItems
          isDeadline={!userPageSettings?.isEditRentalOrder}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
          status={getStatus('equipment')}
        />
        <Power
          isDeadline={!userPageSettings?.isEditPowerOrder}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
          status={getStatus('power_order')}
        />
        <PublicRelations
          isDeadline={!userPageSettings?.isEditPublicRelation}
          isRegistered={checkAllRegisteredGroups?.publicRelation}
          groupId={groupId}
        />
        <Employees
          isDeadline={!userPageSettings?.isEditEmployee}
          isRegistered={checkAllRegisteredGroups?.employee}
          mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
          groupId={groupId}
          status={getStatus('employee')}
        />
        <VenueMap
          isDeadline={!userPageSettings?.isEditVenueMap}
          isRegistered={checkAllRegisteredGroups?.venueMap}
          groupId={groupId}
          status={getStatus('venue_map')}
        />
        <FoodProduct
          groupId={groupId}
          isDeadline={!userPageSettings?.isEditFoodProduct}
          isRegistered={checkAllRegisteredGroups?.foodProduct}
          status={getStatus('food_product')}
        />
        <PurchaseLists
          isDeadline={!userPageSettings?.isEditPurchaseList}
          isRegistered={checkAllRegisteredGroups?.purchaseList}
          groupId={groupId}
          status={getStatus('purchase_list')}
        />
        <CookingProcessOrder
          isDeadline={!userPageSettings?.isEditCookingProcess}
          isRegistered={checkAllRegisteredGroups?.cookingProcessOrder}
          groupId={groupId}
          status={getStatus('cooking_process_order')}
        />
        <FireEquipment
          canAdd={userPageSettings?.addFireEquipmentOrder}
          canEdit={userPageSettings?.isEditFireEquipmentOrder}
          isRegistered={checkAllRegisteredGroups?.fireEquipmentOrder}
          groupId={groupId}
          status={getStatus('fire_equipment_order')}
        />
      </>
    );
  } else if (groupCategoryId === GROUP_CATEGORY.GOODS_SALES) {
    // 📦 物品販売: 会場申請、物品申請、電力申請、PR文申請、模擬店平面図申請
    return (
      <>
        <VenueApplications
          isDeadline={!userPageSettings?.isEditPlace}
          isRegistered={checkAllRegisteredGroups?.placeOrder}
          groupId={groupId}
        />
        <RentItems
          isDeadline={!userPageSettings?.isEditRentalOrder}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
          status={getStatus('equipment')}
        />
        <Power
          isDeadline={!userPageSettings?.isEditPowerOrder}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
          status={getStatus('power_order')}
        />
        <PublicRelations
          isDeadline={!userPageSettings?.isEditPublicRelation}
          isRegistered={checkAllRegisteredGroups?.publicRelation}
          groupId={groupId}
        />
        <VenueMap
          isDeadline={!userPageSettings?.isEditVenueMap}
          isRegistered={checkAllRegisteredGroups?.venueMap}
          groupId={groupId}
          status={getStatus('venue_map')}
        />
        <FoodProduct
          groupId={groupId}
          isDeadline={!userPageSettings?.isEditFoodProduct}
          isRegistered={checkAllRegisteredGroups?.foodProduct}
          status={getStatus('food_product')}
        />
        <FireEquipment
          canAdd={userPageSettings?.addFireEquipmentOrder}
          canEdit={userPageSettings?.isEditFireEquipmentOrder}
          isRegistered={checkAllRegisteredGroups?.fireEquipmentOrder}
          groupId={groupId}
          status={getStatus('fire_equipment_order')}
        />
      </>
    );
  } else if (groupCategoryId === GROUP_CATEGORY.STAGE) {
    // 🎤 ステージ団体: ステージ申請、ステージオプション申請、電力申請、PR文申請
    return (
      <>
        <RentItems
          isDeadline={!userPageSettings?.isEditRentalOrder}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
          status={getStatus('equipment')}
        />
        <Stage
          isDeadline={!userPageSettings?.isEditStageOrder}
          isRegistered={checkAllRegisteredGroups?.stageOrder}
          groupId={groupId}
        />
        <StageOptions
          isDeadline={!userPageSettings?.isEditStageCommonOption}
          isRegistered={checkAllRegisteredGroups?.stageOption}
          groupId={groupId}
        />
        <Power
          isDeadline={!userPageSettings?.isEditPowerOrder}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
          status={getStatus('power_order')}
        />
        <PublicRelations
          isDeadline={!userPageSettings?.isEditPublicRelation}
          isRegistered={checkAllRegisteredGroups?.publicRelation}
          groupId={groupId}
        />
      </>
    );
  } else if (groupCategoryId === GROUP_CATEGORY.RESEARCH_LAB) {
    // 🔬 研究室公開: 会場申請、物品申請、電力申請、PR文申請、模擬店平面図申請、火器使用申請
    return (
      <>
        <VenueApplications
          isDeadline={!userPageSettings?.isEditPlace}
          isRegistered={checkAllRegisteredGroups?.placeOrder}
          groupId={groupId}
        />
        <RentItems
          isDeadline={!userPageSettings?.isEditRentalOrder}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
          status={getStatus('equipment')}
        />
        <Power
          isDeadline={!userPageSettings?.isEditPowerOrder}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
          status={getStatus('power_order')}
        />
        <PublicRelations
          isDeadline={!userPageSettings?.isEditPublicRelation}
          isRegistered={checkAllRegisteredGroups?.publicRelation}
          groupId={groupId}
        />
        <VenueMap
          isDeadline={!userPageSettings?.isEditVenueMap}
          isRegistered={checkAllRegisteredGroups?.venueMap}
          groupId={groupId}
          status={getStatus('venue_map')}
        />
        <FireEquipment
          canAdd={userPageSettings?.addFireEquipmentOrder}
          canEdit={userPageSettings?.isEditFireEquipmentOrder}
          isRegistered={checkAllRegisteredGroups?.fireEquipmentOrder}
          groupId={groupId}
          status={getStatus('fire_equipment_order')}
        />
      </>
    );
  } else if (groupCategoryId === GROUP_CATEGORY.EXHIBITION) {
    // 🎨 展示・体験: 会場申請、物品申請、電力申請、PR文申請、模擬店平面図申請、火器使用申請
    return (
      <>
        <VenueApplications
          isDeadline={!userPageSettings?.isEditPlace}
          isRegistered={checkAllRegisteredGroups?.placeOrder}
          groupId={groupId}
        />
        <RentItems
          isDeadline={!userPageSettings?.isEditRentalOrder}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
          status={getStatus('equipment')}
        />
        <Power
          isDeadline={!userPageSettings?.isEditPowerOrder}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
          status={getStatus('power_order')}
        />
        <PublicRelations
          isDeadline={!userPageSettings?.isEditPublicRelation}
          isRegistered={checkAllRegisteredGroups?.publicRelation}
          groupId={groupId}
        />
        <VenueMap
          isDeadline={!userPageSettings?.isEditVenueMap}
          isRegistered={checkAllRegisteredGroups?.venueMap}
          groupId={groupId}
          status={getStatus('venue_map')}
        />
        <FireEquipment
          canAdd={userPageSettings?.addFireEquipmentOrder}
          canEdit={userPageSettings?.isEditFireEquipmentOrder}
          isRegistered={checkAllRegisteredGroups?.fireEquipmentOrder}
          groupId={groupId}
          status={getStatus('fire_equipment_order')}
        />
      </>
    );
  } else if (groupCategoryId === GROUP_CATEGORY.COMMITTEE) {
    // 📋 実行委員会: 会場申請、物品申請、電力申請、PR文申請、模擬店平面図申請
    return (
      <>
        <VenueApplications
          isDeadline={!userPageSettings?.isEditPlace}
          isRegistered={checkAllRegisteredGroups?.placeOrder}
          groupId={groupId}
        />
        <RentItems
          isDeadline={!userPageSettings?.isEditRentalOrder}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
          status={getStatus('equipment')}
        />
        <Power
          isDeadline={!userPageSettings?.isEditPowerOrder}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
          status={getStatus('power_order')}
        />
        <PublicRelations
          isDeadline={!userPageSettings?.isEditPublicRelation}
          isRegistered={checkAllRegisteredGroups?.publicRelation}
          groupId={groupId}
        />
        <VenueMap
          isDeadline={!userPageSettings?.isEditVenueMap}
          isRegistered={checkAllRegisteredGroups?.venueMap}
          groupId={groupId}
          status={getStatus('venue_map')}
        />
      </>
    );
  }
  return null;
};

export default function HomePage() {
  const { user } = useUser();
  const userId = user?.id;
  const {
    groupUserIdAndGroupCategoryId,
    mutateGroupByUserId,
    isLoading: isLoadingGroupByUserId,
  } = useGetGroupByUserId(userId);
  const groupId = groupUserIdAndGroupCategoryId?.id;
  const displayGroupId = groupId ?? 0;
  const groupCategoryId = groupUserIdAndGroupCategoryId?.groupCategoryId;
  const { userPageSettings } = useGetUserPageSettings();
  const { checkAllRegisteredGroups, mutateCheckAllRegisteredGroups } =
    useGetCheckAllRegisteredGroups(groupId);
  const registrationStatus: CheckAllRegisteredGroups =
    checkAllRegisteredGroups ?? {};
  const isGroupRegistered = groupId ? registrationStatus.group === true : false;
  // Group の isRegistered(= isGroupRegistered)は、他の申請と違い未解決の
  // undefined を false に潰してしまうため、Group 側の「未解決なら編集モードを
  // 初期化しない」ガードが効かない。check_all_registered は groupId が判明して
  // から発火する分だけ必ず遅れるので、その解決まで待たないと登録済みでも
  // 常に編集フォームで開いてしまう。
  // 団体未作成(groupId なし)のときは永久ローディングを避けて解決済みとみなす。
  const isGroupResolved =
    userId !== undefined &&
    !isLoadingGroupByUserId &&
    (!groupId || checkAllRegisteredGroups !== undefined);
  const { healthCenterSubmissionStatus } =
    useGetHealthCenterSubmissionStatus(groupId);

  return (
    <div className="m-4 flex flex-col gap-10 lg:mx-10 lg:my-16 lg:flex-row lg:gap-0">
      <div className="order-2 flex flex-1 flex-col lg:order-1">
        {/* Group申請がまだの場合はGroup申請のみ表示 */}
        <Group
          isDeadline={!userPageSettings?.isRegistGroup}
          isRegistered={isGroupRegistered}
          groupId={displayGroupId}
          userId={userId || 0}
          isGroupResolved={isGroupResolved}
          mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
          mutateGroupByUserId={mutateGroupByUserId}
        />

        {isGroupRegistered && (
          <ViceRepresentative
            isDeadline={!userPageSettings?.isEditSubRep}
            isRegistered={registrationStatus.subRep}
            groupId={displayGroupId}
            mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
          />
        )}

        {isGroupRegistered && (
          <GroupCategoryContent
            groupCategoryId={groupCategoryId}
            userPageSettings={userPageSettings}
            checkAllRegisteredGroups={registrationStatus}
            groupId={displayGroupId}
            mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
            healthCenterSubmissionStatus={healthCenterSubmissionStatus}
          />
        )}
      </div>
      <div className="order-1 flex flex-1 items-start justify-center lg:order-2">
        <NewsList isLoginPage={false} />
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'ja', ['common'])),
  },
});
