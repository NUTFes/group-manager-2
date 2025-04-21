import { useGetUserPageSettings } from '@/api/userPageSettingAPI';
import Stage from '@/components/Applications/Stage';
import StageOptions from '@/components/Applications/StageOptions';

export default function Home() {
  const { userPageSettings } = useGetUserPageSettings();

  return (
    <>
      <StageOptions isDeadline={userPageSettings?.isEditStageCommonOption} />
      <Stage isDeadline={userPageSettings?.isEditStageCommonOption} />
    </>
  );
}
