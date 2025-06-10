import { useGetCheckAllRegisteredGroups } from '@/api/checkAllRegisteredApi';
import { useGetGroupByUserId } from '@/api/groupApi';
import { useGetUserPageSettings } from '@/api/userPageSettingAPI';
import Group from '@/components/Applications/Group';
import RentItems from '@/components/Applications/MultiItemForms/RentItems';
import Power from '@/components/Applications/Power';
import PublicRelations from '@/components/Applications/PublicRelations';
import Stage from '@/components/Applications/Stage';
import StageOptions from '@/components/Applications/StageOptions';
import VenueApplications from '@/components/Applications/VenueApplication';
import ViceRepresentative from '@/components/Applications/ViceRepresentative';
import NewsList from '@/components/NewsList';
import { useUser } from '@/hooks/useUser';
import FoodProduct from "@/components/Applications/FoodProduct";

export default function HomePage() {
    const { user } = useUser();
    const userId = user?.id;
    const { groupUserIdAndGroupCategoryId, mutateGroupByUserId } =
        useGetGroupByUserId(userId);
    const groupId = groupUserIdAndGroupCategoryId?.id ?? 0;
    const groupCategoryId = groupUserIdAndGroupCategoryId?.groupCategoryId;
    const { userPageSettings } = useGetUserPageSettings();
    const { checkAllRegisteredGroups, mutateCheckAllRegisteredGroups } =
        useGetCheckAllRegisteredGroups(groupId);

    const GroupCategoryContent = () => {
        if (groupCategoryId === 6) {
            return (
                <>
                    <RentItems
                        isDeadline={!userPageSettings?.isEditRentalOrder}
                        isRegistered={checkAllRegisteredGroups?.rentalItem}
                        groupId={groupId}
                        groupCategoryId={groupCategoryId} // groupCategoryIdを追加
                    />
                    <Power
                        isDeadline={!userPageSettings?.isEditPowerOrder}
                        isRegistered={checkAllRegisteredGroups?.powerOrder}
                        groupId={groupId}
                    />
                </>
            );
        } else if (groupCategoryId === 3) {
            return (
                <>
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
                    <RentItems
                        isDeadline={!userPageSettings?.isEditRentalOrder}
                        isRegistered={checkAllRegisteredGroups?.rentalItem}
                        groupId={groupId}
                        groupCategoryId={groupCategoryId} // groupCategoryIdを追加
                    />
                    <Power
                        isDeadline={!userPageSettings?.isEditPowerOrder}
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
        } else {
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
                        groupCategoryId={groupCategoryId} // groupCategoryIdを追加
                    />
                    <Power
                        isDeadline={!userPageSettings?.isEditPowerOrder}
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
        }
    };

    return (
        <div className="m-4 flex flex-col gap-10 lg:mx-10 lg:my-16 lg:flex-row lg:gap-0">
            <div className="order-2 flex flex-1 flex-col lg:order-1">
                {/* Group申請がまだの場合はGroup申請のみ表示 */}
                {!checkAllRegisteredGroups?.group ? (
                    <Group
                        isDeadline={!userPageSettings?.isRegistGroup}
                        isRegistered={checkAllRegisteredGroups?.group}
                        groupId={groupId}
                        userId={userId || 0}
                        mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
                        mutateGroupByUserId={mutateGroupByUserId}
                    />
                ) : (
                    <>
                        <Group
                            isDeadline={!userPageSettings?.isRegistGroup}
                            isRegistered={checkAllRegisteredGroups?.group}
                            groupId={groupId}
                            userId={userId || 0}
                            mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
                            mutateGroupByUserId={mutateGroupByUserId}
                        />
                        <ViceRepresentative
                            isDeadline={!userPageSettings?.isEditSubRep}
                            isRegistered={checkAllRegisteredGroups?.subRep}
                            groupId={groupId}
                            mutateCheckAllRegisteredGroups={mutateCheckAllRegisteredGroups}
                        />
                        <FoodProduct
                            groupId={groupId}
                            isDeadline={!userPageSettings?.isEditSubRep}
                            isRegistered={checkAllRegisteredGroups?.subRep}
                        />
                        <GroupCategoryContent />
                    </>
                )}
            </div>
            <div className="order-1 flex flex-1 items-start justify-center lg:order-2">
                <NewsList isLoginPage={false} />
            </div>
        </div>
    );
}