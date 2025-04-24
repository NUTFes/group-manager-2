import { useGetUserPageSettings } from '@/api/userPageSettingAPI';
import Power from '@/components/Applications/Power';
import PublicRelations from '@/components/Applications/PublicRelations';
import Stage from '@/components/Applications/Stage';
import StageOptions from '@/components/Applications/StageOptions';

export default function Home() {
  const { userPageSettings } = useGetUserPageSettings();

  return (
    <>
      <StageOptions isDeadline={userPageSettings?.isEditStageCommonOption} />
      <Stage isDeadline={userPageSettings?.isEditStageCommonOption} />
      <Power isDeadline={userPageSettings?.isEditStageCommonOption} />
      <PublicRelations groupId={1} isDeadline={false}></PublicRelations>
    </>
  );
}
