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

  const sortedNews: News[] = [...(news ?? [])]
    .map((item, idx) => {
      let ts = Date.parse(item.updatedAt);
      if (Number.isNaN(ts)) {
        ts = 0;
      }
      return { item, ts, idx };
    })
    .sort((a, b) => {
      if (b.ts !== a.ts) {
        return b.ts - a.ts;
      }
      return a.idx - b.idx;
    })
    .map(({ item }) => item);

  const sortedNewsWithMeta = sortedNews.map((item: News) => {
    let formattedDate = '';
    try {
      const ts = Date.parse(item.updatedAt);
      if (Number.isNaN(ts)) {
        formattedDate = 'Invalid date';
      } else {
        formattedDate = format(new Date(ts), 'yyyy/MM/dd');
      }
    } catch {
      formattedDate = 'Invalid date';
    }
    return { item, formattedDate };
  });

  const newsList = sortedNewsWithMeta.map(({ item, formattedDate }) => {
    const date =
      formattedDate === 'Invalid date' ? newsListTexts.none : formattedDate;

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
