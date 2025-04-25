import { useGetCheckAllRegisteredGroups } from '@/api/checkAllRegisteredApi';
import { useGetUserPageSettings } from '@/api/userPageSettingAPI';
import Group from '@/components/Applications/Group';
import Power from '@/components/Applications/Power';
import PublicRelations from '@/components/Applications/PublicRelations';
import Stage from '@/components/Applications/Stage';
import StageOptions from '@/components/Applications/StageOptions';
import NewsList from '@/components/NewsList';

export default function HomePage() {
  const { userPageSettings } = useGetUserPageSettings();
  const { checkAllRegisteredGroups } = useGetCheckAllRegisteredGroups(1);

  return (
    <div className="m-4 flex flex-col gap-10 lg:mx-10 lg:my-16 lg:flex-row">
      <div className="flex flex-1 flex-col">
        <Group
          isDeadline={userPageSettings?.isRegistGroup}
          isRegistered={checkAllRegisteredGroups?.group}
        />
        <ApplicationForm name="副代表申請" />
        <ApplicationForm name="会場申請" />
        <ApplicationForm name="物品申請" />
        <Stage isDeadline={userPageSettings?.isEditStageOrder} />
        <StageOptions isDeadline={userPageSettings?.isEditStageCommonOption} />
        <Power isDeadline={userPageSettings?.isEditStageOrder} />
        <PublicRelations
          groupId={1}
          isDeadline={userPageSettings?.isEditPublicRelation}
        />
      </div>
      <div className="flex flex-1 justify-center">
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
