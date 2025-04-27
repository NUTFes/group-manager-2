import { useGetUserPageSettings } from '@/api/userPageSettingAPI';
import Power from '@/components/Applications/Power';
import Stage from '@/components/Applications/Stage';
import StageOptions from '@/components/Applications/StageOptions';
import ViceRepresentative from '@/components/Applications/ViceRepresentative';

export default function Home() {
  const { userPageSettings } = useGetUserPageSettings();

  return (
    <>
      <ViceRepresentative isDeadline={false} />
      <StageOptions isDeadline={userPageSettings?.isEditStageCommonOption} />
      <Stage isDeadline={userPageSettings?.isEditStageCommonOption} />
      <Power groupId={1} isDeadline={false} isEdit={false} isExist={false} />
    </>
  );
}
