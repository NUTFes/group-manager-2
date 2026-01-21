import { FC } from 'react';
import { useGetNews } from '@/api/newsApi';
import { format } from 'date-fns';
import FormContainer from '@/components/FormContainer';

type NewsListProps = {
  isLoginPage: boolean;
};

const NewsList: FC<NewsListProps> = () => {
  const { news, error, isLoading } = useGetNews();
  if (news == undefined) return [];

  const formattedDates = news.map((item) => {
    const date = new Date(item.createdAt);
    const formattedDate = format(date, 'yyyy/MM/dd');
    return formattedDate;
  });

  const newsList = news.map((item, index) => {
    const date = formattedDates[index] ?? 'お知らせはありません。';

    return (
      <div key={item.id} className="flex flex-col gap-2">
        <span className="w-24 text-base font-medium text-font">{date}</span>
        <span className="w-full whitespace-pre-line text-base font-medium text-font">
          {item.body}
        </span>
      </div>
    );
  });

  return (
    <div className="flex w-full max-w-[497px] items-center justify-center px-4">
      <FormContainer>
        <div className="mb-10 w-full max-w-[497px]">
          <div className="text-4xl font-bold text-main">お知らせ</div>
        </div>
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="text-base text-font">読み込み中...</div>
          ) : error ? (
            <div className="text-base text-font">エラーが発生しました</div>
          ) : (
            newsList
          )}
        </div>
      </FormContainer>
    </div>
  );
};

export default NewsList;
