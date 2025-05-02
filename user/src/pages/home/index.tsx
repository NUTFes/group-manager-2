import { useGetCheckAllRegisteredGroups } from '@/api/checkAllRegisteredApi';
import { useGetUserPageSettings } from '@/api/userPageSettingAPI';
import Group from '@/components/Applications/Group';
import RentItems from '@/components/Applications/MultiItemForms/RentItems';
import Power from '@/components/Applications/Power';
import PublicRelations from '@/components/Applications/PublicRelations';
import Stage from '@/components/Applications/Stage';
import StageOptions from '@/components/Applications/StageOptions';
import VenueApplications from '@/components/Applications/VenueApplication';
import NewsList from '@/components/NewsList';

export default function HomePage() {
  // todo: これgroupsのgetで取得したい。
  const groupId = 7;
  const { userPageSettings } = useGetUserPageSettings();
  const { checkAllRegisteredGroups } = useGetCheckAllRegisteredGroups(groupId);

  return (
    <div className="m-4 flex flex-col gap-10 lg:mx-10 lg:my-16 lg:flex-row lg:gap-0">
      <div className="order-2 flex flex-1 flex-col lg:order-1">
        <Group
          isDeadline={!userPageSettings?.isRegistGroup}
          isRegistered={checkAllRegisteredGroups?.group}
          groupId={groupId}
        />
        <ApplicationForm name="副代表申請" />
        <VenueApplications
          isDeadline={!userPageSettings?.isEditPlace}
          isRegistered={checkAllRegisteredGroups?.placeOrder}
          groupId={groupId}
        />
        <RentItems
          isDeadline={!userPageSettings?.isEditRentalOrder}
          isRegistered={checkAllRegisteredGroups?.rentalItem}
          groupId={groupId}
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
        />
        <PublicRelations
          isDeadline={!userPageSettings?.isEditPublicRelation}
          isRegistered={checkAllRegisteredGroups?.publicRelation}
          groupId={groupId}
        />
      </div>
      <div className="order-1 flex flex-1 items-start justify-center lg:order-2">
        <NewsList isLoginPage={false} />
      </div>
    </div>
  );
}

const ApplicationForm = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col gap-10">
      <div className="mx-auto flex h-20 w-[450px] items-center justify-center bg-slate-500 md:w-[560px]">
        {name}
      </div>
    </div>
  );
};
