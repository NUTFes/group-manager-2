import type { GetStaticProps } from 'next';
import { useGetCheckAllRegisteredGroups } from '@/api/checkAllRegisteredApi';
import { useGetGroupByUserId } from '@/api/groupApi';
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
import { resolveApplicationAccess } from '@/components/Applications/accessControl';
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

const isApplicationDeadline = (
  isRegistered: boolean | undefined,
  canAdd: boolean | undefined,
  canEdit: boolean | undefined
) => resolveApplicationAccess({ isRegistered, canAdd, canEdit }).isDeadline;

type GroupCategoryContentProps = {
  groupCategoryId: number | undefined;
  userPageSettings: UserPageSettings | undefined;
  checkAllRegisteredGroups: CheckAllRegisteredGroups;
  groupId: number;
  mutateCheckAllRegisteredGroups: () => void;
};

const GroupCategoryContent = ({
  groupCategoryId,
  userPageSettings,
  checkAllRegisteredGroups,
  groupId,
  mutateCheckAllRegisteredGroups,
}: GroupCategoryContentProps) => {
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
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.rentalItem,
            userPageSettings?.addRentalOrder,
            userPageSettings?.isEditRentalOrder
          )}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
        />
        <Power
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.powerOrder,
            userPageSettings?.addPowerOrder,
            userPageSettings?.isEditPowerOrder
          )}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
        />
        <PublicRelations
          isDeadline={!userPageSettings?.isEditPublicRelation}
          isRegistered={checkAllRegisteredGroups?.publicRelation}
          groupId={groupId}
        />
        <Employees
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.employee,
            userPageSettings?.addEmployee,
            userPageSettings?.isEditEmployee
          )}
          isRegistered={checkAllRegisteredGroups?.employee}
          mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
          groupId={groupId}
        />
        <VenueMap
          isDeadline={!userPageSettings?.isEditVenueMap}
          isRegistered={checkAllRegisteredGroups?.venueMap}
          groupId={groupId}
        />
        <FoodProduct
          groupId={groupId}
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.foodProduct,
            userPageSettings?.addFoodProduct,
            userPageSettings?.isEditFoodProduct
          )}
          isRegistered={checkAllRegisteredGroups?.foodProduct}
        />
        <PurchaseLists
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.purchaseList,
            userPageSettings?.addPurchaseList,
            userPageSettings?.isEditPurchaseList
          )}
          isRegistered={checkAllRegisteredGroups?.purchaseList}
          groupId={groupId}
        />
        <CookingProcessOrder
          isDeadline={!userPageSettings?.isEditCookingProcess}
          isRegistered={checkAllRegisteredGroups?.cookingProcessOrder}
          groupId={groupId}
        />
        <FireEquipment
          canAdd={userPageSettings?.addFireEquipmentOrder}
          canEdit={userPageSettings?.isEditFireEquipmentOrder}
          isRegistered={checkAllRegisteredGroups?.fireEquipmentOrder}
          groupId={groupId}
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
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.rentalItem,
            userPageSettings?.addRentalOrder,
            userPageSettings?.isEditRentalOrder
          )}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
        />
        <Power
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.powerOrder,
            userPageSettings?.addPowerOrder,
            userPageSettings?.isEditPowerOrder
          )}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
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
        />
        <FoodProduct
          groupId={groupId}
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.foodProduct,
            userPageSettings?.addFoodProduct,
            userPageSettings?.isEditFoodProduct
          )}
          isRegistered={checkAllRegisteredGroups?.foodProduct}
        />
        <FireEquipment
          canAdd={userPageSettings?.addFireEquipmentOrder}
          canEdit={userPageSettings?.isEditFireEquipmentOrder}
          isRegistered={checkAllRegisteredGroups?.fireEquipmentOrder}
          groupId={groupId}
        />
      </>
    );
  } else if (groupCategoryId === GROUP_CATEGORY.STAGE) {
    // 🎤 ステージ団体: ステージ申請、ステージオプション申請、電力申請、PR文申請
    return (
      <>
        <RentItems
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.rentalItem,
            userPageSettings?.addRentalOrder,
            userPageSettings?.isEditRentalOrder
          )}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
        />
        <Stage
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.stageOrder,
            userPageSettings?.addStageOrder,
            userPageSettings?.isEditStageOrder
          )}
          isRegistered={checkAllRegisteredGroups?.stageOrder}
          groupId={groupId}
        />
        <StageOptions
          isDeadline={!userPageSettings?.isEditStageCommonOption}
          isRegistered={checkAllRegisteredGroups?.stageOption}
          groupId={groupId}
        />
        <Power
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.powerOrder,
            userPageSettings?.addPowerOrder,
            userPageSettings?.isEditPowerOrder
          )}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
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
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.rentalItem,
            userPageSettings?.addRentalOrder,
            userPageSettings?.isEditRentalOrder
          )}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
        />
        <Power
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.powerOrder,
            userPageSettings?.addPowerOrder,
            userPageSettings?.isEditPowerOrder
          )}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
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
        />
        <FireEquipment
          canAdd={userPageSettings?.addFireEquipmentOrder}
          canEdit={userPageSettings?.isEditFireEquipmentOrder}
          isRegistered={checkAllRegisteredGroups?.fireEquipmentOrder}
          groupId={groupId}
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
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.rentalItem,
            userPageSettings?.addRentalOrder,
            userPageSettings?.isEditRentalOrder
          )}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
        />
        <Power
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.powerOrder,
            userPageSettings?.addPowerOrder,
            userPageSettings?.isEditPowerOrder
          )}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
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
        />
        <FireEquipment
          canAdd={userPageSettings?.addFireEquipmentOrder}
          canEdit={userPageSettings?.isEditFireEquipmentOrder}
          isRegistered={checkAllRegisteredGroups?.fireEquipmentOrder}
          groupId={groupId}
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
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.rentalItem,
            userPageSettings?.addRentalOrder,
            userPageSettings?.isEditRentalOrder
          )}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
          groupCategoryId={groupCategoryId}
        />
        <Power
          isDeadline={isApplicationDeadline(
            checkAllRegisteredGroups?.powerOrder,
            userPageSettings?.addPowerOrder,
            userPageSettings?.isEditPowerOrder
          )}
          isRegistered={checkAllRegisteredGroups?.powerOrder}
          groupId={groupId}
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
  const isGroupResolved = userId !== undefined && !isLoadingGroupByUserId;
  const { userPageSettings } = useGetUserPageSettings();
  const { checkAllRegisteredGroups, mutateCheckAllRegisteredGroups } =
    useGetCheckAllRegisteredGroups(groupId);
  const registrationStatus: CheckAllRegisteredGroups =
    checkAllRegisteredGroups ?? {};
  const isGroupRegistered = groupId ? registrationStatus.group === true : false;

  return (
    <div className="m-4 flex flex-col gap-10 lg:mx-10 lg:my-16 lg:flex-row lg:gap-0">
      <div className="order-2 flex flex-1 flex-col lg:order-1">
        {/* Group申請がまだの場合はGroup申請のみ表示 */}
        <Group
          isDeadline={isApplicationDeadline(
            isGroupRegistered,
            userPageSettings?.isRegistGroup,
            userPageSettings?.isEditGroup
          )}
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
