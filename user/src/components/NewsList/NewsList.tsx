import { FC } from 'react';
import { useGetNews } from '@/api/newsApi';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';
import FormContainer from '@/components/FormContainer';

type NewsListProps = {
  isLoginPage: boolean;
};

const NewsList: FC<NewsListProps> = () => {
  const { news, error, isLoading } = useGetNews();
  const { t } = useTranslation('common');

  const sortedNews = (news || []).slice().sort((a, b) => a.id - b.id);

  const formattedDates = sortedNews.map((item) => {
    const date = new Date(item.createdAt);
    const formattedDate = format(date, 'yyyy/MM/dd');
    return formattedDate;
  });

  const newsList = sortedNews.map((item, index) => {
    const date = formattedDates[index] ?? t('news.none');

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
          <div className="text-4xl font-bold text-main">{t('news.title')}</div>
        </div>
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="text-base text-font">{t('news.loading')}</div>
          ) : error ? (
            <div className="text-base text-font">{t('news.error')}</div>
          ) : (
            newsList
          )}
        </div>
      </FormContainer>
    </div>
  );
};

export default NewsList;
