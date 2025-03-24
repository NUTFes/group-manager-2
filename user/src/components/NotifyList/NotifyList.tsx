import { FC } from 'react';
import { useGetAnnouncements } from '@/api/announcementsAPI';
import { format } from 'date-fns';
import FormContainer from '@/components/FormContainer';

type NotifyListProps = {};

const NotifyList: FC<NotifyListProps> = () => {
  // FIX: ログイン認証実装で修正する。
  const testGroupID = 1;

  const { announcements, error, isLoading } = useGetAnnouncements(testGroupID);

  const formattedDates = (announcements || []).map((item) =>
    format(new Date(item.created_at), 'yyyy/MM/dd')
  );

  const announcementList = announcements?.map((announcement, index) => {
    const date = formattedDates[index] ?? 'お知らせはありません。';

    return (
      <div key={announcement.id} className="flex flex-col gap-2">
        <span className="w-24 text-base font-medium text-font">{date}</span>
        <span className="w-56 text-base font-medium text-font">
          {announcement.message}
        </span>
      </div>
    );
  });

  return (
    <div className="flex items-center justify-center">
      <FormContainer>
        <div className="w-[497px] mb-10">
          <div className="text-4xl font-bold text-main">お知らせ</div>
        </div>
        <div className="flex flex-col gap-4 pl-10">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error occurred</div>
          ) : (
            announcementList
          )}
        </div>
      </FormContainer>
    </div>
  );
};

export default NotifyList;
