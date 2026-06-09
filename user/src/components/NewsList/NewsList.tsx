import { FC } from 'react';
import { News, useGetNews } from '@/api/newsApi';
import { format } from 'date-fns';
import FormContainer from '@/components/FormContainer';
import { useNewsListTexts } from './hooks';

type NewsListProps = {
  isLoginPage: boolean;
};

const NewsList: FC<NewsListProps> = () => {
  const { news, error, isLoading } = useGetNews();
  const newsListTexts = useNewsListTexts();

  const sortedNews: News[] = [...(news ?? [])].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const formattedDates = sortedNews.map((item: News) => {
    const date = new Date(item.updatedAt);
    const formattedDate = format(date, 'yyyy/MM/dd');
    return formattedDate;
  });

  const newsList = sortedNews.map((item: News, index: number) => {
    const date = formattedDates[index] ?? newsListTexts.none;

    return (
      <div key={item.id} className="flex flex-col gap-2">
        <span className="w-24 text-base font-medium text-font">{date}</span>
        <span className="w-full whitespace-pre-line break-words text-base font-medium text-font">
          {item.body}
        </span>
      </div>
    );
  });

  return (
    <div className="flex w-full max-w-[497px] items-center justify-center px-4">
      <FormContainer>
        <div className="mb-10 w-full max-w-[497px]">
          <div className="text-4xl font-bold text-main">
            {newsListTexts.title}
          </div>
        </div>
        <div className="flex max-h-96 flex-col gap-4 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="text-base text-font">{newsListTexts.loading}</div>
          ) : error ? (
            <div className="text-base text-font">{newsListTexts.error}</div>
          ) : (
            newsList
          )}
        </div>
      </FormContainer>
    </div>
  );
};

export default NewsList;
