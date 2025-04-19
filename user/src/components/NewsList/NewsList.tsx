import { FC } from 'react';
import { useGetNews } from '@/api/newsApi';
import { format, parseISO } from 'date-fns';
import FormContainer from '@/components/FormContainer';

type NewsListProps = {
  isLoginPage: boolean;
};

const NewsList: FC<NewsListProps> = ({ isLoginPage }) => {
  const { news, error, isLoading } = useGetNews();

  const sortedNews = (news || []).slice().sort((a, b) => a.id - b.id);

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) {
      return '日付不明';
    }

    try {
      return format(parseISO(dateString), 'yyyy/MM/dd');
    } catch (error) {
      console.error('日付フォーマットエラー:', error);
      return '日付不明';
    }
  };

  const formattedDates = sortedNews.map((item) => formatDate(item.createdAt));

  const newsList = sortedNews.map((item, index) => {
    const date = formattedDates[index] ?? 'お知らせはありません。';

    return (
      <div key={item.id} className="flex flex-col gap-2">
        <span className="w-24 text-base font-medium text-font">{date}</span>
        <span className="w-56 text-base font-medium text-font">
          {item.body}
        </span>
      </div>
    );
  });

  return (
    <div className="flex items-center justify-center">
      <FormContainer>
        <div className={`${isLoginPage ? 'w-[800px]' : 'w-[497px]'} mb-10`}>
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
