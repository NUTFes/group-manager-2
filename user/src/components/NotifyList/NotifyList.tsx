import { FC } from 'react';
import { Announcement } from '@/types/announcement';
import { format } from 'date-fns';
import FormContainer from '@/components/FormContainer';

type NotifyListProps = {
  announcements: Announcement[];
};

const NotifyList: FC<NotifyListProps> = ({ announcements }) => {
  const formattedDates = announcements.map((item) =>
    format(new Date(item.created_at), 'yyyy/MM/dd')
  );

  const announcementList = announcements.map((announcement, index) => {
    return (
      <div className="flex flex-col gap-2">
        <span className="w-24 text-base font-medium text-font">
          {formattedDates[index]}
        </span>
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
        <div className="flex flex-col gap-4 pl-10">{announcementList}</div>
      </FormContainer>
    </div>
  );
};

export default NotifyList;
