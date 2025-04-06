import PublicRelationsForm from '@/components/PublicRelations/PublicRelationsForm';

export default function Home() {
  // 本来はページのコンテキストやpropsから適切なgroupIdを取得するべきですが、
  // 現段階では固定値として1を設定しています
  const groupId = 1;

  return <PublicRelationsForm groupId={groupId} />;
}
