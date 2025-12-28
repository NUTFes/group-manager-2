import PublicRelations from '@/components/Applications/PublicRelations/PublicRelations';

export default function Home() {
  // TODO: 仮の値として groupId=1 を使用
  const groupId = 1;

  return (
    <PublicRelations
      groupId={groupId}
      isDeadline={false}
      isRegistered={false}
    />
  );
}
