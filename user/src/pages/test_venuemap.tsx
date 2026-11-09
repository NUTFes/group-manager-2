import VenueMap from '@/components/Applications/VenueMap';

export default function TestVenueMapPage() {
  // TODO: 仮の値として groupId=1 を使用
  const groupId = 1;

  return (
    <div className="p-10">
      <VenueMap groupId={groupId} isDeadline={false} isRegistered={false} />
    </div>
  );
}
